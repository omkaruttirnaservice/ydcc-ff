require("dotenv").config();
const { default: axios } = require("axios");
const cron = require("node-cron");
const { infoLog } = require("../application/config/logger.js");

const sendSummaryCron = () => {
	console.log("Start Sending summary emails...");
	axios.get(`${process.env.INTERNAL_API_URL}/summary/v2/get`);
	console.log("Done Sending summary emails...");
};

// cron.schedule("0 17 * * *", sendSummaryCron);
// cron.schedule("0 17 * * *", sendSummaryCron);
cron.schedule("30 17 * * *", sendSummaryCron);
cron.schedule("0 9 * * *", sendSummaryCron);

const getDbBackup = () => {
	infoLog("Generating db backup...");
	axios.get(`${process.env.INTERNAL_API_URL}/db-backup/generate`);
};

// cron.schedule("*/10 * * * * *", getDbBackup);
