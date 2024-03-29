var express = require("express");
var router = express.Router();
var passport = require("passport");
const usermodel = require("../models/userModel");
const notifier = require("node-notifier");
const otpModel = require("../models/otpModel");

const localStrategy = require("passport-local");
const mailer = require("../nodemailer");
const { GridFsStorage } = require("multer-gridfs-storage");
const gridStream = require("gridfs-stream");
const multer = require("multer");
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcrypt");
const shaareModel = require("../models/shareFile");
const folderModel = require("../models/folderModel");
const fileModel = require("../models/fileSchema");
passport.use(new localStrategy(usermodel.authenticate()));

//making connection to gridfs stream
let gfs, gridFsBucket;
let conn = mongoose.createConnection(
  "mongodb+srv://Sushant_8083:Sushant%402003@cluster0.eqii0la.mongodb.net/?retryWrites=true&w=majority"
);
conn.once("open", function () {
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = gridStream(conn, mongoose.mongo);
  gfs.collection("uploads");
});

//initializing the storage using multer gridfs storage

var storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // const filename = buf.toString("hex") + path.extname(file.originalname);
        const filename = `${Date.now()}*${file.originalname}`;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

/* GET home page. */

router.post("/upload", upload.single("file"), async (req, res) => {
  let urlArray = req.headers.referer.split("/");
  let parentId = urlArray[urlArray.length - 1];

  let file = await fileModel.create({
    parent: parentId,
    filename: req.file.filename,
    fileId: req.file.id,
    user: req.session.passport.user._id,
  });

  res.redirect(req.headers.referer);
});

router.get("/all/file", (req, res) => {});

router.get("/", function (req, res) {
  try {
    if (req.isAuthenticated() || req.user) {
      return res.redirect("/dashboard");
    } else {
      res.render("home");
    }
  } catch (error) {
    res.render("error", { message: "internal server error", error });
  }
});
router.get("/signup", function (req, res) {
  res.render("signup");
});
router.get("/loginPage", function (req, res) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

router.post("/register", async function (req, res, next) {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      new notifier.WindowsBalloon().notify({
        title: "",
        message: "Fill All the Fields",
      });
      return res.redirect("/signup");
    }

    const user = await usermodel.findOne({ username: req.body.username });
    const userAgain = await usermodel.findOne({ email: req.body.email });

    if (user) {
      notifier.notify({
        title: "",
        message: "User Already Exists with the given username",
      });
      return res.redirect("/signup");
    } else if (userAgain) {
      notifier.notify({
        title: "",
        message: "User Already Exists with the given email",
      });
      return res.redirect("/signup");
    } else {
      // res.render("verifyEmail", { SigningUser: req.body });
      var newUser = new usermodel({
        username: req.body.username,
        email: req.body.email,
      });
      usermodel
        .register(newUser, req.body.password)
        .then(function (registereduser) {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/dashboard");
          });
        });
    }
  } catch (error) {
    res.redirect("/signup");
  }
});

router.get("/dashboard", isLoggedIn, (req, res) => {
  res.redirect(`/dashboard/root`);
});

//function to find a folders path upto the root folder

async function getFolderPath(id) {
  let currentFolder,
    path = [];
  if (id !== "root") {
    currentFolder = await folderModel.findOne({ _id: id });
    path.push({ name: currentFolder.name, id: currentFolder._id });

    while (currentFolder.parent !== "root") {
      currentFolder = await folderModel.findOne({ _id: currentFolder.parent });
      if (currentFolder) {
        // path = `${currentFolder.name}>${path}`;
        path.unshift({ name: currentFolder.name, id: currentFolder._id });
      }
    }
  } else {
    path = null;
  }

  return path;
}

router.get("/dashboard/:id", isLoggedIn, async (req, res) => {
  let folders = await folderModel.find({
    parent: req.params.id,
    user: req.session.passport.user._id,
  });
  // gfs.files
  //   .find({
  //     contentType: "image/jpeg",
  //   })
  //   .toArray(function (err, files) {
  //     if (err) {
  //       res.json(err);
  //     }

  //   });
  let files = await fileModel.find({
    parent: req.params.id,
    user: req.session.passport.user._id,
  });
  let path = await getFolderPath(req.params.id);
  console.log(path);
  res.render("dss", { folders, files, path });
});
router.post("/createfolder", isLoggedIn, async (req, res) => {
  let urlArray = req.headers.referer.split("/");
  let parentId = urlArray[urlArray.length - 1];

  let folder = await folderModel.create({
    name: req.body.foldername,
    parent: parentId,
    user: req.session.passport.user._id,
  });

  res.redirect(req.headers.referer);
});
router.get("/folder/:id", async (req, res) => {
  let folder = await folderModel.findById(req.params.id);
  res.render("folder", { folder });
});
router.post("/sendOtp", async (req, res) => {
  try {
    const otp = Math.floor(Math.random() * 1000000);

    const createdOtp = await otpModel.create({
      otp: otp,
      email: req.body.email,
      otpExpiry: new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000),
    });

    const obj = {
      Email: req.body.email,
      OTP: createdOtp.otp,
    };

    const result = await mailer(obj);
    res.send(result);
  } catch (error) {
    res.render("error", error);
  }
});

router.post("/verifyAccount", async function (req, res) {
  try {
    const { email, username, password, otp } = req.body;

    const latestOtp = await otpModel
      .findOne({ email: email })
      .sort({ _id: -1 });

    if (!latestOtp)
      return res.render("error", {
        message: "Something went wrong",
        error: { status: 401 },
      });

    if (latestOtp.otp !== otp || latestOtp.otpExpiry < Date.now()) {
      new notifier.WindowsBalloon().notify({
        title: "",
        message: "Invalid OTP",
      });
      res.redirect(req.headers.referer);
    } else {
      // create user
      var newUser = new usermodel({
        username: username,
        email: email,
      });
      usermodel
        .register(newUser, password)
        .then(async function (registereduser) {
          // delete otps of this user from otp db
          await otpModel.deleteMany({ email: registereduser.email });

          passport.authenticate("local")(req, res, function () {
            return res.redirect("/profile");
          });
        })
        .catch((error) => {
          res.render("error", error);
        });
    }
  } catch (error) {
    res.render("error", error);
  }
});

router.get("/check", async function (req, res) {
  let user = await usermodel.findOne({ email: req.user.email });
  if (user) {
    res.redirect("/profile");
  } else {
    await usermodel.create({
      username: req.user.given_name,
      email: req.user.email,
    });
    res.redirect("/profile");
  }
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/profile", isLoggedIn, function (req, res) {
  usermodel
    .findOne({ email: req.session.passport.user.email })
    .then(function (user) {
      console.log(user);
      res.send(user);
    });
  // res.send(req.session.passport.user)
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/new/google/callback",
  passport.authenticate("google", {
    successRedirect: "/check",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

router.get("/file/:id", async (req, res) => {
  gfs.files.findOne({ filename: req.params.id }, (err, file) => {
    console.log(file);
    const readStream = gridFsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  });
});

router.post("/share/:filename", async (req, res) => {
  await gfs.files.findOne(
    { filename: req.params.filename },
    async (err, file) => {
      const filedata = {
        password: req.body.password,
        path: file._id,
        originalname: file.filename.split("*")[1],
      };
      if (req.body.password != null) {
        filedata.password = await bcrypt.hash(filedata.password, 10);
      }
      const sharefile = await shaareModel.create(filedata);
      console.log(sharefile);
      // res.render('index', {filelink : `${req.headers.origin}/file/${user._id}`})
      res.json({ url: `http://localhost:3000/sharefile/${sharefile._id}` });
      // const readStream = gridFsBucket.openDownloadStream(file._id);
      // readStream.pipe(res);
    }
  );
});

// add Files or Folders to starred
router.get('/star/:id',async (req, res) =>{
  try {
    let ID = req.params.id;
    let LoggedInUser = await usermodel.findOne({_id: req.session.passport.user._id});

    const isValidId = mongoose.isValidObjectId(ID);

    if(isValidId){
      // Then its a folder
      if(LoggedInUser.starredFolders.indexOf(ID) === -1){
        // The Folder is Not Starred
        LoggedInUser.starredFolders.unshift(ID);
      }else{
        // The Folder is Already Starred
        LoggedInUser.starredFolders.splice(ID,1);
      }
      return res.redirect(req.headers.referer);
    }else{
      // File OR Garbage Id
      gfs.files.findOne({ filename: ID }, (err, file) => {
        if(file){
          // Its a file surely
          if(LoggedInUser.starredFiles.indexOf(ID) === -1){
            // The File is Not Starred
            LoggedInUser.starredFiles.unshift(ID);
          }else{
            // The File is Already Starred
            LoggedInUser.starredFiles.splice(ID,1);
          }
          return res.redirect(req.headers.referer);
        }else{
          // garbage id 
          new notifier.WindowsBalloon().notify({
            title: "",
            message: "Tera music m*******od",
          });
          return res.redirect(req.headers.referer);
        }
      })
    }
    // res.send(ID);
    // res.redirect(req.headers.referer);
    console.log(ID);
  } catch (error) {
    res.render("error", { message: "internal server error", error });
  }
})

router
  .route("/sharefile/:id")
  .get(async (req, res) => {
    const shareFile = await shaareModel.findById(req.params.id);
    console.log(shareFile);
    if (shareFile.password !== null) {
      res.render("password");
    }
  })
  .post(async (req, res) => {
    console.log(req.params.id + "ye ha id");
    const shareFile = await shaareModel.findById(req.params.id);
    console.log(shareFile);
    if (shareFile.password != null) {
      if (await bcrypt.compare(req.body.password, shareFile.password)) {
        gfs.files.findOne({ _id: shareFile.path }, async (err, file) => {
          res.set({
            "Content-Type": file.contentType,
            "Content-Disposition": "attachment; filename=" + file.filename,
          });
          const readStream = await gridFsBucket.openDownloadStreamByName(
            file.filename
          );
          readStream.pipe(res);
        });
      } else {
        res.render("password", { error: true });
      }
    }
  });

  router.get("/deletefile/:id", async (req, res) => {
    gfs.files.remove({filename : req.params.id , root : 'uploads'}, async(err , gridStore)=>{
      if(err){
        return res.status(404).json({err:err})
      }
     await fileModel.deleteOne({filename : req.params.id})
      return res.redirect(req.headers.referer)
    })

  });

  router.get("/deletefolder/:id", async (req, res) => {
    await folderModel.findByIdAndDelete({_id : req.params.id})
    res.redirect(req.headers.referer)
  }) 

function isLoggedIn(req, res, next) {
  // req.user ? next() : res.sendStatus(401);
  if (req.isAuthenticated() || req.user) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;
