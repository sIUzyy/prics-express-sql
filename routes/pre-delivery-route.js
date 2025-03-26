// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const preDeliveryController = require("../controllers/pre-delivery-controller");

// ---- route ----

// ---- create a pre-delivery
router.post("/create-pre-delivery", preDeliveryController.createPreDelivery);

// ---- get a list of pre-delivery by tracking number
router.get("/:tracking_no", preDeliveryController.getPreDeliveryByTrackingNo);

// ---- exports ----
module.exports = router;
