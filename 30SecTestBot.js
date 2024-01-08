require('dotenv').config();
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const prompts = require('./prompts');

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
        // response_format: 'json_object',
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
    console.error('Error generating content:', error);
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
    console.log('Tweet successfully posted');
  } catch (error) {
    if (error.code === 429) {
      console.error('Rate limit exceeded. Waiting to retry...');
      setTimeout(() => postTweet(tweetContent), 15 * 60 * 1000);
    } else {
      console.error('Error posting tweet:', error);
    }
  }
}

// Function to run the bot
async function runBot() {
  const tweetContent = await generateTweetContent();
  if (tweetContent && tweetContent.length <= 280) {
    await postTweet(tweetContent);
  } else {
    console.log('Generated content is too long. Skipping...');
  }
}

const EVERY_30_SECONDS = '*/30 * * * * *';
const EVERY_MINUTE = '* * * * *';
const EVERY_TWO_HOURS = '0 */2 * * *';
const EVERY_DAY_MIDNIGHT = '0 0 * * *';
const EVERY_MONDAY_NOON = '0 12 * * 1';
const EVERY_30_MINUTES = '0,30 * * * *';


cron.schedule(EVERY_30_SECONDS, runBot);
