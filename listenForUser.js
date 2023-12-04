require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');

// Twitter client setup
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const openAiKey = process.env.OPENAI_API_KEY;
const targetUsername = 'hustadvicka'; // Replace with the target user's username
let lastTweetId = ''; // To keep track of the last replied tweet

// Function to generate a reply using OpenAI
async function generateReplyContent(tweetText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        prompt: `As Q from Star Trek, respond to this tweet: "${tweetText}"`,
        max_tokens: 60
      },
      { headers: { 'Authorization': `Bearer ${openAiKey}` } }
    );
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error generating reply:', error);
    return `Sorry, I could not generate a reply.`;
  }
}

// Function to post a reply
async function postReply(replyContent, tweetId) {
  try {
    await twitterClient.v2.reply(replyContent, tweetId);
    console.log(`Replied to tweet: ${tweetId}`);
  } catch (error) {
    console.error('Error posting reply:', error);
  }
}

// Function to check for new tweets from the target user
async function checkAndReplyToNewTweets() {
  try {
    const userResponse = await twitterClient.v2.userByUsername(targetUsername);
    const userId = userResponse?.data?.id;

    if (!userId) {
      console.log(`User ID not found for username: ${targetUsername}`);
      return;
    }

    console.log(`User ID for ${targetUsername}: ${userId}`);

    let params = { exclude: 'replies' };
    if (lastTweetId) {
      params.since_id = lastTweetId;
    }
    console.log(`Fetching tweets with params: ${JSON.stringify(params)}`); // Debugging line

    const tweetsResponse = await twitterClient.v2.userTimeline(userId, params);

    if (tweetsResponse.data && tweetsResponse.data.length > 0) {
      console.log(`Found ${tweetsResponse.data.length} new tweets.`);
      lastTweetId = tweetsResponse.data[0].id;

      for (const tweet of tweetsResponse.data) {
        const replyContent = await generateReplyContent(tweet.text);
        await postReply(replyContent, tweet.id);
      }
    } else {
      console.log("No new tweets found.");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Start the polling process
function startPolling() {
  const interval = 60 * 1000; // 60 seconds - adjust as needed
  setInterval(checkAndReplyToNewTweets, interval);
}

startPolling();
