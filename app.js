//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_prathamesh:1210Nanu@cluster0.hm590.mongodb.net/blogDB");

//create post sechema
const postSchema = mongoose.Schema({
    name: String,
    body: String
});

//create a model/collection for posts
const Post = mongoose.model("Post",postSchema);

//sample post/document
const samplePost = new Post({
    name: "Home",
    body: homeStartingContent
});

//create userData schema
const userDataSchema = mongoose.Schema({
    email: String,
    password: String,
    isLogin: Boolean
});

//create model/collection for userData
const userData = mongoose.model("userData",userDataSchema);


app.get("/",function(req,res){

    Post.find({},function(err,foundItems){
        res.render("home",{
            homeContent: homeStartingContent,
            contents: foundItems
        });

    });
    
});


app.post("/",function(req,res){

});

app.get("/about",function(req,res){

    res.render("about",{
        aboutContent: aboutContent
    });
});

app.get("/login_page",function(req,res){

    res.render("login_page",{
        
    });
});

app.get("/register_page",function(req,res){

    res.render("register_page",{
        
    });
});

app.post("/register_page",function(req,res){
    const email = _.lowerCase(req.body.emailInput);
    const password = req.body.passwordInput;

    userData.findOne({email: email},function(err,foundEmail){
        if(foundEmail){
            res.redirect("/userExists");
        } else {

            bcrypt.hash(password,saltRounds,function(err,hash){
                const newUser = new userData({
                    email: email,
                    password: hash
                });

                newUser.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        res.redirect("/login_page");
                    }
                });
                
            });

            
        }

    });
    
});

app.get("/userExists",function(req,res){
    
    res.render("userExists",{

    });
});

app.get("/userNotExists",function(req,res){
    
    res.render("userNotExists",{

    });
});

app.get("/incorrectPass",function(req,res){
    
    res.render("incorrectPass",{

    });
});


app.get("/login_home",function(req,res){

    const fullUser = req.query.fullUser;
    const arr = fullUser.split(" ");
    const userName = (arr[0]);

    Post.find({},function(err,foundItems){
        res.render("login_home",{
            fullUser: fullUser,
            userName: userName,
            homeContent: homeStartingContent,
            contents: foundItems
        });

    });

    
    
    
});

app.post("/login_home",function(req,res){

    const email = _.lowerCase(req.body.emailInput);
    const password = req.body.passwordInput;

    userData.findOne({email: email},function(err,foundUser){
        if(foundUser){      
            
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result === true){

                    const arr = foundUser.email.split(" ");
                    const userName = (arr[0]);

                    Post.find({},function(err,foundItems){
                        res.render("login_home",{
                            fullUser: foundUser.email,
                            userName: userName,
                            homeContent: homeStartingContent,
                            contents: foundItems
                        });
                
                    });

                } else {
                    res.redirect("/incorrectPass");
                }
            });  

        } else {
            res.redirect("/userNotExists");
        }
    });
    
});

app.get("/login_about",function(req,res){

    const fullUser = req.query.fullUser;
    const arr = fullUser.split(" ");
    const userName = _.upperCase(arr[0]);

    Post.find({},function(err,foundItems){
        res.render("login_about",{
            fullUser: fullUser,
            userName: userName,
            aboutContent: aboutContent
        });

    });

});

app.get("/compose",function(req,res){

    const fullUser = req.query.fullUser;
    const arr = fullUser.split(" ");
    const userName = _.upperCase(arr[0])

    Post.find({},function(err,foundItems){
        res.render("compose",{
            fullUser: fullUser,
            userName: userName
        });

    });
});


app.post("/compose",function(req,res){

    const fullUser = req.query.fullUser;
    
    const newPost = new Post({
        name: _.lowerCase(req.body.titleBody),
        body: req.body.postBody 
    });
    newPost.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/login_home?fullUser=" + fullUser);
        }
    });

    

});


app.get("/login_post",function(req,res){
    const requestedPost = _.lowerCase(req.body.searchData);

    Post.findOne({name: requestedPost},function(err,post){

        userData.findOne({isLogin: true},function(err,foundEmail){
            const arr = foundEmail.email.split(" ");
            const userName = _.upperCase(arr[0]);
    
            res.render("login_post",{
                userName: userName,
                postTitle: _.capitalize(post.name),
                postBody: post.body
            });
        
        });

    });
});


// for search box

app.post("/post",function(req,res){
    const requestedPost = _.lowerCase(req.body.searchData);
    const fullUser = req.query.fullUser;
    
    if(fullUser){
        const arr = fullUser.split(" ");
        const userName = _.upperCase(arr[0]);

        Post.findOne({name: requestedPost},function(err,post){

            res.render("login_post",{
                fullUser: fullUser,
                userName: userName,
                postTitle: post.name,
                postBody: post.body
            });
        
        });

    } else {
        Post.findOne({name: requestedPost},function(err,post){

            res.render("post",{
                postTitle: post.name,
                postBody: post.body
            });

        });

    }

    

});

// for url

app.get("/posts/:postId/fullUser/:fullUser",function(req,res){
    const requestedId = req.params.postId;
    const fullUser = req.params.fullUser;

    if(fullUser){
        const arr = fullUser.split(" ");
        const userName = _.upperCase(arr[0]);

        Post.findOne({_id: requestedId},function(err,post){

            res.render("login_post",{
                fullUser: fullUser,
                userName: userName,
                postTitle: post.name,
                postBody: post.body
            });
        
        });

    } else {
        Post.findOne({_id: requestedId},function(err,post){

            res.render("post",{
                postTitle: post.name,
                postBody: post.body
            });

        });

    }
    


});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started running succesfully.");
});
