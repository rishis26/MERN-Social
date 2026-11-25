import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/tryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password, gender } = req.body;
  const file = req.file;

  const missing = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!password) missing.push("password");
  if (!gender) missing.push("gender");
  if (!file) missing.push("file");

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Please fill out all the details required. Missing: ${missing.join(", ")}`,
    });
  }

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User already exist! ",
    });

  const fileUrl = getDataUrl(file); // Handling file things

  const hashPassword = await bcrypt.hash(password, 10); // Hashing the password

  const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  user = await User.create({
    name,
    email,
    password: hashPassword,
    gender,
    profilePic: {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  generateToken(user._id, res);
  res.status(201).json({
    message: "User registered",
    user,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "Invalid credential",
    });
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword)
    return res.status(400).json({
      message: "Invalid credential",
    });
  generateToken(user._id, res);
  res.json({
    message: "User logged in",
    user,
  });
});

export const logoutUser = TryCatch((req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({
    message: "Logged out successfully",
  });
});
