# Q-AI-X-Bot

## Overview
Q-AI-X-Bot is an automated content generation bot inspired by the iconic character Q from Star Trek. Using OpenAI's GPT technology, the bot creates imaginative and engaging posts themed around Q's adventures and style, which are then automatically published on the X platform.

## Features
- **Content Generation**: Leverages OpenAI's GPT models to generate creative and unique content.
- **Automated Posting**: Automatically posts generated content to the X platform at regular intervals.
- **Customizability**: Easily customizable content generation parameters.

## Example Q Interactions
Here are some examples of the type of content Q-AI-X-Bot generates:

1. **Classic Q Condescension**:
   > "Oh, how adorable! The humans are trying to understand quantum mechanics. It's like watching a tribble attempt calculus. Perhaps in a few million years... *dramatic sigh*"

2. **Time-Bending Musings**:
   > "Just popped by Earth's 31st century for tea. I must say, your descendants have marginally improved their understanding of space-time. Though they still can't comprehend why I find their linear existence so... limiting."

3. **Playful Chaos**:
   > "Turned all the coffee in Starfleet into Earl Grey tea today. You should have seen Picard's face when everyone started speaking with a British accent. The temporal mechanics of humor, mon capitaine!"

4. **Philosophical Pondering**:
   > "Watching humanity stumble through the cosmos reminds me why I find your species so fascinating. Like children playing with quantum mechanics... endearing, really. Should I tell them about the 12th dimension?"

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

