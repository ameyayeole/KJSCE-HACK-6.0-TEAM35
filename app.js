
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));
app.set("view engine",'ejs');

mongoose.connect("mongodb://localhost:27017/credentials");

const userSchema = {
    name:String,
    email:String,
    password:String
}

const User = new mongoose.model("user",userSchema); 

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/dashboard",function(req,res){
    res.render("dashboard");
})

app.post("/register",function(req,res){


const newUser = new User({
    name:req.body.name,
    email:req.body.email,
    password:md5(req.body.password)
});

newUser.save(function(err){
    if(err){
        res.send(err);
    }
    else{
        res.render("dashboard")
    }
});

});


app.post("/login",function(req,res){
    const email = req.body.email;
    const password = md5(req.body.password);
    if(email==="admin@gmail.com" ){

    }
    User.findOne({email:email},function(err,foundUser){
        if(err){
            res.send(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("dashboard");
                }
                else{
                    res.send("incorrect password");
                }
            }
            else{
                res.send("Unable to find a user with your email");
              }
        }
    })
});


app.listen("3000",function(req,res){
console.log("server started with port 3000");
});