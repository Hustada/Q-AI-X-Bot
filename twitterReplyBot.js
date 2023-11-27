require('dotenv').config();
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const open_ai_key = process.env.OPENAI_API_KEY;

// Twitter client setup
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const username = 'hustadvicka';
// Function to get a user's ID by their username
async function getUserIdByUsername(username) {
  try {
    const userData = await twitterClient.v2.userByUsername(username);
    console.log(userData);
    return userData.data.id;
  } catch (error) {
    console.error(`Error fetching user ID for ${username}:`, error);
    return null;
  }
}

// Function to generate a reply using OpenAI
async function generateReplyContent(tweetText) {
  try {
    const prompt = `As Q from Star Trek, respond to the following tweet: "${tweetText}"`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Q from Star Trek, a mischievous and omnipotent being.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 60
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${open_ai_key}`
        },
      }
    );

    const replyContent = response.data.choices[0].message.content;
    return replyContent;

  } catch (error) {
    console.error('Error generating reply:', error);
    return `Sorry, I couldn't come up with a reply.`;
  }
}

// Function to post a reply
async function postReply(replyContent, tweetId) {
  try {
    await twitterClient.v2.reply(replyContent, tweetId);
  } catch (error) {
    console.error('Error posting reply:', error);
  }
}

// Function to start the stream and listen for tweets
async function startStream(targetUserId) {
  try {
    const url = 'https://api.twitter.com/2/tweets/search/stream';
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      },
      responseType: 'stream'
    });

    response.data.on('data', async (chunk) => {
      const tweet = JSON.parse(chunk.toString());
      if (tweet.data.author_id === targetUserId) {
        const replyContent = await generateReplyContent(tweet.data.text);
        await postReply(replyContent, tweet.data.id);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage
const targetUsername = 'hustadvicka'; // Replace with the target username
getUserIdByUsername(targetUsername).then(userId => {
  if (userId) {
    console.log(`User ID for ${targetUsername}: ${userId}`);
    startStream(userId);
  }
});
