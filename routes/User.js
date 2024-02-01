const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  saveAddress,
  loginAdmin,
  updatePassword,

} = require("../controller/User");

const { authMiddleware, isAdminMiddleware,} = require("../middlewares/authmiddleware");
const { uploadFile } = require("../middlewares/fileupload");
const router = express.Router();
router.post("/create_user", createUser);
router.post("/login",authMiddleware,loginUserCtrl);

router.post("/admin-login",isAdminMiddleware,loginAdmin);
router.post("/view_all",getallUser);
// router.get("/logout", logout);
router.post("/getuser", authMiddleware,getaUser);
router.delete("/delete",authMiddleware, deleteaUser);
router.post("/edit-user", authMiddleware,updatedUser);
router.post("/update-password", authMiddleware,updatePassword);
// router.post("/save-address", authMiddleware, saveAddress);
// router.put("/block-user/:id", authMiddleware, blockUser);
// router.put("/unblock-user/:id", authMiddleware,unblockUser);

module.exports = router;