const router  = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//REGISTRATION
router.post("/register",async function(req,res){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
req.body.password = hash;
    const newUser = new User({
       
        email: req.body.email,
        password: req.body.password,
       username : req.body.username
      });

      try{
        const user = await newUser.save();
        res.status(201).json({message:"User registered successfully"});
      }
      catch (err) {
        res.status(500).json(err);
      }
})

//user login route
router.post("/signin",async(req, res) => {

  try{
var user = await User.findOne({username:req.body.username});
console.log(user);
if(user){
 
 
 const bytes = await bcrypt.compare(req.body.password, user.password);
console.log(bytes);
console.log(user);
 if(bytes){
  console.log(bytes);
  const token = jwt.sign({_id:user._id},process.env.SECRET,{expiresIn:"5d"});
console.log(token);
 
  res.json({
    message : "Successfully logged in",
    userid : user._id,
    token,
    username : user.username
  })


 
  
 }
 else{
  res.status(401).json({
    message : "Invalid password"
  });
 }
}
else{
  res.status(401).json({
    message : "Invalid username"
  });
}

  }
  catch(error){
    res.status(500).json({
      message : error
    });
  }
})














module.exports = router;