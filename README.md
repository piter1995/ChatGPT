# Welcome to ChatGPT API _**FREE Reverse MOBILE Proxy**_

**ChatGPT API Free Reverse MOBILE Proxy** is a free reverse proxy to OpenAI API that allows users to access OpenAI API with an extra security layer.

# Table of Contents

- [Features](#features)
- [How to use ChatGPT API Reverse Proxy](#how-to-use-chatgpt-api-reverse-proxy)

  - [Self-Host Your Own API](#self-host-your-own-api)
  - [Use Our Hosted API](#use-our-hosted-api-reverse-proxy)
    - [Text Completion](#text-completion)
    - [Chat Completion (ChatGPT)](#chat-completion-chatgpt)
    - [Image Generation (DALL-E)](#image-generation-dall-e)
  - [Examples using OpenAI libraries](#examples-using-openai-libraries)
    - [Python](#python)
    - [Node.js](#nodejs)

- [License](#license)

## Features

- **Multiple OpenAI Keys** - You can use multiple OpenAI keys. The API will randomly choose one of the keys to use.
- **Moderation** - The API has a built-in moderation system that will automatically check the prompt before sending it to OpenAI API (To prevent OpenAI terminate the account for violating OpenAI's policy).
- **Streaming Response** - The API supports streaming response, so you can get the response as soon as it's available.
- **Same as Official** - The API has the same endpoints as the official API, so you can use the same code to access the API (even the official OpenAI libraries)
- **Free** - The API is free to use through our [hosted API](#use-our-hosted-api) (You can also self-host the API if you want).
- **Extra mobile security layers** - Extra middlewear checks (ex. UserAgent validation, MongoDB userId as request auth)

**Note:** Self-hosting it isn't free, you need to use your OpenAI Account credit.

## This is a Fork with some extra super powers! Read below before to proceed using this fork

In the past 6 months I have been trying securing my iOS App against any type of attack or OpenAI token leak, without much results that's why I decided to use a proxy and in specific to fork this one. So what I did and why?

**What's special** 

As it's mobile proxy oriented, we don't care much about the White listed IP's (WHITELISTED_IPS) because mobile apps don't have a unique IP from where the requests comes from but instead we do have a very specific User Agent which usually contains the name of our app, I added an extra verification layer in which you can specify which is/are the allowed useer agents (ALLOWED_USER_AGENTS). That's the first extra security step mobile oriented.

Next! I do usually use MongoDB for store things related to the users, in specific in my app, when a new user is registered I do create a unique id which is persisting over deletion / re-install (you could use Firebase AUTH or you can just use some fingerprinting methods). Storing then this Unique User ID into MongoDB, you have a list of Users which use your app.

Based on this, we can send as mandatory "header" of the request the "userid" of the device which is sending the request, so we can keep track of who is sending the requests and how many requests are basically sent from the same "userid". This means that if you will notice TOO many requests from the same userid, most likely they just managed to understand how does the whole authorization works and you can just "remove" this userId from your MongoDB for stop allowing requests through your proxy. Easy! It's a sort of "token" auth, but in a more easy way. 


### **What I need to do?**

As this is a special fork which uses MongoDB for iterate between a list of users and userid stored on your database / collection, you will definitely have to implement a way for save users from your app to your MongoDB and after that, you can just access from the proxy the collection and check if the user is present in the collection, if he is then we authorize the request to OpenAi, otherwise we decline it.

## How to use ChatGPT API Reverse Proxy

You can use ChatGPT API Reverse Proxy by choosing one of the following methods:

- [Self-Host Your Own API](#self-host-your-own-api)
- [Use Our Hosted API](#use-our-hosted-api-reverse-proxy)

‌

# Self-Host Your Own API

To self-host your own ChatGPT API, you can use the following steps:

1. [Create an OpenAI API Key](https://platform.openai.com/account/api-keys)
2. Clone this repository and install the dependencies:

```bash
git clone https://github.com/PawanOsman/ChatGPT.git
cd ChatGPT
npm install
```

3. Set your OpenAI key and other configurations in the `config.js` file.
4. Start the server:

```bash
npm start
```

4. Use the API by sending an HTTP request to the API endpoints for example:

```txt
http://localhost:3000/v1/completions
http://localhost:3000/v1/chat/completions
```

# Use Our Hosted API Reverse Proxy

To use our hosted ChatGPT API, you can use the following steps:

1. Join our [Discord](https://discord.pawan.krd) server.
2. Get your API key from the `#Bot` channel by sending `/key` command.
3. Use the API Key in your requests to the following endpoints.

## Text Completion:

```txt
https://api.pawan.krd/v1/completions
```

### Example: [OpenAI Docs](https://platform.openai.com/docs/api-reference/completions)

```bash
curl --location 'https://api.pawan.krd/v1/completions' \
--header 'Authorization: Bearer pk-***[OUR_API_KEY]***' \
--header 'Content-Type: application/json' \
--data '{
    "model": "text-davinci-003",
    "prompt": "Human: Hello\\nAI:",
    "temperature": 0.7,
    "max_tokens": 256,
    "stop": [
        "Human:",
        "AI:"
    ]
}'
```

## Chat Completion (ChatGPT):

```txt
https://api.pawan.krd/v1/chat/completions
```

### Example: [OpenAI Docs](https://platform.openai.com/docs/api-reference/chat)

```bash
curl --location 'https://api.pawan.krd/v1/chat/completions' \
--header 'Authorization: Bearer pk-***[OUR_API_KEY]***' \
--header 'Content-Type: application/json' \
--data '{
    "model": "gpt-3.5-turbo",
    "max_tokens": 100,
    "messages": [
        {
            "role": "system",
            "content": "You are an helpful assistant."
        },
        {
            "role": "user",
            "content": "Who are you?"
        }
    ]
}'
```

## Image Generation (DALL-E):

```txt
https://api.pawan.krd/v1/images/generations
```

### Example: [OpenAI Docs](https://platform.openai.com/docs/api-reference/images)

```bash
curl --location 'https://api.pawan.krd/v1/images/generations' \
--header 'Authorization: Bearer pk-***[OUR_API_KEY]***' \
--header 'Content-Type: application/json' \
--data '{
    "prompt": "a photo of a happy corgi puppy sitting and facing forward, studio light, longshot.",
    "n": 1,
    "size": "1024x1024"
}'
```

## Examples using OpenAI libraries

You can use the same code to access the API using the official OpenAI libraries, the only difference is that you need to change the API key and the API base URL.

Examples are for text completion, but you can use the same code for chat completion and image generation.

### Python

You need to add the following lines before your code to use the API:

```python
import openai

openai.api_key = 'pk-**********************************************'
openai.api_base = 'https://api.pawan.krd/v1'
```

Example code:

```python
import openai

openai.api_key = 'pk-**********************************************'
openai.api_base = 'https://api.pawan.krd/v1'

response = openai.Completion.create(
  model="text-davinci-003",
  prompt="Human: Hello\nAI:",
  temperature=0.7,
  max_tokens=256,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0,
  stop=["Human: ", "AI: "]
)

print(response.choices[0].text)
```

### Node.js

You need to add the following lines before your code to use the API:

```js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: "pk-**********************************************",
	basePath: "https://api.pawan.krd/v1",
});
```

Example code:

```js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: "pk-**********************************************",
	basePath: "https://api.pawan.krd/v1",
});

const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
	model: "text-davinci-003",
	prompt: "Human: Hello\nAI:",
	temperature: 0.7,
	max_tokens: 256,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0,
	stop: ["Human: ", "AI: "],
});

console.log(response.data.choices[0].text);
```

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
