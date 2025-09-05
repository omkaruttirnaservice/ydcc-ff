require("dotenv").config();
const { io } = require("socket.io-client");

const JSZip = require("jszip");
const FormData = require("form-data");
const {
	studentsDataModel,
	nodeDetailsModel,
	QRAppModel,
} = require("../model/apiModel.js");
const fs = require("fs");
const path = require("path");
const { myDate } = require("../config/_responderSet.js");
const ApiResponse = require("../config/ApiResponse.js");
const indexModel = require("../model/indexModel.js");
const { default: axios } = require("axios");
const fileDirs = require("../config/awsConfig/filePaths.js");
const ApiError = require("../config/ApiError.js");
const asyncHandler = require("../config/asyncHandler.js");
const s3 = require("../config/awsConfig/aws.js");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { debugLog, infoLog } = require("../config/logger.js");
const ApiResponseV2 = require("../config/ApiResponseV2.js");
const { photo_captured_queue, sendMessage } = require("../config/rabbmitmq.js");

const studentsDataController = {
	getStudentsDataDownload: async (req, res) => {
		// This will download students all data to exam panel
		// batch wise and server wise

		studentsDataModel
			.getStudentsData(res.pool)
			.then(_result => {
				return res.status(200).json({
					data: _result,
					call: 1,
				});
			})
			.catch(err => {
				console.log(err);
			});
	},

	getStudentsData: async (req, res, next) => {
		const data = req.body;
		console.log(data, "==data==");
		try {
			const { exam_date, batch_list, post_ids, server_number } = req.body;

			// if (!exam_date || !batch_list || !post_ids || !server_number) {
			// 	throw new ApiError(400, "Invalid details passed.");
			// }

			const _studentsData = await studentsDataModel.getStudentsData(
				res.pool,
				exam_date,
				batch_list,
				post_ids,
				server_number,
			);

			console.log(_studentsData, "==_studentsData==");

			if (_studentsData.length === 0)
				throw new ApiError(400, "Students list empty.");

			return res
				.status(200)
				.json(
					new ApiResponse(200, true, "Students list.", _studentsData),
				);
		} catch (error) {
			next(error);
		}
	},
	downloadPhotos: async (req, res, next) => {
		try {
			let photoList = await studentsDataModel.getStudentsPhotoList(
				res.pool,
				req.body,
			);
			let _zip = new JSZip();
			let img = _zip.folder("_images");
			let sign = _zip.folder("_sign");
			let filePath = path.resolve("public", "assets", "images", "pics");

			console.log("==1==");
			photoList.forEach(el => {
				if (el.photo) {
					let imgPath = path.join(`${filePath}`, `${el.photo}`);
					if (fs.existsSync(imgPath) && el.photo != "") {
						let file = fs.readFileSync(imgPath);
						img.file(el.photo, file);
					}
				}

				if (el.sign) {
					let imgPath = path.join(`${filePath}`, `${el.sign}`);
					if (fs.existsSync(imgPath) && el.sign != "") {
						let file = fs.readFileSync(imgPath);
						sign.file(el.sign, file);
					}
				}
			});

			console.log("==2==");

			console.log("==3==");
			let zipSavePath = path.resolve(path.join("public", "temp"));

			let fileName = `photo-sign-${myDate.formatDate(myDate.getDate())}.zip`;
			let zipFile = path.join(`${zipSavePath}`, `${fileName}`);

			_zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
				.pipe(fs.createWriteStream(`${zipFile}`))
				.on("finish", function () {
					let stat = fs.statSync(zipFile);

					res.writeHead(200, {
						"Content-Type": "application/pdf",
						"Content-Length": stat.size,
						"x-file-name": fileName,
					});
					let stream = fs.createReadStream(zipFile);
					stream.pipe(res);
				});
		} catch (error) {
			console.log(error);
		}
	},

	downloadPhotosSign: async (req, res, next) => {
		try {
			let photoList = await studentsDataModel.getStudentsPhotoList(
				res.pool,
			);
			console.log(photoList, "==photoList==");
			let _zip = new JSZip();
			let img = _zip.folder("_images");
			let sign = _zip.folder("_sign");
			let filePath = path.resolve("public", "assets", "images", "pics");

			console.log("==1==");
			photoList.forEach(el => {
				if (el.photo) {
					let imgPath = path.join(`${filePath}`, `${el.photo}`);
					if (fs.existsSync(imgPath) && el.photo != "") {
						let file = fs.readFileSync(imgPath);
						img.file(el.photo, file);
					}
				}

				if (el.sign) {
					let imgPath = path.join(`${filePath}`, `${el.sign}`);
					if (fs.existsSync(imgPath) && el.sign != "") {
						let file = fs.readFileSync(imgPath);
						sign.file(el.sign, file);
					}
				}
			});

			console.log("==2==");

			console.log("==3==");
			let zipSavePath = path.resolve(path.join("public", "temp"));

			let fileName = `photo-sign-${myDate.formatDate(myDate.getDate())}.zip`;
			let zipFile = path.join(`${zipSavePath}`, `${fileName}`);

			_zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
				.pipe(fs.createWriteStream(`${zipFile}`))
				.on("finish", function () {
					let stat = fs.statSync(zipFile);

					res.writeHead(200, {
						"Content-Type": "application/pdf",
						"Content-Length": stat.size,
						"x-file-name": fileName,
					});
					let stream = fs.createReadStream(zipFile);
					stream.pipe(res);
				});
		} catch (error) {
			console.log(error);
		}
	},

	_downloadPhotosSignAws: async (req, res, next) => {
		// This downloads the studnt photos and images from aws
		try {
			console.log(req.body);
			// {
			// 	batch_list: '1',
			// 	center_code: '101',
			// 	exam_id: '20',
			// 	exam_date: 'undefined'
			//   }
			let photo_sign = await studentsDataModel.getStudentsPhotoList(
				res.pool,
			);

			const photoSignArray = photo_sign.flatMap(_el =>
				Object.values(_el),
			);

			const onlyNamesPhotoSign = [];
			console.log(photoSignArray, "==photoSignArray==");

			let _zip = new JSZip();

			const DOWNLOADS_FOLDER = path.resolve("downloads");
			const PHOTO_SIGN_FOLDER_NAME = "_photo_sign";

			const PHOTO_SIGN_DIR = path.resolve(
				DOWNLOADS_FOLDER,
				PHOTO_SIGN_FOLDER_NAME,
			);

			const ZIP_FILE_NAME = "data.zip";
			const ZIP_FOLDER_NAME = "_zip";

			const ZIP_FILE_DIR = path.resolve(
				DOWNLOADS_FOLDER,
				ZIP_FOLDER_NAME,
				ZIP_FILE_NAME,
			);

			for (let item of photoSignArray) {
				await downloadFromS3(item);
			}

			async function downloadFromS3(image) {
				const params = {
					Bucket: process.env.S3_BUCKET_NAME,
					Key: `${image}`,
				};
				infoLog(params);

				const response =
					await studentsDataController.getObjectFromS3(params);

				const IMG_NAME = replaceColonsToUnderscore(image);
				onlyNamesPhotoSign.push(IMG_NAME);

				await studentsDataController.saveS3File(
					response.Body,
					path.resolve(PHOTO_SIGN_DIR, IMG_NAME),
				);

				infoLog(`DOWNLOAD COMPLETE : ${JSON.stringify(params)}`);
			}

			for (let item of onlyNamesPhotoSign) {
				let photoSignPath = path.join(`${PHOTO_SIGN_DIR}`, `${item}`);
				if (fs.existsSync(photoSignPath)) {
					let file = fs.readFileSync(photoSignPath);
					_zip.file(item, file);
				}
			}

			function replaceColonsToUnderscore(item) {
				/**
				 * eg. item = APMC ATPADI/users/APMC ATPADI_sign_600067_2025-02-17 21:58:31.jpeg
				 * */
				if (!item) return false;
				return item.split("/").pop().replaceAll(":", "_");
			}

			const zipReadStream = _zip.generateNodeStream({
				type: "nodebuffer",
				streamFiles: true,
			});

			const zipWriteStream = fs.createWriteStream(
				path.resolve(ZIP_FILE_DIR),
			);

			zipReadStream.pipe(zipWriteStream);

			zipWriteStream.on("finish", () => console.log("==1=="));
			zipWriteStream.on("error", err => console.log(err, "==err=="));

			// uploading to exam panel
			// const stats = fs.statSync(_zip);
			// console.log(stats, "stats");

			// res.setHeader("Content-Type", "application/pdf");
			// res.setHeader("Content-Size");
			// console.log(_zip, "-");

			// console.log("==2==");

			// console.log("==3==");
			// let zipSavePath = path.resolve(path.join("public", "temp"));

			// let fileName = `photo-sign-${myDate.formatDate(myDate.getDate())}.zip`;
			// let zipFile = path.join(`${zipSavePath}`, `${fileName}`);

			// _zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
			// 	.pipe(fs.createWriteStream(`${zipFile}`))
			// 	.on("finish", function () {
			// 		let stat = fs.statSync(zipFile);

			// 		res.writeHead(200, {
			// 			"Content-Type": "application/pdf",
			// 			"Content-Length": stat.size,
			// 			"x-file-name": fileName,
			// 		});
			// 		let stream = fs.createReadStream(zipFile);
			// 		stream.pipe(res);
			// 	});
		} catch (error) {
			console.log(error);
		}
	},
	downloadPhotosSignAws: async (req, res, next) => {
		// This downloads the studnt photos and images from aws
		try {
			const socket = io("http://localhost:3051");
			socket.on("connect", () => {
				console.log("Connected", socket.id);
				socket.emit("startDownload", "Starting download");

				socket.on("confirmStartDownload", data => {
					console.log(data, "==confirm==");
					// startDownload(socket);
				});
			});

			// console.log(req.body);
			const { batch_list, center_code, exam_id, exam_date } = req.body;
			if (!batch_list || !center_code || !exam_id || !exam_date) {
				throw new ApiError(400, "provide all details");
			}
			// {
			// 	batch_list: '1',
			// 	center_code: '101',
			// 	exam_id: '20',
			// 	exam_date: '04-03-2025'
			//  post_ids
			//   }

			socket.emit("downloadProgress", "Getting students photo list");
			let photo_sign = await studentsDataModel.getStudentsPhotoList(
				res.pool,
				req.body,
			);

			const photoSignArray = photo_sign.flatMap(_el =>
				Object.values(_el),
			);
			const onlyNamesPhotoSign = [];
			let _zip = new JSZip();
			const DOWNLOADS_FOLDER = path.resolve("downloads");
			const PHOTO_SIGN_FOLDER_NAME = "_photo_sign";
			const PHOTO_SIGN_DIR = path.resolve(
				DOWNLOADS_FOLDER,
				PHOTO_SIGN_FOLDER_NAME,
			);
			const ZIP_FILE_NAME = "data.zip";
			const ZIP_FOLDER_NAME = "_zip";
			const ZIP_FILE_DIR = path.resolve(
				DOWNLOADS_FOLDER,
				ZIP_FOLDER_NAME,
				ZIP_FILE_NAME,
			);

			let downloadedCount = 0;
			const totalDownloadCount = photoSignArray.length;
			for (let item of photoSignArray) {
				if (!item || item == "") continue;
				await downloadFromS3(item);
				downloadedCount++;
				socket.emit(
					"downloadProgress",
					`Downloading from Aws : ${downloadedCount}/${totalDownloadCount}`,
				);
			}

			async function downloadFromS3(image) {
				const params = {
					Bucket: process.env.S3_BUCKET_NAME,
					Key: `${image}`,
				};
				infoLog(params);
				const response =
					await studentsDataController.getObjectFromS3(params);
				const IMG_NAME = replaceColonsToUnderscore(image);
				console.log(IMG_NAME, "==IMG_NAME==");
				onlyNamesPhotoSign.push(IMG_NAME);
				await studentsDataController.saveS3File(
					response.Body,
					path.resolve(PHOTO_SIGN_DIR, IMG_NAME),
				);
				infoLog(`DOWNLOAD COMPLETE : ${JSON.stringify(params)}`);
			}

			let zipDoneItems = 0;
			const totalZipItems = onlyNamesPhotoSign.length;

			for (let item of onlyNamesPhotoSign) {
				let photoSignPath = path.join(`${PHOTO_SIGN_DIR}`, `${item}`);
				if (fs.existsSync(photoSignPath)) {
					let file = fs.readFileSync(photoSignPath);
					_zip.file(item, file);
				}
				zipDoneItems++;
				socket.emit(
					"downloadProgress",
					`Adding to zip :${zipDoneItems}/${totalZipItems}`,
				);
			}

			function replaceColonsToUnderscore(item) {
				/**
				 * eg. item = APMC ATPADI/users/APMC ATPADI_sign_600067_2025-02-17 21:58:31.jpeg
				 * */
				if (!item) return false;
				return item.split("/").pop().replaceAll(":", "_");
			}

			const zipReadStream = _zip.generateNodeStream({
				type: "nodebuffer",
				streamFiles: true,
			});

			const zipWriteStream = fs.createWriteStream(
				path.resolve(ZIP_FILE_DIR),
			);

			socket.emit("downloadProgress", `Downloading zip`);

			zipReadStream.pipe(zipWriteStream);
			zipWriteStream.on("error", err => {
				infoLog(err);
				console.log(err, "==err==");
			});
			zipWriteStream.on("finish", () => {
				const stats = fs.statSync(ZIP_FILE_DIR);
				res.writeHead(200, {
					"x-content-length": stats.size,
					"Content-Decomposition": `attachment; filename=${ZIP_FILE_NAME}`,
					"x-file-name": ZIP_FILE_NAME,
				});
				let stream = fs.createReadStream(ZIP_FILE_DIR);
				stream.pipe(res);
				stream.on("end", () => {
					socket.emit("_end");
				});

				console.log(socket.id, "==socket.i==");
				socket.on("disconnect", () => {
					console.log("=disconnect==");
					console.log(socket.id, "==socket.i==");
				});
			});
		} catch (error) {
			next(error);
		}
	},

	getObjectFromS3: async params => {
		const command = new GetObjectCommand(params);
		const response = await s3.send(command);
		return response;
	},

	saveS3File: (readableStream, fileName) => {
		infoLog(`SAVING : ${fileName}`);

		const writeableStream = fs.createWriteStream(fileName);

		return new Promise((resolve, reject) => {
			readableStream.pipe(writeableStream);
			readableStream.on("error", reject);
			writeableStream.on("finish", resolve);
		});
	},

	downloadCentersList: async (req, res, next) => {
		try {
			let _centersList = await studentsDataModel.downloadCentersList(
				res.pool,
			);
			console.log(_centersList, "==_centersList==");
			new ApiResponse(
				200,
				true,
				"Download Centers List Successful.",
				_centersList,
			);
			return res.status(200).json({
				data: _centersList,
				call: 1,
			});
		} catch (error) {
			next(error);
			console.log(error, "==error==");
		}
	},

	savePublishedTestDetails: async (req, res, next) => {
		try {
			const data = req.body;
			if (
				!data?.testDetails?._publishedTestDetails ||
				data?.testDetails?._publishedTestDetails.length == 0
			) {
				return res
					.status(400)
					.json(
						new ApiResponse(
							400,
							false,
							"Invalid published test details.",
						),
					);
			}

			if (
				!data?.testDetails?._questionPaper ||
				data?.testDetails?._questionPaper.length === 0
			) {
				return res
					.status(400)
					.json(
						new ApiResponse(
							400,
							false,
							"Invalid question paper details.",
						),
					);
			}

			// 1. Save Published Test Details
			const _savePublishedTestDetailsResponse =
				await studentsDataModel.savePublishedTestDetails(
					res.pool,
					data.testDetails._publishedTestDetails[0],
				);

			// 2. Remove old (i.e. if same question paper were uploaded already) question paper before saving new
			const removeQuestionPaperDetails = {
				ptl_test_id:
					data.testDetails._publishedTestDetails[0].ptl_test_id,
				q_id: data.testDetails._questionPaper.map(
					question => question.q_id,
				),
			};
			console.log(
				removeQuestionPaperDetails,
				"==removeQuestionPaperDetails==",
			);

			const _removeOldQuestionPaperResponse =
				await studentsDataModel.removeOldQuestionPaper(
					res.pool,
					removeQuestionPaperDetails,
				);

			// 3. Save Question Paper
			const _saveQuestionPaperResponse =
				await studentsDataModel.saveQuestionPaper(
					res.pool,
					data.testDetails._questionPaper,
				);

			console.log(
				_saveQuestionPaperResponse,
				"==_saveQuestionPaperResponse==",
			);

			return res
				.status(201)
				.json(
					new ApiResponse(
						201,
						true,
						"Successfully added answer key.",
					),
				);
		} catch (error) {
			next(error);
		}
	},

	markPresent: async function (req, res, next) {
		try {
			const studentsList = req.body.details.studentsList;
			if (studentsList.length === 0) {
				return res
					.status(400)
					.json(new ApiResponse(201, true, "share students list."));
			}
			const updateResponse = await studentsDataModel.markPresent(
				res.pool,
				studentsList,
			);

			if (studentsList.length == updateResponse.affectedRows) {
				return res
					.status(201)
					.json(
						new ApiResponseV2(
							201,
							`Affected rows : ${updateResponse.affectedRows}, Total students : ${studentsList.length}`,
						),
					);
			} else {
				return res
					.status(400)
					.json(
						new ApiResponse(
							201,
							true,
							"Error updating attendance.(student count mismatch).",
						),
					);
			}
		} catch (error) {
			next(error);
		}
	},

	getHtDetails: async function (req, res, next) {
		try {
			const { r_id, f_id } = req.query;

			if (!r_id || !f_id || isNaN(r_id) || isNaN(f_id)) {
				res.render("new/error-page.pug", {
					errorTitle: "Woops!",
					errorMessage: "Invalid details passed.",
				});
			}

			let userData = {
				candidate: {},
				htDetails: {},
				slotDetails: {},
			};

			const candidateDetails = await indexModel.getSoloCandidateDetails(
				res.pool,
				r_id,
			);

			if (candidateDetails.length === 0) {
				res.render("new/error-page.pug", {
					errorTitle: "Woops!",
					errorMessage: "Requested Candidate Details Not Found.",
				});
			}

			userData.candidate = candidateDetails[0];

			const candidateHtDetails =
				await indexModel.getSoloCandidateHTDetails(res.pool, {
					r_id,
					f_id,
				});

			if (candidateHtDetails.length === 0) {
				res.render("new/error-page.pug", {
					errorTitle: "Woops!",
					errorMessage:
						"Requested Candidate Hallticket Details Not Found.",
				});
			}

			userData.htDetails = candidateHtDetails[0];

			const candidateSlotDetails = await indexModel.getSoloSlotDetails(
				res.pool,
				userData.htDetails.ca_batch_slot,
			);

			if (candidateSlotDetails.length === 0) {
				res.render("new/error-page.pug", {
					errorTitle: "Woops!",
					errorMessage: "Candidate Slot Details Not Found..",
				});
			}

			userData.slotDetails = candidateSlotDetails[0];

			// TODO (Omkar) : check process type and render hallticket accordingly
			const _process = await indexModel.getProcessData(res.pool);

			if (_process[0].print_hall_ticket !== 1) {
				res.render("new/error-page.pug", {
					errorTitle: "Woops!",
					errorMessage: "Hallticket Printing Is Not Started Yet.",
				});
			}

			return res.status(200).json(
				new ApiResponse(200, true, "User hallticket details", {
					p: _process,
					ca: userData.candidate,
					ht: userData.htDetails,
					slot: userData.slotDetails,
					s3BucketUrl: process.env.S3_BUCKET_URL,
				}),
			);
		} catch (error) {
			next(error);
		}
	},

	getHtDetailsByRollNumber: async function (req, res, next) {
		try {
			const { roll_no } = req.query;

			console.log(roll_no);

			if (!roll_no) {
				// throw new ApiError(400, "No candidate found");
			}

			let userData = {
				candidate: {},
				htDetails: {},
				slotDetails: {},
			};

			const candidateHtDetails =
				await indexModel.getSoloCandidateHTDetailsByRollNumber(
					res.pool,
					roll_no,
				);

			if (candidateHtDetails.length === 0) {
				// throw new ApiError(400, "No candidate found");
			}

			userData.htDetails = candidateHtDetails[0];

			const candidateDetails = await indexModel.getSoloCandidateDetails(
				res.pool,
				userData.htDetails.ca_reg_id,
			);

			if (candidateDetails.length === 0) {
				// throw new ApiError(400, "No candidate found");
			}

			userData.candidate = candidateDetails[0];

			const candidateSlotDetails = await indexModel.getSoloSlotDetails(
				res.pool,
				userData.htDetails.ca_batch_slot,
			);

			if (candidateSlotDetails.length === 0) {
				// throw new ApiError(400, "No candidate found");
			}

			userData.slotDetails = candidateSlotDetails[0];

			const _process = await indexModel.getProcessDataForQRApp(res.pool);

			return res.status(200).json(
				new ApiResponseV2(200, "User hallticket details", {
					p: _process,
					ca: userData.candidate,
					ht: userData.htDetails,
					slot: userData.slotDetails,
					s3BucketUrl: process.env.S3_BUCKET_URL,
				}),
			);
		} catch (error) {
			next(error);
		}
	},

	saveApprovalDetails: async (req, res, next) => {
		console.log("-Saving approval details==================");
		try {
			if (!req.body.candidatePhoto) {
				throw new ApiError(400, "Please upload candidate photo");
			}
			const fileBuffer = Buffer.from(req.body.candidatePhoto, "base64");

			const file = req.files?.candidatePhoto;

			const dirPath = path.resolve(
				"public",
				"assets",
				"images",
				"qr-captures",
			);

			console.log(dirPath, "=dir path");

			const localFileName = `photo_${req.body.rollNo}.jpg`;
			const filePath = path.join(dirPath, localFileName);
			fs.mkdirSync(dirPath, { recursive: true });

			console.log("Writing file");
			fs.writeFileSync(filePath, fileBuffer);
			console.log("Writing file complete");

			const data = req.body;

			data["local_file_name"] = localFileName;

			if (
				!data.rollNo ||
				!data.f_id ||
				!data.r_id ||
				!data.approved_by_user_id
			) {
				return res
					.status(200)
					.json(
						new ApiResponse(
							400,
							false,
							"Invalid details passed (required rollNo, f_id, r_id).",
						),
					);
			}

			const _updateResponse =
				await studentsDataModel.updateCandidateDetailsWhenPhotoIsCaptured(
					res.pool,
					data,
				);

			console.log(_updateResponse, "=_updateResponse");

			console.log(data);
			console.log(`Final approval data`);

			const { candidatePhoto, ...restOfInfo } = data;

			return res
				.status(201)
				.json(
					new ApiResponse(
						200,
						true,
						"Successfully approved candidate.",
						data,
					),
				);
		} catch (error) {
			console.log(error, "==error==");
			next(error);
		}
	},

	saveApprovalDetails_V2: async (req, res, next) => {
		console.log("-Saving approval details==================");
		try {
			if (!req.body.candidatePhoto) {
				throw new ApiError(400, "Please upload candidate photo");
			}
			const fileBuffer = Buffer.from(req.body.candidatePhoto, "base64");

			const file = req.files?.candidatePhoto;

			const dirPath = path.resolve(
				"public",
				"assets",
				"images",
				"qr-captures",
			);

			console.log(dirPath, "=dir path");

			const localFileName = `photo_${req.body.rollNo}.jpg`;
			const filePath = path.join(dirPath, localFileName);
			fs.mkdirSync(dirPath, { recursive: true });

			console.log("Writing file");
			fs.writeFileSync(filePath, fileBuffer);
			console.log("Writing file complete");

			const data = req.body;

			data["local_file_name"] = localFileName;

			if (
				!data.rollNo ||
				!data.f_id ||
				!data.r_id ||
				!data.approved_by_user_id
			) {
				return res
					.status(200)
					.json(
						new ApiResponse(
							400,
							false,
							"Invalid details passed (required rollNo, f_id, r_id).",
						),
					);
			}

			const _updateResponse =
				await studentsDataModel.updateCandidateDetailsWhenPhotoIsCaptured(
					res.pool,
					data,
				);

			const { candidatePhoto, ...restOfInfo } = data;

			console.log(_updateResponse, "=_updateResponse");

			console.log(data);
			console.log(`Final approval data`);

			const _processData = await indexModel.getProcessDataForQRApp(
				res.pool,
			);

			console.log(_processData[0]?.is_use_rabbit_mq, "==IS RMQ enabled");
			if (Number(_processData[0]?.is_use_rabbit_mq) === 1) {
				console.log("INFO: Rabmit MQ enabled");
				// send a message to RMQ
				await sendMessage(photo_captured_queue, { ...restOfInfo });
			}

			return res
				.status(201)
				.json(
					new ApiResponse(
						200,
						true,
						"Successfully approved candidate.",
						data,
					),
				);
		} catch (error) {
			console.log(error, "==error==");
			next(error);
		}
	},

	updateRMQUse: async (req, res, next) => {
		try {
			const value = req.query?.rmqUse;
			console.log(Number(value));
			if (!value && (Number(value) !== 1 || Number(value) !== 0)) {
				throw new ApiError(400, "Invalid value");
			}
			await indexModel.updateRMQUse(res.pool, value);
			return res
				.status(200)
				.json(new ApiResponseV2(200, "Successfully updated RMQ use"));
		} catch (error) {
			next(error);
		}
	},

	downloadApprovedPhoto: async (req, res, next) => {
		try {
			const fileName = req.params?.fileName;
			if (!fileName) {
				throw new ApiError(400, "Invalid file name");
			}
			const filePath = path.resolve(
				"public",
				"assets",
				"images",
				"qr-captures",
				`${fileName}`,
			);
			res.sendFile(filePath);
		} catch (error) {
			next(error);
		}
	},

	getNewCandidates: async function (req, res, next) {
		try {
			const lastCheckedTimeStamp = req.body?.last_check;
			console.log(lastCheckedTimeStamp, "-here");
			if (!lastCheckedTimeStamp) {
				throw new ApiError(
					400,
					"Please provide last checked time stamp",
				);
			}

			res.setHeader("Content-Type", "application/json");

			// prettier-ignore
			// Get candidates after last checked time stamp
			const _newCandidates = await studentsDataModel.getNewCandidates(res.pool, lastCheckedTimeStamp)

			console.log(_newCandidates, "-_newCandidates");

			if (_newCandidates.length === 0) {
				return res
					.status(201)
					.json(new ApiResponseV2(200, "No new candidates found"));
			}

			res.write(JSON.stringify(_newCandidates));

			res.write("\n---BOUNDRY---\n");

			const _zip = new JSZip();

			const qrDirPath = path.resolve(
				"public",
				"assets",
				"images",
				"qr-captures",
			);

			const zipFileTempPath = path.resolve(
				"public",
				"temp",
				"tempZip.zip",
			);

			const _zipWriteStream = fs.createWriteStream(zipFileTempPath);

			for (const _candidate of _newCandidates) {
				const fileName = _candidate.ca_approved_photo;
				const imgPath = path.join(`${qrDirPath}`, `${fileName}`);
				if (fs.existsSync(imgPath)) {
					let file = fs.readFileSync(imgPath);
					_zip.file(fileName, file);
				}
			}

			// Generate node stream from zip file
			const _zipNodeStream = _zip.generateNodeStream({
				type: "nodebuffer",
				streamFiles: true,
			});

			// write the zip file
			_zipNodeStream.pipe(_zipWriteStream);

			_zipWriteStream.on("finish", () => {
				console.log("Finish writing zip file");
				// read the zip file now
				const _zipReadStream = fs.createReadStream(zipFileTempPath);

				// stream the zip file to exam panel
				_zipReadStream.pipe(res);
				_zipReadStream.on("end", () => {
					console.log("End");
					fs.unlinkSync(zipFileTempPath);
					res.end();
				});
			});
		} catch (error) {
			next(error);
		}
	},

	// authentication for qr-code application
	login: async (req, res, next) => {
		/**
		 * Sample req.body
		 * {
				"username": "test",
				"password": "test"
				"slot" : 1
			}
		 * */
		try {
			console.log(req.body, "==req.body==");
			const data = req.body;
			if (!data || !data.username || !data.password || !data.slot) {
				return res
					.status(400)
					.json(
						new ApiResponseV2(400, "Invalid information passed."),
					);
			}

			const _loginDetails = await studentsDataModel.login(res.pool, data);

			if (_loginDetails.length === 0) {
				throw new ApiError(402, "Invalid login details");
			}

			const _processData = await indexModel.getProcessDataForQRApp(
				res.pool,
			);

			console.log(_loginDetails, "login");
			if (_loginDetails.length === 1) {
				return res.status(200).json(
					new ApiResponseV2(200, "Successfully logged in.", {
						_loginDetails,
						_processData,
					}),
				);
			} else {
				return res
					.status(401)
					.json(
						new ApiResponse(
							401,
							false,
							"Invalid username or password.",
						),
					);
			}
		} catch (error) {
			console.log(error, "==error==");
			next(error);
		}
	},

	getAllotmentInfo: asyncHandler(async (req, res) => {
		const _info = await QRAppModel.getAllotmentInfo(res.pool);
		console.log(_info);

		return res.status(200).json(new ApiResponseV2(200, "Success", _info));
	}),

	getExamDates: asyncHandler(async (req, res) => {
		const _info = await QRAppModel.getExamDates(res.pool);

		return res.status(200).json(new ApiResponseV2(200, "Success", _info));
	}),

	getSlotsList: asyncHandler(async (req, res) => {
		const exam_date = req.query?.exam_date;
		const center_code = req.query?.center_code;
		if (!exam_date) {
			throw new ApiError(400, "Invalid exam date");
		}

		if (!center_code) {
			throw new ApiError(400, "Invalid center code");
		}
		console.log(req.query, "-query");

		const _info = await QRAppModel.getSlotsList(
			res.pool,
			exam_date,
			center_code,
		);

		console.log(_info, "-slots");

		return res.status(200).json(new ApiResponseV2(200, "Success", _info));
	}),

	getCentersList: asyncHandler(async (req, res) => {
		console.log(req.query, "uqyer");
		const exam_date = req.query?.exam_date;
		if (!exam_date) {
			throw new ApiError(400, "Invalid exam date");
		}
		const _info = await QRAppModel.getCentersList(res.pool, exam_date);
		console.log(_info);

		if (_info.length === 0) {
			throw new ApiError(400, "No centers found");
		}

		return res.status(200).json(new ApiResponseV2(200, "Success", _info));
	}),

	getAttendanceCount: asyncHandler(async (req, res) => {
		const slot = req.params.slot;
		const _info = await QRAppModel.getAttendanceCount(res.pool, slot);
		return res.status(200).json(new ApiResponseV2(200, "Success", _info));
	}),

	resetAttendance: asyncHandler(async (_, res) => {
		console.log("1");
		const _updateResp = await QRAppModel.resetAttendance(res.pool);
		console.log(_updateResp);

		return res
			.status(200)
			.json(
				new ApiResponseV2(200, "Successfully reset online attendance"),
			);
	}),

	// getting post list for question-paper-generation panel
	getPostList: async (req, res, next) => {
		try {
			const _postsList = await studentsDataModel.getPostList(res.pool);
			console.log(_postsList, "==_postsList==");
			return res
				.status(200)
				.json(new ApiResponse(200, true, "Posts list.", _postsList));
		} catch (error) {
			next(error);
		}
	},

	getExamServerAndCentersList: async (req, res, next) => {
		try {
			const _examServerAndCenterList =
				await studentsDataModel.getExamServerAndCentersList(res.pool);

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						true,
						"Exam server and centers list successfully fetched.",
						_examServerAndCenterList,
					),
				);
		} catch (error) {
			next(error);
		}
	},

	getServerLoginDetails: async (req, res, next) => {
		try {
			const { serverId } = req.query;
			console.log(serverId, "==serverid==");
			if (!serverId) {
				throw new ApiError(400, "Required server id.");
			}

			const _serverLoginDetails =
				await studentsDataModel.getServerLoginDetails(
					res.pool,
					serverId,
				);

			if (_serverLoginDetails.length === 0)
				throw new ApiError(400, "Login details not found");

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						true,
						"Exam server login details successfully fetched.",
						_serverLoginDetails,
					),
				);
		} catch (error) {
			next(error);
		}
	},
};

const nodeDetailsController = {
	saveEstimationNodeDetails: async (req, res, next) => {
		try {
			const data = req.body;
			console.log(data, "==data==");
			// 1. save or update node estimation data
			const _updateNodeDetailsResp =
				await nodeDetailsModel.saveEstimationNodeDetails(
					res.pool,
					data._nodeDetails,
				);

			return res
				.status(201)
				.json(
					new ApiResponse(
						201,
						true,
						"Successfully updated / saved node details",
					),
				);
		} catch (error) {
			next(error);
		}
	},

	getNodeDetailsByServerId: asyncHandler(async (req, res) => {
		const { serverId } = req.query;
		if (!serverId) {
			throw new ApiError(400, "Invalid server id.");
		}
		console.log(serverId, "==serverId==");
		const _nodeDetails = await nodeDetailsModel.getNodeDetailsByServerId(
			res.pool,
			serverId,
		);
		if (_nodeDetails.length === 0) {
			throw new ApiError(404, "Node details not found for this server.");
		}
		return res.status(200).json({
			statusCode: 200,
			success: true,
			usrMsg: "Node details",
			data: _nodeDetails,
		});

		// return res
		// 	.status(200)
		// 	.json(new ApiResponse(200, true, "Node details", _nodeDetails));
	}),
};

const homepageController = {
	async getProcessData(req, res, next) {
		try {
			const _processData = await indexModel.getProcessData(res.pool);
			return res
				.status(200)
				.json(new ApiResponse(200, true, "Process data", _processData));
		} catch (error) {
			next(error);
		}
	},
};

module.exports = {
	studentsDataController,
	nodeDetailsController,
	homepageController,
};
