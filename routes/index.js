var express = require("express");
var router = express.Router();
var passport = require('passport');
const usermodel = require('../models/userModel')

const localStrategy=require('passport-local');

passport.use(new localStrategy(usermodel.authenticate()));

/* GET home page. */
router.get("/", function(res,req){
    res.render('index')
});


router.post('/register', function(req, res, next) {
    var newUser = new usermodel({
      username:req.body.username,
      email: req.body.email
    })
    usermodel.register(newUser,req.body.password)
    .then(function(registereduser){
      passport.authenticate('local')(req,res,function(){
        res.redirect('/profile')
      })
    })
});


router.get('/check',async function(req,res){
  let user= await usermodel.findOne({email:req.user.email})
  if(user){
    res.redirect('/profile')
  }
  else{
      await usermodel.create({
        username:req.user.given_name,
        email:req.user.email,
    })
    res.redirect('/profile')
  }

})

router.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/'
}),function(req,res,next){})  

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});  

router.get('/profile', isLoggedIn, function(req,res){
    usermodel.findOne({email:req.session.passport.user.email})
    .then(function(user){
        console.log(user)
        res.send(user)
    })
    // res.send(req.session.passport.user)
})

router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

router.get( '/new/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/check',
    failureRedirect: '/auth/google/failure'
  })
);

router.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  })


  function isLoggedIn(req, res, next) {
    // req.user ? next() : res.sendStatus(401);
    if(req.isAuthenticated()||req.user){
      return next()
    }
    else{
      res.redirect('/')
    }
  }
  

module.exports = router;
