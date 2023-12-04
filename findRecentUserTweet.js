require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

// Twitter client setup
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Function to get and log the most recent tweet of a user
async function logLatestTweet(username) {
  try {
    // Fetch user ID by username
    const userResponse = await twitterClient.v2.userByUsername(username);
    const userId = userResponse?.data?.id;
    if (!userId) {
      console.log(`User not found: ${username}`);
      return;
    }

    // Fetch recent tweets of the user
    const tweetsResponse = await twitterClient.v2.userTimeline(userId, { max_results: 5 });
    const tweets = tweetsResponse?.data?.data; // Ensure correct data structure
    if (!tweets || tweets.length === 0) {
      console.log(`No tweets found for user: ${username}`);
      return;
    }

    // Log the most recent tweet
    const latestTweet = tweets[0];
    console.log(`Most recent tweet by ${username}:`);
    console.log(latestTweet.text);
  } catch (error) {
    console.error(`Error fetching tweets for ${username}:`, error);
  }
}

// Example usage - replace 'username' with the target Twitter username
const targetUsername = 'hustadvicka';
logLatestTweet(targetUsername);
