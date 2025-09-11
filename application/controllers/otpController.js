const ApiResponseV2 = require("../config/ApiResponseV2");
const indexModel = require("../model/indexModel");
const { otpModel } = require("../model/otpModel");
const { sendRegistrationEmailZeptomail } = require("./emailController");

exports.otpController = {
	addOtp: async (pool, data) => {
		await otpModel.addNewOtp(pool, data);
	},

	verifyOtp: async (req, res, next) => {
		try {
			console.log(req.body, "req.body");
			const { otp, reference_id, aadharNumber, mobileNumber } = req.body;

			const otpDetails = await otpModel.checkOtpValid(
				res.pool,
				otp,
				reference_id,
			);
			console.log(otpDetails, "otpDetails");
			if (otpDetails.length === 0) {
				return res
					.status(410)
					.json(new ApiResponseV2(410, "Invalid or expired OTP"));
			}

			// get user
			const userDetails =
				await indexModel.getUserDetailsByAadhaarAndMobile(res.pool, {
					aadharNumber,
					mobileNumber,
				});

			let emailData = {
				email: userDetails[0].email,
				first_name: userDetails[0].ub_first_name,
				middle_name: userDetails[0].ub_middle_name,
				last_name: userDetails[0].ub_last_name,
				username: userDetails[0].username,
				password: userDetails[0].password,
			};

			// send the user id and password on email
			await sendRegistrationEmailZeptomail(emailData);

			return res
				.status(200)
				.json(
					new ApiResponseV2(
						200,
						"<p class='text-red-500'>Login details sent to registered email. नोंदणीकृत ईमेलवर लॉगिन तपशील पाठवले. </p>",
					),
				);
		} catch (error) {
			next(error);
		}
	},
};
