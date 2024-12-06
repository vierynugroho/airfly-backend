// Require Package

import postmanToOpenApi from 'postman-to-openapi';

// Postman Collection Path
const postmanCollection =
  './public/docs/flight-ticketing.postman_collection.json';
// Output OpenAPI Path
const outputFile = './public/docs/swagger.yml';

// Async/await
try {
  const result = postmanToOpenApi(postmanCollection, outputFile, {
    defaultTag: 'General',
  });

  console.log(`OpenAPI specs: ${result}`);
} catch (err) {
  console.log(err);
}

// Promise callback style
postmanToOpenApi(postmanCollection, outputFile, { defaultTag: 'General' })
  .then((result) => {
    console.log(`OpenAPI specs: ${result}`);
  })
  .catch((err) => {
    console.log(err);
  });
