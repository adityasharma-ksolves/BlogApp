const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-14601.c14.us-east-1-2.ec2.cloud.redislabs.com",
    port: 14601,
  },
});
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (err) {
    console.error("❌ Redis connection failed:", err.message);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};

// change

//  redis-cli
// redis-cli -h redis-14601.c14.us-east-1-2.ec2.cloud.redislabs.com -p 14601 -a BZOHJlLA2pZmqxTWtJ3MO0TmanByvZBr


// change