var mongoose=require('mongoose');
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
   comments:[{type:mongoose.Schema.Types.ObjectId,
              ref:"comment"
    
}],
    
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
module.exports=blog;
