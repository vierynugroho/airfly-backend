import postmanToOpenApi from 'postman-to-openapi';
import { readFileSync, writeFileSync } from 'fs';
import { load, dump } from 'js-yaml';

class PostmanToOpenAPIConverter {
  constructor(options) {
    this.options = options;
  }

  transformPathParameters(spec) {
    const transformedSpec = JSON.parse(JSON.stringify(spec));

    Object.keys(transformedSpec.paths).forEach((pathKey) => {
      const pathMethods = transformedSpec.paths[pathKey];
      const swaggerPathKey = pathKey.replace(/:([\w-]+)/g, '{$1}');

      if (swaggerPathKey !== pathKey) {
        transformedSpec.paths[swaggerPathKey] = pathMethods;
        delete transformedSpec.paths[pathKey];
      }

      Object.values(pathMethods).forEach((method) => {
        const pathParams = swaggerPathKey.match(/\{([^}]+)\}/g) || [];
        method.parameters = method.parameters || [];

        pathParams.forEach((param) => {
          const paramName = param.replace(/[{}]/g, '');

          const existingParam = method.parameters.find(
            (p) => p.name === paramName && p.in === 'path'
          );

          if (!existingParam) {
            method.parameters.push({
              name: paramName,
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            });
          }
        });
      });
    });

    return transformedSpec;
  }

  enhanceAuthentication(spec) {
    const transformedSpec = JSON.parse(JSON.stringify(spec));

    const postmanCollection = JSON.parse(
      readFileSync(this.options.postmanCollection, 'utf8')
    );

    let hasAuthenticatedRequests = false;

    Object.keys(transformedSpec.paths).forEach((pathKey) => {
      const pathMethods = transformedSpec.paths[pathKey];

      Object.keys(pathMethods).forEach((methodName) => {
        const method = pathMethods[methodName];
        const correspondingItem = this.findCorrespondingPostmanItem(
          postmanCollection,
          pathKey,
          methodName
        );

        const authType = correspondingItem?.request?.auth?.type;

        if (authType === 'noauth') {
          delete method.security;
        } else {
          method.security = [{ bearerAuth: [] }];
          hasAuthenticatedRequests = true;
        }
      });
    });

    if (!hasAuthenticatedRequests) {
      if (transformedSpec.components?.securitySchemes) {
        delete transformedSpec.components.securitySchemes;
      }
      if (transformedSpec.security) {
        delete transformedSpec.security;
      }
    } else {
      transformedSpec.components = transformedSpec.components || {};
      transformedSpec.components.securitySchemes = transformedSpec.components
        .securitySchemes || {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      };

      transformedSpec.security = transformedSpec.security || [
        { bearerAuth: [] },
      ];
    }

    return transformedSpec;
  }

  findCorrespondingPostmanItem(postmanCollection, pathKey, methodName) {
    const findItem = (items) => {
      for (const item of items) {
        if (
          item.request &&
          item.request.url.path.join('/') ===
            pathKey.split('/').filter(Boolean).join('/') &&
          item.request.method.toLowerCase() === methodName.toLowerCase()
        ) {
          return item;
        }

        if (item.item) {
          const subItem = findItem(item.item);
          if (subItem) return subItem;
        }
      }
      return null;
    };

    return findItem(postmanCollection.item);
  }

  addExampleResponses(spec, postmanCollection) {
    const transformedSpec = JSON.parse(JSON.stringify(spec));

    Object.keys(transformedSpec.paths).forEach((pathKey) => {
      const pathMethods = transformedSpec.paths[pathKey];

      Object.keys(pathMethods).forEach((methodName) => {
        const method = pathMethods[methodName];
        const correspondingItem = this.findCorrespondingPostmanItem(
          postmanCollection,
          pathKey,
          methodName
        );

        if (correspondingItem && correspondingItem.response) {
          method.responses = method.responses || {};

          correspondingItem.response.forEach((response) => {
            const statusCode = response.code || '200';
            method.responses[statusCode] = method.responses[statusCode] || {
              description: response.name || 'Response',
              content: {},
            };

            if (response.body) {
              method.responses[statusCode].content['application/json'] = {
                example: JSON.parse(response.body),
              };
            }
          });
        }
      });
    });

    return transformedSpec;
  }

  async convert() {
    try {
      const options = {
        defaultTag: 'General',
        servers: this.options.servers,
        disabledParams: {
          includeQuery: false,
          includeHeader: false,
          includePath: false,
        },
        keepOriginalPostmanFields: false,
      };

      await postmanToOpenApi(
        this.options.postmanCollection,
        this.options.outputFile,
        options
      );

      const specContent = readFileSync(this.options.outputFile, 'utf8');
      const spec = load(specContent);
      const postmanCollection = JSON.parse(
        readFileSync(this.options.postmanCollection, 'utf8')
      );

      if (spec.components && spec.components.securitySchemes) {
        delete spec.components.securitySchemes;
      }

      if (spec.security) {
        delete spec.security;
      }

      let transformedSpec = this.transformPathParameters(spec);
      transformedSpec = this.enhanceAuthentication(transformedSpec);
      transformedSpec = this.addExampleResponses(
        transformedSpec,
        postmanCollection
      );

      const yamlOutput = dump(transformedSpec, {
        lineWidth: -1,
      });

      writeFileSync(this.options.outputFile, yamlOutput);

      console.log(
        `OpenAPI specs successfully converted: ${this.options.outputFile}`
      );
      return transformedSpec;
    } catch (err) {
      console.error('Conversion error:', err);
      throw err;
    }
  }
}

async function main() {
  const converter = new PostmanToOpenAPIConverter({
    postmanCollection: './public/docs/flight-ticketing.postman_collection.json',
    outputFile: './public/docs/swagger.yml',
    servers: [
      {
        url: 'https://binar.azumidev.web.id/api/v1',
        description: 'production',
      },
      {
        url: 'http://localhost:3000/api/v1',
        description: 'development',
      },
    ],
  });

  try {
    await converter.convert();
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

main();
