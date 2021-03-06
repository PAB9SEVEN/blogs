var express=require('express');
var exphbs=require('express-handlebars');
var path=require('path');
var methodOverride=require('method-override');
var passport=require('passport');
var localStrategy=require('passport-local');
var flash=require('connect-flash');
var User=require('./models/user');
var comment=require('./models/comment');
var blog=require('./models/blog');
var bodyParser=require('body-parser');
var expressSanitizer=require('express-sanitizer');
var mongoose=require('mongoose');
mongoose.connect('mongodb://blogpost:blogpost@ds131583.mlab.com:31583/blogsapp');
//mongoose.connect('mongodb://localhost/blogapp');
var app=express();
var authroutes=require('./routes/user');
var blogroutes=require('./routes/blog');
var commentroutes=require('./routes/comment');
var middleware=require('./middleware/new');
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');
app.set('partials',path.join(__dirname + '/views','partials'));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret:"cats",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:false}));
//tis should be always be aftre the body parser middleware
app.use(expressSanitizer());
    app.use(express.static(path.join(__dirname,'public')));
    app.use('/static', express.static(__dirname + '/public'));
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
});
app.use(authroutes);
app.use(blogroutes);
app.use(commentroutes);
/*
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
   author:{
       username:String,
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            
        }
    },
    created:{type:Date,default:Date.now}
});
var blog=mongoose.model('blog',blogSchema);
/*
blog.create({
    title:"Test blog",
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXYoF9-EZ4mqN1VahxeQZXAoLgRjF_YqasGJ7JtTxghY8g9ohB',
    body:"first test blog post"
});

//restful routes
app.get('/',function(req,res){
    res.render('landing');
});

app.get('/blogs',function(req,res){
  //  console.log('blogs');
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
//console.log(blogs);
            console.log(blogs[0].title);
                res.render('index',{blogs:blogs});

        }
    });
    
});
app.get('/blogs/new',middleware.isloggedin,function(req,res){
    res.render('new');
    
});
app.post('/blogs',function(req,res){
    var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var author={
        id:req.user._id,
        name:req.user.username
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
app.get('/blogs/:id',function(req,res){
    blog.findById(req.params.id,function(err,blogpost){
        if(err){
            res.render('/blogs');
        }
        else{
            console.log(blogpost);
            console.log(req.user);
            res.render('show',{blog:blogpost,user:req.user});
        }
    });
    
});
app.get('/blogs/:id/edit',function(req,res){
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
app.put('/blogs/:id',function(req,res){
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
 app.delete('/blogs/:id',function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
res.redirect("/blogs");
        }
        else{
            res.redirect('/blogs');
            
        }
    });
     
 });
*/
app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
    console.log("server started on "+app.get('port'));
});

           
           