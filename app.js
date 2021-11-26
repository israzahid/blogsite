const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to this blog page. There are a couple functionalities here. You can edit the URL to add `/about` to get to the about section, `/contact` to get to the contact section, or add `/compose` to compose a new post! When you compose a couple posts you can 'search' for some of these posts by adding `/post/postName` to the url (with 'postName' being the name of the post).";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Hi, I'm Isra. You can contact me at any of the below links!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })

});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  post.save(function(err){
  
    if(!err) {
      res.redirect("/");
    }
  
  });

});

app.get("/posts/:postID", function(req, res){
  const reqPostID = req.params.postID;

  Post.findOne({_id:reqPostID}, function(err, post) {
    res.render("post", {
      postTitle: post.title,
      postBody: post.body
    });
    
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
