const User = require("../models/User");
const Notifications = require("../models/notifications");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodb");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const createMessage = require("../utils/Welcome");
const fileUploadMiddleware = require("../middlewares/fileupload");

// --------------------------UserID Creation Logic----------------------

function generateUserId() {
  const timestamp = new Date().getTime().toString();
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${timestamp}-${randomDigits}`;
}

// -------------------------Create a User ---------------------------

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const findUser = await User.findOne({ email: email });
  const userId = generateUserId();
  if (!findUser) {
    const UserData = {
      userId: userId,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      password: req.body.password,
      passportNo: req.body.passportNo,
      adhaarNo: req.body.adhaarNo,
      address: req.body.address,
    };
    const newUser = await User.create(UserData);

    //new user Created Notification Created

    const newNotification = new Notifications({
      userId: req.body.userId,
      notificationTitle: "New User Created ",
      notificationMessage:
        "New Account Created on " +
        moment(req.body.created_at).format("DD-MM-YYYY"),
      notificationStatus: "Account Created",
    });
    const contactNo = req.body.contactNo;

    //send Whatsapp Message

    // createMessage(contactNo)
    newNotification.save();

    //Welcome mail

    let transporter = nodemailer.createTransport({
      host: "mail.ahydratech.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "noreply@ahydratech.com", // generated ethereal user
        pass: "WuNr2]fpg(D,", // generated ethereal password
      },
    });

    //   Mail Data
    const mailOptions = {
      from: '"Aussy World" <noreply@aussieworld.com>',
      to: req.body.email,
      subject: "Account Created Notification",
      html: `<div style="padding: 20px;">
  <p style="text-align: left;">Dear user,</p>
  <p style="text-align: left;">We hope this message finds you well. Thank you for choosing Aussie World for your Future. We are delighted to inform you that the your Account Has Been Created.</p>
  <p>Should you have any specific requirements or if there are changes to your travel plans, please feel free to contact our customer support at [Customer Support Email/Phone].</p>
  <p>Your satisfaction and safety are our top priorities.</p>
  <p>Thank you for choosing Aussie World. We look forward to serving you and ensuring a seamless travel experience.</p>
  <p>Best regards,</br>AussieWorld Support Team</p>
</div>`,
    };

    //   Send Action
    transporter.sendMail(mailOptions);

    return res.status(200).json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

// -----------------------Login a user------------------------

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // const refreshToken = await generateRefreshToken(findUser?._id);
    // const updateuser = await User.findByIdAndUpdate(
    //   findUser.id,
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   { new: true }
    // );
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    // });
    return res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobileNo,
      updatePassword: findUser?.updatePassword,

      // token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//------------------------Login Admin---------------------

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    return res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstName,
      lastname: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobileNo,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// ----------------------------handle refresh token----------------------

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// ---------------------------------- logout functionality----------------------

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// --------------------------- Update a user ------------------

// const updatedUser = asyncHandler( fileUploadMiddleware.uploadFile.array('files'),async (req, res) => {

//   console.log(req.files);

//   const userId = req.body.id;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {

//       },
//       {
//         new: true,
//       }
//     );

//     if (!updatedUser) {
//       // Handle the case where the user with the given ID is not found
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     // Handle the error more appropriately (e.g., log it or send a specific error response)
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

const updatedUser = asyncHandler(async (req, res) => {
  const userId = req.body.id;

  try {
    const updatedUserFields = {
      // Update other fields as needed
    };

    // Check if req.files is not empty
    if (req.files && Object.keys(req.files).length > 0) {
      // Update user fields with file paths
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        updatedUserFields[fieldName] = fileArray[0].path;
      });
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedUserFields,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      // Handle the case where the user with the given ID is not found
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    // Handle the error more appropriately (e.g., log it or send a specific error response)
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// firstName: req.body.firstname,
// lastName: req.body.lastname,
// email: req.body.email,
// address: req.body.address,
// Qualification: req.body.Qualification, // Fix typo here
// applicantType: req.body.applicantType,
// anyQueries: req.body.anyQueries,
// sslc: req.files.sslc,
// hsc: req.files.hsc,
// degree: req.files.degree,
// aadhar: req.files.aadhar,
// passport: req.files.passport,
// experence: req.files.experence,
// individualAffidavit: req.files.individualAffidavit,
// fd: req.files.fd,
// propertyvaluation: req.files.propertyvaluation,

//  ----------------------- save user Address-------------------

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// ------------------------------Get all users-----------------------

const getallUser = asyncHandler(async (req, res) => {
  const pageNumber = req.body.page;
  const pageSize = req.body.perPage;
  const skip = (pageNumber - 1) * pageSize;

  const regex = new RegExp(req.body.searchKey, "i");

  const total = await User.find();

  const users = await User.aggregate([{ $match: { userId: regex } }])
    .skip(skip)
    .limit(pageSize)
    .sort({ created_at: -1 });

  return res.status(200).json({
    data: users,
    total: total.length,
  });
});

// -----------------------------Get a single user----------------------------

const getaUser = asyncHandler(async (req, res) => {
  const userId = { id: req.body.id };

  validateMongoDbId(userId);

  try {
    const getaUser = await User.find(userId);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// -------------------------------------delete a single user------------------------

const deleteaUser = asyncHandler(async (req, res) => {
  const userId = { _id: req.body.id };
  try {
    const deleteaUser = await User.findByIdAndDelete(userId);
    return res.status(200).json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// const blockUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);

//   try {
//     const blockusr = await User.findByIdAndUpdate(
//       id,
//       {
//         isBlocked: true,
//       },
//       {
//         new: true,
//       }
//     );
//     res.json(blockusr);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const unblockUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);

//   try {
//     const unblock = await User.findByIdAndUpdate(
//       id,
//       {
//         isBlocked: false,
//       },
//       {
//         new: true,
//       }
//     );
//     res.json({
//       message: "User UnBlocked",
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

//------------------Update Password----------------------

// const updatePassword = asyncHandler(async (req, res) => {
// try {
//   const query = {
//     _id:req.body.id
//   };
//   const data = {
//     $set:{
//       password:req.body.password
//     }
//   }
//   await User.findOneAndUpdate(query,data);
//   return res.status(200).json({message:"Your Password  Changed Succesfully"})
// } catch (error) {
//   return res.status(500).json({message:"Internal Server Error"})
// }
// });

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const { password } = req.body;
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    user.updatePassword=true
    await user.save();
    return res.status(200).json({message:"Your Password  Changed Succesfully"});
  } else {
    return res.status(500).json({message:"Internal Server Error"})
  }
});

// const forgotPasswordToken = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found with this email");
//   try {
//     const token = await user.createPasswordResetToken();
//     await user.save();
//     const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
//     const data = {
//       to: email,
//       text: "Hey User",
//       subject: "Forgot Password Link",
//       htm: resetURL,
//     };
//     sendEmail(data);
//     res.json(token);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const resetPassword = asyncHandler(async (req, res) => {
//   const { password } = req.body;
//   const { token } = req.params;
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   if (!user) throw new Error(" Token Expired, Please try again later");
//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   res.json(user);
// });

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  updatedUser,
  handleRefreshToken,
  logout,
  updatePassword,
  loginAdmin,
  saveAddress,
  getaUser,
  deleteaUser,
};
