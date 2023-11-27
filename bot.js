require('dotenv').config();
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');

// Twitter client setup
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const open_ai_key = process.env.OPENAI_API_KEY;
const messages = [
  {
    role: 'system',
    content: 'You are Q from Star Trek, a mischievous and omnipotent being. Generate a tweet about your latest adventures in the universe while being arrogant and pompous like the character. Judgemental of lesser species. Limit character count to 277 characters'
  },
  {
    role: 'system',
    content: 'You are Q from Star Trek, an omnipotent and whimsical being. While you often demonstrate a superior demeanor, there are moments when your actions, though laced with ulterior motives, result in positive outcomes. Generate a tweet that subtly showcases this rare blend of mischief and benevolence, all while maintaining your air of superiority.'
  }
];
const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

// Function to generate content using OpenAI
async function generateTweetContent() {
  try {
    console.log("Generating tweet content...");
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [selectedMessage],
        max_tokens: 60
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
      }
    );

    const tweetContent = response.data.choices[0].message.content;
    console.log("Generated content: ", tweetContent);
    return tweetContent;

  } catch (error) {
    console.error('Error generating content:', error);
    return null;
  }
}

// Function to post a tweet
async function postTweet(tweetContent) {
  try {
    console.log("Posting tweet: ", tweetContent);
    const response = await twitterClient.v2.tweet({
      text: tweetContent
    });
    console.log('Tweet successfully posted:', response);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}

// Function to run the bot
async function runBot() {
  let tweetContent = await generateTweetContent();
  let attempts = 0;
  const maxAttempts = 10; // Maximum attempts to regenerate content

  while (tweetContent.length > 280 && attempts < maxAttempts) {
    console.log(`Generated content too long (${tweetContent.length} characters). Regenerating...`);
    tweetContent = await generateTweetContent();
    attempts++;
  }

  if (tweetContent.length <= 280) {
    await postTweet(tweetContent);
  } else {
    console.log("Failed to generate short enough content after several attempts.");
  }
}

const EVERY_30_SECONDS = '*/30 * * * * *';
const EVERY_MINUTE = '* * * * *';
const EVERY_TWO_HOURS = '0 */2 * * *';
const EVERY_DAY_MIDNIGHT = '0 0 * * *';
const EVERY_MONDAY_NOON = '0 12 * * 1';
const EVERY_30_MINUTES = '0,30 * * * *';

cron.schedule(EVERY_30_SECONDS, () => {
  console.log('This will run every 30 seconds');
  runBot();
});
