const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended : true}))

const userModel = require('./moduls/user')
const postModel = require('./moduls/post')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const user = require('./moduls/user')
app.use(cookieParser())

// user registration route
app.get('/registration',(req,res)=> {
    res.render("register")
})

// user creation  
app.post('/createdUser',async (req,res)=> {
    const {username,email,password, name} = req.body
    // password dcryption 
    bcrypt.genSalt(10,(err,salt)=> {
        console.log(salt)
        bcrypt.hash(password,salt,async(err,dcryptedpassword)=> {
            const createdUser = await userModel.create({
                username,
                email,
                name,
                password : dcryptedpassword
            })
            console.log(createdUser)
        })
        //    cookie set on client side 
        let token = jwt.sign({email},"shhhhhh");
        res.cookie("token",token)
        res.redirect('/login')
    })
})

// user loginm routeS
app.get('/login',(req,res)=> {
    res.render("login")
})
// jwt verify for login 
app.post('/logincheck',async(req,res)=> {
    const user = await userModel.findOne({email : req.body.email})
    console.log(user)
    if(!user) return res.send("Email or pasword dosent exist")
        else {
    bcrypt.compare(req.body.password, user.password,async(err,result)=> {
        console.log(result)
        if(result) {
            let token = jwt.sign({email : req.body.email},"shhhhhh");
        res.cookie("token",token)
            return res.redirect("/profile")
        }
            else return res.send("You must be logged in to reached profile")
    })
    }
})

// for accesing frofile direct 
app.get("/profile",isloggedin,async(req,res)=> {
   try {
    let userdata = await userModel.findOne({email : req.user.email}).populate('posts');
    console.log(userdata)
    res.render("profile",{userdata : userdata || {}})
   } catch (error) {
    res.send(error)
   }
})
// login verification the person in really logged in or not

function isloggedin(req,res,next){
   try {
    if(req.cookies.token === "" || req.cookies.token === undefined) return res.redirect("/login")
        else {
    let data = jwt.verify(req.cookies.token,"shhhhhh")
    console.log(data)
    req.user = data
    next()
    }
   } catch (error) {
    res.send(error)
   }
}

// logout 
app.get("/logout",(req,res)=> {
    res.cookie("token", "")
    res.redirect("/login")
})


app.post ('/post',isloggedin,async(req,res)=> {     
    let user = await userModel.findOne({email : req.user.email})
    const {postTitle, postDips} = req.body  
         if(!postDips || !postDips) return res.redirect('/profile')
            else {
                try {
                    const newPost = await postModel.create({
                        title : postTitle,
                        dips : postDips,
                        userids : user._id
                    })
                    user.posts.push(newPost._id)
                    await user.save()
                    res.redirect('/profile')
                    } catch (error) {
                        res.send(error)
                    }
        }
})


try {
    app.get('/delete/:id',isloggedin,async(req,res)=> {
        const id = req.params.id
       const post = await postModel.findOneAndDelete({_id : id})
       console.log(post)
        //    userModel.posts.pull(id)
        //    await userModel.save()
       res.redirect("/profile")
    })
    
} catch (error) {
    res.send("Something went wrong")
}



// this is when you want to connect your backend to frond 
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


// app.get("/users",async(req,res)=> {
//     const users = await userModel.find().populate('posts')
//     res.send(users)
// })
app.listen(3000)