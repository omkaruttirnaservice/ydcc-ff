const router = require("express").Router();
const fileUpload = require("express-fileupload");
const {
	studentsDataController,
	homepageController,
	nodeDetailsController,
} = require("../application/controllers/apiController.js");
const { middleware } = require("../middlewares/middleware.js");
const { flushRedisCache } = require("../application/config/redisConnect.js");
const ApiResponseV2 = require("../application/config/ApiResponseV2.js");

// flush redis cache

router.get("/flush-redis", async (req, res, next) => {
	try {
		const { message, success } = await flushRedisCache();

		if (success) {
			return res.status(200).json(new ApiResponseV2(200, message));
		} else {
			return res.status(400).json(new ApiResponseV2(200, message));
		}
	} catch (error) {
		next(error);
	}
});

// get process data
router.get(
	"/get-process-data",
	middleware.checkForPoolConnection,
	homepageController.getProcessData,
);

// students data api's

router.post(
	"/student-data/data",
	middleware.checkForPoolConnection,
	studentsDataController.getStudentsData,
);

router.post(
	"/student-data/download/photo-sign",
	middleware.checkForPoolConnection,
	studentsDataController.downloadPhotos,
);

// these routes are used in question-paper-generation panel
router.get(
	"/student-data/data-download",
	middleware.checkForPoolConnection,
	studentsDataController.getStudentsDataDownload,
);

router.get(
	"/student-data/download-photo-sign",
	middleware.checkForPoolConnection,
	studentsDataController.downloadPhotosSign,
);

router.post(
	"/student-data/download-photo-sign-aws",
	middleware.checkForPoolConnection,
	studentsDataController.downloadPhotosSignAws,
);

// get centers list
router.get(
	"/student-data/download-centers-list",
	middleware.checkForPoolConnection,
	studentsDataController.downloadCentersList,
);

// answer key and question paper
router.post(
	"/save-published-test-details",
	middleware.checkForPoolConnection,
	studentsDataController.savePublishedTestDetails,
);

router.put(
	"/mark-present",
	middleware.checkForPoolConnection,
	studentsDataController.markPresent,
);

// This is to get hallticket details for qr mobile app
router.post(
	"/get-ht-details",
	middleware.checkForPoolConnection,
	studentsDataController.getHtDetails,
);

router.get(
	"/get-ht-details-by-roll-no",
	middleware.checkForPoolConnection,
	studentsDataController.getHtDetailsByRollNumber,
);

router.post(
	"/save-approval-details",
	fileUpload(),
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	studentsDataController.saveApprovalDetails_V2,
);

router.get(
	"/update-rmq-use",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	studentsDataController.updateRMQUse,
);

router.get(
	"/download-approved-photo/:fileName",
	fileUpload(),
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	studentsDataController.downloadApprovedPhoto,
);

router.get(
	"/get-new-candidates",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	studentsDataController.getNewCandidates,
);

// api for login from qr code scan application
router.post(
	"/login",
	middleware.checkForPoolConnection,
	studentsDataController.login,
);

// api for getting slots and center list for QR app
router.get(
	"/get-allotment-info",
	middleware.checkForPoolConnection,
	studentsDataController.getAllotmentInfo,
);

router.get(
	"/get-exam-dates",
	middleware.checkForPoolConnection,
	studentsDataController.getExamDates,
);

router.get(
	"/get-centers-list",
	middleware.checkForPoolConnection,
	studentsDataController.getCentersList,
);

router.get(
	"/get-slots-list",
	middleware.checkForPoolConnection,
	studentsDataController.getSlotsList,
);

// api for getting attendance count for QR app
router.get(
	"/get-attendance-count/:slot",
	middleware.checkForPoolConnection,
	studentsDataController.getAttendanceCount,
);

// api for resetting attendance count (used in exam panel)
router.get(
	"/reset-attendance",
	middleware.checkForPoolConnection,
	studentsDataController.resetAttendance,
);

// getting post list for question-paper-generation panel

router.get(
	"/posts-list",
	middleware.checkForPoolConnection,
	studentsDataController.getPostList,
);

// this gets the list of all exams centers and exam servers to the exam panel for request login
router.get(
	"/get-exam-server-and-centers-list",
	middleware.checkForPoolConnection,
	studentsDataController.getExamServerAndCentersList,
);

// This gets the login details of the server (request will come from exam panel)
router.get(
	"/get-server-login-details",
	middleware.checkForPoolConnection,
	studentsDataController.getServerLoginDetails,
);

// save node details
// This api will be called from exam panel
router.post(
	"/save-estimation-node-details",
	middleware.checkForPoolConnection,
	nodeDetailsController.saveEstimationNodeDetails,
);
// get node_details as per server number
// This api will be called from exam panel
router.get(
	"/get-node-details-by-server-id",
	middleware.checkForPoolConnection,
	nodeDetailsController.getNodeDetailsByServerId,
);

module.exports = router;
