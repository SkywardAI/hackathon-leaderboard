const {marking} = require("./utils");

marking()
// console.log(`<assistant_response>
// <mark>80</mark>
// <reason>
// The submission demonstrates a comprehensive test suite for evaluating the deployment and functionality of the chat competition APIs. It covers various aspects, including:

// 1. Deployment Accuracy and Functionality (40%):
// - Tests the health check endpoint to ensure the API is accessible and running.
// - Verifies the chat completion functionality using both the OpenAI Python library and direct API requests.
// - Tests the streaming capability of the chat completion API.

// 2. Chat Competition API Integration (40%):
// - Tests the RAG (Retrieval-Augmented Generation) completion API by loading a dataset and making a sample request.
// - Tests the embedding API by sending a sample input and model.

// 3. Documentation and Usability (20%):
// - The code is well-structured and includes comments explaining the purpose and functionality of each test.
// - The tests cover essential aspects of the API, ensuring reliable operation and integration.

// However, there is room for improvement in the following areas:

// - The documentation could be more comprehensive, providing clear instructions on API setup, usage, and deployment process.
// - Error handling and edge case scenarios could be tested more thoroughly.
// - The test suite could include additional tests for other API endpoints or features, if applicable.

// Overall, the submission demonstrates a good effort in testing the chat competition APIs and meets most of the evaluation criteria.
// </reason>
// </assistant_response>`.match(/<assistant_response>\s*<mark>(?<mark>.*)<\/mark>\s*<reason>(?<reason>[\s\S]*?)<\/reason>\s*<\/assistant_response>/))