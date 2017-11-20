var express=require('express');
var passport=require('passport');
var router=express.Router();
var blog=require('../models/blog');
var middleware=require('../middleware/new');
var User=require('../models/user');
/*
blog.create({
    title:"Test blog",
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXYoF9-EZ4mqN1VahxeQZXAoLgRjF_YqasGJ7JtTxghY8g9ohB',
    body:"first test blog post"
});
*/
//restful routes
router.get('/',function(req,res){
    res.render('landing');
});

router.get('/blogs',function(req,res){
  //  console.log('blogs');
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
//console.log(blogs);
            //console.log(blogs[0].title);
                res.render('index',{blogs:blogs});

        }
    });
    
});
router.get('/blogs/new',middleware.isloggedin,function(req,res){
    res.render('new');
    
});
router.post('/blogs',middleware.isloggedin,function(req,res){
    var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newb={title:title,image:image,body:body,author:author}   
   blog.create(newb,function(err,newblog){
       if(err){
           console.log(err);
           res.render('new');
                  }
else{
    console.log(newblog);
    console.log("Passed");
    res.redirect('/blogs');
}       
   });
    
});
router.get('/blogs/:id',function(req,res){
    blog.findById(req.params.id).populate("comments").exec(function(err,blogpost){
        if(err){
            res.render('/blogs');
        }
        else{
            //console.log(blogpost);
            //console.log(req.user);
            console.log(blogpost.comments);
            res.render('show',{blog:blogpost,comment:blogpost.comments});
        }
    });
});

router.get('/blogs/:id/edit',middleware.check,function(req,res){
    blog.findById(req.params.id,function(err,editblog){
        if(err){
            console.log(err);
            res.redirect('/blogs');
            
        }
        else{
    res.render('edit',{editblog:editblog});
            
        }
    });
});
//update route
router.put('/blogs/:id',middleware.check,function(req,res){
    //res.send("update route");
       var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var newb={title:title,image:image,body:body} 
    blog.findByIdAndUpdate(req.params.id,newb,function(err,updated){
        if(err){
            res.redirect("/blogs");
            
        }
        else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
    
});
 router.delete('/blogs/:id',middleware.check,function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
res.redirect("/blogs");
        }
        else{
            res.redirect('/blogs');
            
        }
    });
     
 });
module.exports=router;