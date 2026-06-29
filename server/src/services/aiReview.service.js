const axios = require("axios");

const getAIReview = async (code) => {

  try {

    const response = await axios.post(
      "http://host.docker.internal:11434/api/generate",
      {

        model: "tinyllama",

        prompt: `
You are a code reviewer.

Analyze ONLY the code below.

Return JSON format:

{
  "issues": [
    {
      "type": "Bug",
      "message": "..."
    }
  ]
}

If no issues exist return:

{
  "issues": []
}

Code:

${code.slice(0, 2000)}
`,

        stream: false

      },
      {
        timeout: 120000
      }
    );

    return response.data.response;

  } catch (error) {

    console.log(
      "Ollama Error:",
      error.response?.data ||
      error.message
    );

    return `AI ERROR: ${
      error.response?.data?.error ||
      error.message
    }`;

  }

};

module.exports = {
  getAIReview
};