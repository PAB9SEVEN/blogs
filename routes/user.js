var express=require('express');
var router=express.Router();
var passport=require('passport');
var localStrategy=require('passport-local');
var User=require('../models/user');
//=================
//AUTH ROUTES
router.get('/register',function(req,res){
    res.render('register');
});
router.post('/register',function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welccome to the blogpost! "+user.username);
            res.redirect('/blogs');
        });
       
    });
    //res.send("registera");
});

router.get('/login',function(req,res){
    res.render('login');
});
router.post('/login',passport.authenticate("local",{
    successRedirect:'/blogs',
    failureRedirect:'/login'
}),function(req,res){
 //res.send("logged in")   ;
});

router.get('/logout',function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect('/');
});

module.exports=router;
