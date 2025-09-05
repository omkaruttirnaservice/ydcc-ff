const amqp = require("amqplib");
const { infoLog, errorLog } = require("./logger");

const SERVER_IP = "134.209.154.181:5672";
// const SERVER_IP = "127.0.0.1:5672";
const RABBMIT_MQ_URL = `amqp://${SERVER_IP}`;
const photo_captured_queue = "photo_captured";

let channel;
let connection;

let retryAttempt = 0;
let maxRetryAttempt = 5;
let retryAfter = 5000;

async function connectRMQ() {
	infoLog("Connecting with RabitMQ");
	try {
		connection = await amqp.connect(RABBMIT_MQ_URL);
		channel = await connection.createChannel();

		connection.on("close", () => {
			console.log(
				`RMQ connection closed, retrying to connect after: ${retryAfter}`,
			);
			setTimeout(connectRMQ, retryAfter);
		});

		connection.on("error", () => {
			console.log("Error while connecting with RMQ");
		});

		connection.on("connect", () => {
			infoLog("Connected with RMQ");
		});

		infoLog("Connected to RMQ");
		retryAttempt = 0;
	} catch (error) {
		console.log(error, "==error");
		errorLog("Failed to connect with RMQ");
		if (retryAttempt <= maxRetryAttempt) {
			retryAttempt++;
			setTimeout(connectRMQ, retryAfter);
			infoLog(`Retrying connecting with RMQ: ${retryAttempt}`);
		} else {
			errorLog("Max attept is over for connection with RMQ");
		}
	}
}

/**
 *
 * @param {string} queue_name // queue name for rabbit mq
 * @param {json} data // data to send in message queue
 */

async function sendMessage(queue_name, data) {
	if (!channel) await connectRMQ();

	// create quque if not exsists
	await channel.assertQueue(queue_name, {
		durable: true,
	});

	// send message in the quque
	await channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(data)), {
		persistent: true,
	});
}

module.exports = {
	sendMessage,
	connectRMQ,
	photo_captured_queue,
};
