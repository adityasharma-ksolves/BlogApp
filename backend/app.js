const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
require("dotenv").config();
const cors =require('cors');
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const {connectRedis,redisClient}=require("./redis.js")

app.use(loggerMiddleware);
app.use(express.json());
app.use(cors())
app.use(cookieParser());


app.use("/api", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
const startServer = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
