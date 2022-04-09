const express = require("express");
const bodyParser = require("body-parser");
const  ejs = require("ejs");
const mongoose =require("mongoose");
const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));
app.set("view engine",'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

app.get("/",function(req,res){
    res.render("home")
})


app.listen("3000",function(req,res){
    console.log("Server started with port 3000");
});










