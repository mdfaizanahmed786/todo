require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userAuthenticate = require("./userauth");
const cors = require("cors");
const { Todos, Users } = require("./db");

const { enterTodo, userValidation } = require("./inputvalidation");
app.use(cors());
app.use(express.json());
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

app.post("/signup", async (req, res) => {
  try {
    const inputPayload = req.body;
    const parsedInput = userValidation.safeParse(inputPayload);

    if (!parsedInput.success) {
      return res.status(400).json({ message: "Please enter correct credentials", errors: parsedInput.error });
    }
    // if(Users.findOne({email:parsedInput.data.email ,isVerified: false})){
    //  const token = jwt.sign({ email: parsedInput.data.email, isVerified:false}, process.env.JWT_SECRET, { expiresIn: "1m" });
    //  const msg = {
    //    to: parsedInput.data.email,
    //    from: "riyanahmed1703@gmail.com",
    //    subject: "Verify your email",
    //    html: `<h1>Click on the link to verify your email to continue using your todo app</h1><a href="http://localhost:5173/verify/${token}">Click here</a>`,
    //  };
 
    //  await sgMail.send(msg);
    // }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(inputPayload.password, salt);

    await Users.create({
      username: parsedInput.data.username,
      email: parsedInput.data.email,
      password: securePassword,
      isVerified: false,
    });
    const token = jwt.sign({ email: parsedInput.data.email, isVerified:false}, process.env.JWT_SECRET, { expiresIn: "1m" });
    const msg = {
      to: parsedInput.data.email,
      from: "riyanahmed1703@gmail.com",
      subject: "Verify your email",
      html: `<h2>Click on the link to verify your email to continue using your todo app this will expire in 1 minute</h2><a href="http://localhost:5173/verify/${token}">Click here</a>`,
    };

    await sgMail.send(msg);

   
    return res.status(200).json({ message: "User signed up successfully and email send successfully", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error"});
  }
});
app.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  const email = jwt.decode(token).email;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await Users.updateOne({ email }, { isVerified: true });
    const newToken = jwt.sign({ email: decoded.email, isVerified: true }, process.env.JWT_SECRET);

    res.status(200).json({ message: "Email verified successfully", token: newToken });
  } catch (error) {
    console.error(error);
    const user = await Users.findOne({ email});
    if (error.name === "TokenExpiredError") {
      console.log("Token expired and User not verified. User deleted.")
      await Users.deleteOne({ email, isVerified: false});
      return res.status(400).json({ error: "Token expired and User not verified. User deleted." });
    }
    res.status(500).json({ error: "Internal Server Error", error });

  }
});

app.post("/signin",  async (req, res) => {
  try {
    const inputPayload = {
      email: req.body.email,
      password: req.body.password,
    };

    const parsedInput = userValidation.safeParse(inputPayload);

    if (!parsedInput.success) {
      return res.status(400).json({
        message: "Please check your credentials",
        errors: parsedInput.error.message,
      });
    }

    const { email, password } = parsedInput.data;
    const user = await Users.findOne({ email,  isVerified: true});

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ email: parsedInput.data.email, isVerified:true }, process.env.JWT_SECRET, { expiresIn: "5d" });
    
    res.status(200).json({ message: "User signed in successfully", token });
  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/todo", userAuthenticate, async (req, res) => {
  const userEmail = req.email
 // console.log(userEmail)
      const inputPayload = req.body;
      const parsedInput = enterTodo.safeParse(inputPayload);
      if (!parsedInput.success) {
       return res.status(400).json({ error: "Invalid Input", success: false });
      } 
        await Todos.create({
          title: parsedInput.data.title,
          createdBy: userEmail,
          description: parsedInput.data.description,
          completed: false,
        });
        res.status(200).json({ message: "Todo Created", success: true });
      

});

app.get("/todos", userAuthenticate, async (req, res) => {
  const userEmail = req.email
    const todos = await Todos.find({createdBy: userEmail}).sort({ updatedAt: -1 })

      const user = await Users.find({ email: userEmail });
    const userName = user[0].username;
   // console.log(userName)

    res.status(200).json({
      todos,
      userName
    });
});

app.post("/delete/:id", userAuthenticate, async (req, res) => {
  try {
    await Todos.findByIdAndDelete(req.params.id);
    // console.log(findTodo);
    // if (!findTodo) {
    //     return res.status(400).json({ error: "Invalid Input" });
    // }

    return res.status(200).json({ message: "Todo Deleted" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/update/:id", userAuthenticate, async (req, res) => {
  try {
    const todoId = req.params.id;
    const updateData = req.body;
    const updatedTodo = await Todos.findByIdAndUpdate(todoId, updateData, {
      new: true,
    });
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo updated", updatedTodo });
  } catch (err) {
    res.status(400).json({ message: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Server Started on port 5000");
});
