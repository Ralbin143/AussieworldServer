const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const URL = process.env.PORT;
const cookieParser = require("cookie-parser");
const cors = require("cors");



dbConnect();





//cors configuration 

app.use(cors());
app.use(function (req, res, next) {
  const apiKey = process.env.APP_API_KEY;
  const apiKeyRequest = req.header("x-api-key");

//   if (apiKey !== apiKeyRequest)
//     return res.status(401).send({ ok: false, error: "Access Denied" });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


const authRouter = require("./routes/User");
const CarrierRouter = require("./routes/Carrier");
const uploadRouter = require("./routes/Upload");

app.use("/api/user", authRouter);
app.use("/api/carrier", CarrierRouter);
app.use("/api/upload",uploadRouter);


app.use(notFound);
app.use(errorHandler);

app.listen(URL, () => {
    console.log(`Server is running  at PORT ${URL}`);
  });