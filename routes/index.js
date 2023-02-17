var express = require("express");
var router = express.Router();
var passport = require("passport");
const usermodel = require("../models/userModel");
const notifier = require("node-notifier");
const otpModel = require("../models/otpModel");

const localStrategy = require("passport-local");
const mailer = require("../nodemailer");

passport.use(new localStrategy(usermodel.authenticate()));

/* GET home page. */
router.get("/", function (req, res) {
  try {
    if (req.isAuthenticated() || req.user) {
      return res.redirect("/profile");
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
      res.render("verifyEmail", { SigningUser: req.body });
      // var newUser = new usermodel({
      // username:req.body.username,
      // email: req.body.email
      // })
      // usermodel.register(newUser,req.body.password)
      // .then(function(registereduser){
      //   passport.authenticate('local')(req,res,function(){
      //     res.redirect('/profile')
      //   })
      // });
    }
  } catch (error) {
    res.redirect("/signup");
  }
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

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

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

function isLoggedIn(req, res, next) {
  // req.user ? next() : res.sendStatus(401);
  if (req.isAuthenticated() || req.user) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;
