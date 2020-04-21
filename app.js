var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect('mongodb://127.0.0.1/Blogs',{ useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

var BlogSchema = new mongoose.Schema({
	title: String,
	created: {type: Date,default: Date.now},
	image: String,
	description: String
});

var Blog = mongoose.model("Blog",BlogSchema);

app.get("/",function(req,res){
	res.send("Hello!");
});

app.get("/blogs",function(req,res){
	Blog.find({}, function(err,blogs){
	if(err)
		console.log(err);
	else
		res.render("index", {blogs: blogs});
	});
});

app.get("/blogs/new",function(req,res){
		res.render("new");
});

app.post("/blogs",function(req,res){
	var title = req.body.title;
	var image = req.body.image;
	var description = req.body.content;
	Blog.create({
			title:title,
			image:image,
			description:description
		},function(err,blog){
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blogFound){
		if(err)
			console.log(err);
		else
			res.render("show",{blog:blogFound});
	});
});

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,editBlog){
		if(err)
			console.log(err);
		else
			res.render("edit",{blog:editBlog});
	});
});

app.put("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,updateBlog){
		if(err)
			console.log(err);
		else
			res.redirect("/blogs/" + req.params.id);
	});
});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,updateBlog){
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
});

app.listen(27017,process.env.IP,function(){
	console.log("The Blogs Server Is Started");
});