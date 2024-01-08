require('dotenv').config();
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const prompts = require('./prompts');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'bot.log') })
  ]
});

// Twitter client setup
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const open_ai_key = process.env.OPENAI_API_KEY;

// Function to randomly select a prompt
function getRandomPrompt() {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Function to generate content using OpenAI
async function generateTweetContent() {
  const selectedMessage = getRandomPrompt();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [selectedMessage],
        max_tokens: 60
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${open_ai_key}`
        },
      }
    );

    let tweetContent = response.data.choices[0].message.content;

    // Truncate to the last complete sentence if over character limit
    if (tweetContent.length > 280) {
      tweetContent = truncateToLastCompleteSentence(tweetContent);
    }

    return tweetContent;

  } catch (error) {
    logger.error('Error generating content: ' + error.message);
    return null;
  }
}

// Function to truncate content to the last complete sentence
function truncateToLastCompleteSentence(text) {
  const sentenceEndRegex = /[.!?]\s/;
  const sentences = text.split(sentenceEndRegex);
  
  if (!sentenceEndRegex.test(text.slice(-2))) {
    sentences.pop();
  }
  
  return sentences.join('. ') + (sentences.length > 0 ? '.' : '');
}

// Function to post a tweet
async function postTweet(tweetContent) {
  try {
    await twitterClient.v2.tweet({ text: tweetContent });
    console.log('Tweet Successfully posted!');
    logger.info('Tweet successfully posted');
  } catch (error) {
    if (error.code === 429) {
      logger.error('Rate limit exceeded. Waiting to retry...');
      setTimeout(() => postTweet(tweetContent), 15 * 60 * 1000);
    } else {
      logger.error('Error posting tweet: ' + error.message);
    }
  }
}

// Function to run the bot
async function runBot() {
  const tweetContent = await generateTweetContent();
  if (tweetContent && tweetContent.length <= 280) {
    await postTweet(tweetContent);
  } else {
    logger.info('Generated content is too long. Skipping...');
  }
}

// Scheduling the bot to run at specified intervals
const EVERY_30_SECONDS = '*/30 * * * * *';
const EVERY_MINUTE = '* * * * *';
const EVERY_TWO_HOURS = '0 */2 * * *';
const EVERY_DAY_MIDNIGHT = '0 0 * * *';
const EVERY_MONDAY_NOON = '0 12 * * 1';
const EVERY_30_MINUTES = '*/30 * * * *';
cron.schedule(EVERY_30_MINUTES, runBot);

// Start the bot
runBot().catch(e => logger.error(e.message));

// Export the logger if you want to use it in other files
module.exports.logger = logger;



