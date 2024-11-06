import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
// import postModel from "./models/postSchema.js";
import userModel from "./models/userSchema.js";  
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT
;
const DBURI = process.env.DUB;  
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
app.use(cors());

mongoose.connect(DBURI);  

mongoose.connection.on("connected", () => console.log("mongodb connected"));

mongoose.connection.on("error", (err) => console.log(err));

app.get("/", (req, res) => {
  res.json({
    message: "server up...",
    status: true,
  });
});



// signUp Api

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.json({
      message: "required fields are missing",
      status: false,
    });
    return;
  }

  const emailExist = await userModel.findOne({ email });

  console.log("emailExist", emailExist);

  if (emailExist !== null) {
    res.json({
      message: "email already been registered",
      status: false,
    });

    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  console.log("hashPassword", hashPassword);

  let userObj = {
    firstName,
    lastName,
    email,
    password: hashPassword,
  };

  // create user on db

  const createUser = await userModel.create(userObj);

  res.json({
    message: "user create successfully..",
    status: true,
  });

  console.log(body);

  res.send("signup api");
});

// Login Api

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({
      message: "required fields are missing",
      status: false,
    });
    return;
  }

  const emailExist = await userModel.findOne({ email });

  if (!emailExist) {
    res.json({
      message: "Invalid email & password",
      status: false,
    });
    return;
  }

  const comparePassword = await bcrypt.compare(password, emailExist.password);

  if (!comparePassword) {
    res.json({
      message: "Invalid email & password",
      status: false,
    });

    return;
  }

  res.json({
    message: "login successfully",
    status: true,
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http:localhost:${PORT}`);
});