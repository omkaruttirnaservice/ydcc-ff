require("dotenv").config();
const { default: axios } = require("axios");
const cron = require("node-cron");
const { infoLog } = require("../application/config/logger.js");

const sendSummaryCron = () => {
	console.log("Start Sending summary emails...");
	axios.get(`${process.env.INTERNAL_API_URL}/summary/v2/get`);
	console.log("Done Sending summary emails...");
};

const getDbBackup = () => {
	infoLog("Generating db backup...");
	axios.get(`${process.env.INTERNAL_API_URL}/db-backup/generate`);
};

const refetchPayments = () => {
	try {
		infoLog("Refetching failed payments...");
		axios.get(`${process.env.INTERNAL_API_URL}/refetch-payments`);
	} catch (error) {
		infoLog(error?.message || "Unable to refetch payments");
	}
};

cron.schedule("0 17 * * *", sendSummaryCron);
cron.schedule("0 9 * * *", sendSummaryCron);

cron.schedule("*/30 * * * *", getDbBackup);

// cron.schedule("0 4 * * *", refetchPayments);
