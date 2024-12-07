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
      delete transformedSpec.components?.securitySchemes;
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
    }

    return transformedSpec;
  }

  findCorrespondingPostmanItem(postmanCollection, pathKey, methodName) {
    const normalizePath = (path) => path.replace(/:([\w-]+)/g, '{$1}');

    const findItem = (items) => {
      for (const item of items) {
        if (
          item.request &&
          normalizePath(item.request.url.path.join('/')) ===
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

          const responseGroups = correspondingItem.response.reduce(
            (acc, response) => {
              const statusCode = response.code || '200';
              acc[statusCode] = acc[statusCode] || [];
              acc[statusCode].push(response);
              return acc;
            },
            {}
          );

          Object.entries(responseGroups).forEach(([statusCode, responses]) => {
            method.responses[statusCode] = method.responses[statusCode] || {
              description: 'Response',
              content: {},
            };

            // Cek apakah ada JSON response di antara semua responses
            const hasJsonResponse = responses.some((response) => {
              const contentType = response.header?.find(
                (h) => h.key.toLowerCase() === 'content-type'
              )?.value;
              return contentType?.includes('application/json');
            });

            responses.forEach((response) => {
              const contentType = response.header?.find(
                (h) => h.key.toLowerCase() === 'content-type'
              )?.value;

              if (contentType?.includes('text/html')) {
                if (!method.responses[statusCode].content['text/html']) {
                  method.responses[statusCode].content['text/html'] = {
                    examples: {},
                  };
                }

                const exampleName = response.name
                  ? response.name.replace(/[^a-zA-Z0-9-_]/g, '_')
                  : 'example';

                method.responses[statusCode].content['text/html'].examples[
                  exampleName
                ] = {
                  value: response.body,
                };
              } else if (contentType?.includes('application/json')) {
                if (responses.length > 1) {
                  method.responses[statusCode].content['application/json'] = {
                    examples: responses.reduce((examples, response) => {
                      const exampleName = response.name
                        ? response.name.replace(/[^a-zA-Z0-9-_]/g, '_')
                        : 'example';
                      let responseBody = {};

                      try {
                        responseBody = response.body
                          ? JSON.parse(response.body)
                          : {};
                      } catch (err) {
                        console.log(err.message);
                        console.warn(
                          'Invalid JSON body in response:',
                          response.body
                        );
                      }

                      examples[exampleName] = { value: responseBody };
                      return examples;
                    }, {}),
                  };
                } else {
                  const singleResponse = responses[0];
                  let responseBody = {};

                  try {
                    responseBody = singleResponse.body
                      ? JSON.parse(singleResponse.body)
                      : {};
                  } catch (err) {
                    console.log(err.message);
                    console.warn(
                      'Invalid JSON body in response:',
                      singleResponse.body
                    );
                  }

                  method.responses[statusCode].content['application/json'] = {
                    example: responseBody,
                  };
                }
              }
            });

            // Hapus application/json jika hanya ada response HTML
            if (!hasJsonResponse) {
              delete method.responses[statusCode].content['application/json'];
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

      let transformedSpec = this.transformPathParameters(spec);
      transformedSpec = this.enhanceAuthentication(transformedSpec);
      transformedSpec = this.addExampleResponses(
        transformedSpec,
        postmanCollection
      );

      delete transformedSpec.security;

      const yamlOutput = dump(transformedSpec, { lineWidth: -1 });
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
