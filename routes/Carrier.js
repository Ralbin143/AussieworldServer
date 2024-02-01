const express = require("express");
const { createCarrier, viewallCarrier, viewsingleCarrier, assignCarrier } = require("../controller/Carrier");

const { authMiddleware, isAdminMiddleware,} = require("../middlewares/authmiddleware");
const router = express.Router();
router.post("/create_carrier",isAdminMiddleware,createCarrier);
router.get("/view_all_carrier",isAdminMiddleware,viewallCarrier);
router.post("/getCarrier", authMiddleware,viewsingleCarrier);
router.post("/assign",isAdminMiddleware,assignCarrier);


module.exports = router;