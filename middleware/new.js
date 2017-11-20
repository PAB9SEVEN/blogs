var passport=require('passport');
var blog=require('../models/blog');
var middlewareObj={};
middlewareObj.isloggedin=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
        
    }
    req.flash("error","You must first login");
    res.redirect('/login');
}
middlewareObj.check=function(req,res,next){
    if(req.isAuthenticated()){
        blog.findById(req.params.id,function(err,blogs){
            if(err){
                res.redirect("back");
            }
            else{
                if(blogs.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    req.flash("error","You don't have the permission to do that");
                    res.redirect("/blogs");
                }
            }
        });
    }
    else{
        req.flash("error","You must first login!");
res.redirect('back');
    }
    
}
module.exports=middlewareObj;