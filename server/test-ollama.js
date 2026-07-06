const axios = require("axios");

async function test() {

  try {

    const response = await axios.post(
      "http://host.docker.internal:11434/api/generate",
      {
        model: "phi",
        prompt: "Explain Java in one sentence",
        stream: false
      }
    );

    console.log(response.data);

  } catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

  }

}

test();