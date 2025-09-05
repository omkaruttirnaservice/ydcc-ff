const express = require("express");
const {
	PROCESS_DETAILS_CACHE_KEY,
	IMP_DATES_CACHE_KEY,
} = require("../application/config/constants");
const { getFromGlobalCache } = require("../application/config/_responderSet");
const router = express.Router();

// About Us
router.get("/about-us", async (req, res, next) => {
	res.render("policies/about-us", {
		p: await getFromGlobalCache(PROCESS_DETAILS_CACHE_KEY),
		dates: await getFromGlobalCache(IMP_DATES_CACHE_KEY),
		s3BucketUrl: process.env.S3_BUCKET_URL,
	});
});

// Privacy Policy
router.get("/privacy-policy", async (req, res, next) => {
	res.render("policies/privacy-policy", {
		p: await getFromGlobalCache(PROCESS_DETAILS_CACHE_KEY),
		dates: await getFromGlobalCache(IMP_DATES_CACHE_KEY),
		s3BucketUrl: process.env.S3_BUCKET_URL,
	});
});

// Return Policy
router.get("/return-policy", async (req, res, next) => {
	res.render("policies/return-policy", {
		p: await getFromGlobalCache(PROCESS_DETAILS_CACHE_KEY),
		dates: await getFromGlobalCache(IMP_DATES_CACHE_KEY),
		s3BucketUrl: process.env.S3_BUCKET_URL,
	});
});

// Terms & Conditions
router.get("/terms-and-conditions", async (req, res, next) => {
	res.render("policies/terms-and-conditions", {
		p: await getFromGlobalCache(PROCESS_DETAILS_CACHE_KEY),
		dates: await getFromGlobalCache(IMP_DATES_CACHE_KEY),
		s3BucketUrl: process.env.S3_BUCKET_URL,
	});
});

// Shipping Policy
router.get("/shipping-policy", async (req, res, next) => {
	res.render("policies/shipping-policy", {
		p: await getFromGlobalCache(PROCESS_DETAILS_CACHE_KEY),
		dates: await getFromGlobalCache(IMP_DATES_CACHE_KEY),
		s3BucketUrl: process.env.S3_BUCKET_URL,
	});
});

module.exports = router;
