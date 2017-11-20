var express=require('express');
var blog=require('../models/blog');
var User=require('../models/user');
var router=express.Router();
var comment=require('../models/comment');
var middleware=require('../middleware/new');
router.get('/blogs/:id/comments/new',middleware.isloggedin,function(req,res){
blog.findById(req.params.id,function(err,blog){
    if(err){
        console.log(err);
        res.redirect("back");
        
    }
    else{
        res.render('newc',{blog:blog});
    }
});
});
router.post('/blogs/:id',middleware.isloggedin,function(req,res){
  blog.findById(req.params.id,function(err,blog){
      if(err){
          res.redirect("back");
          console.log(err);
          
      }
      else{
          var text=req.body.text;
          var author=req.body.author;
          var data={
              author:author,
              text:text                  
          }
          comment.create(data,function(err,comm){
              if(err){
                  console.log(err)
                  res.redirect("back");
              }
              else{
                  comm.author.id=req.user._id;
                  comm.author.username=req.user.username;
                  comm.save();
                  blog.comments.push(comm);
                  blog.save();
                  res.redirect('/blogs/'+blog._id);
              }
              
          });
          
          
      }
  });
    
});


module.exports=router;
