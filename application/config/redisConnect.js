const process = require("process");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");
const dotenv = require("dotenv");
const { infoLog, errorLog } = require("./logger");
dotenv.config();

const redisClient = createClient({
	url: `redis://${process.env.REDIS_URL}`,
});

let redisStore = new RedisStore({
	client: redisClient,
	prefix: "form-filling:",
});

async function connectRedis() {
	try {
		infoLog("Connecting with Redis");
		await redisClient.connect();
	} catch (error) {
		errorLog("Error: while connecting with redis");
	}
}

async function flushRedisCache() {
	try {
		infoLog("Flusing out redis cache");
		await redisClient.flushAll();
		infoLog("Success Flusing out redis cache");
		return { message: "Successfully flushed redis cache", success: true };
	} catch (error) {
		infoLog("Error Flusing out redis cache");
		return { message: "Error Flusing out redis cache", success: false };
	}
}

module.exports = { redisStore, redisClient, connectRedis, flushRedisCache };
