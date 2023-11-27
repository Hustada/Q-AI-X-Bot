# Q-AI-X-Bot

## Overview
Q-AI-X-Bot is an automated content generation bot inspired by the iconic character Q from Star Trek. Using OpenAI's GPT technology, the bot creates imaginative and engaging posts themed around Q's adventures and style, which are then automatically published on the X platform.

## Features
- **Content Generation**: Leverages OpenAI's GPT models to generate creative and unique content.
- **Automated Posting**: Automatically posts generated content to the X platform at regular intervals.
- **Customizability**: Easily customizable content generation parameters.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- Access to OpenAI API with an API key.
- An account on the X platform with necessary API credentials.

### Installation
1. **Clone the Repository**: 
git clone https://github.com/Hustada/Q-AI-X-Bot.git
cd Q-AI-X-Bot


2. **Install Dependencies**:
```npm install```


3. **Set Up Environment Variables**:
- Create a `.env` file in the root directory.
- Add your OpenAI API key and X platform credentials:
  ```
  OPENAI_API_KEY=your_openai_api_key
  X_PLATFORM_APP_KEY=your_app_key
  X_PLATFORM_APP_SECRET=your_app_secret
  X_PLATFORM_ACCESS_TOKEN=your_access_token
  X_PLATFORM_ACCESS_SECRET=your_access_secret
  ```

### Usage
To start the bot, run: ```node bot.js```


## Configuration
- **Bot Schedule**: Modify the cron schedule in `bot.js` to set the frequency of posts.
- **Content Customization**: Change the prompt in `generateTweetContent` function to modify the theme of generated content.

## Contributing
Contributions to the Q-AI-X-Bot are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
- Star Trek and the character Q, which inspired the theme of this bot.
- OpenAI for providing the GPT API used for content generation.

