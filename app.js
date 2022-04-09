require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const session = require("express-session");
const flash = require("express-flash");
// const MongoDbStore = require("connect-mongo")(session)



const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));
app.set("view engine",'ejs');

// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection:"sessions"
// })
// app.use(session({
//     secret: process.env.COOKIESSECRET,
//     resave:false,
//     saveUninitialized:false,
//     cookie:{maxAge: 1000*60*60*24}
//     }));

//     app.use(flash())


mongoose.connect("mongodb://localhost:27017/credentials");

const userSchema = {
    name:String,
    email:String,
    password:String
}
// const Schema = mongoose.Schema;

const menuSchema ={
    name: {type:String, required:true},
    image: {type:String, required:true},
    price: {type:Number, required:true},
    size: {type:String, required:true}
};

const User = new mongoose.model("user",userSchema); 
const Menu = mongoose.model("menu",menuSchema);




app.get("/",function(req,res){
    // Menu.find().then(function(menu){
        // console.log(menu);
        res.render("home");

    // })
});

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/dashboard",function(req,res){
    // res.render("dashboard");
    Menu.find().then(function(menu){
        // console.log(menu);
        res.render("dashboard",{menu:menu});

    })
})
app.get("/cart",function(req,res){
    res.render("cart");
})
app.get("/adminPage",function(req,res){
    res.render("adminPage")
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
        Menu.find().then(function(menu){
            // console.log(menu);
            res.render("dashboard",{menu:menu});
    
        })
        // res.render("dashboard")
    }
});

});


app.post("/login",function(req,res){
    const email = req.body.email;
    const password = md5(req.body.password);
    const adminEmail = "admin@foodkart.com"


    // User.findOne({email:adminEmail},function(err,foundUser){
    //     if(err){
    //         res.send(err);
    //     }
    //     else{
    //         if(foundUser){
    //             if(req.body.password===process.env.ADMINPASSWORD){
    //                 res.render("adminPage");
    //             }
    //             else{
    //                 res.send("incorrect password");
    //             }
    //         }
    //         else{
    //             res.send("Unable to find a user with your email");
    //           }
    //     }
    // });
    

    User.findOne({email:email},function(err,foundUser){
        if(err){
            res.send(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    Menu.find().then(function(menu){
                        // console.log(menu);
                        res.render("dashboard",{menu:menu});
                
                    })
                    // res.render("dashboard");
                }
                else{
                    res.send("incorrect password");
                }
            }
            else{
                res.send("Unable to find a user with your email");
              }
        }
    });

});
// }

app.listen("3000",function(req,res){
console.log("server started with port 3000");
});