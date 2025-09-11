const { otpController } = require("../application/controllers/otpController");
const { middleware } = require("../middlewares/middleware");

const otpRouter = require("express").Router();

otpRouter.post(
	"/verify-otp",
	middleware.checkForPoolConnection,
	otpController.verifyOtp,
);

module.exports = otpRouter;
