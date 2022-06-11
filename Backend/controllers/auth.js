// const Token = require("../models/Token");
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
// import {
//   attachCookiesToResponse,
//   createTokenUser,
//   sendVerificationEmail,
//   sendResetPasswordEmail,
//   createHash,
// } from "../utils";
import crypto from "crypto"; //its built in function in node js for creating a buffer of random bytes

// @desc    Register user
const register = async (req, res, next) => {
  const { name, lastName, email, password,} = req.body;
  if (!name || !email || !password, !lastName) {
    throw new BadRequestError("please provide all values");
  }
  const alreadyExists = await User.findOne({ email });
  if (alreadyExists) {
    throw new BadRequestError("user already exists");
  }

  // create user verification token
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    lastName,
    email,
    password,
  });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  });
};

// login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide all values");
  }
  // find user by email and password
  // its important to select(+password) so that we can compare password with hashed password
  const user = await User.findOne({ email }).select("+password");
  console.log(email, password);
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnAuthenticatedError("password is incorrect");
  }
  // veryfy user is verified
    // if (!user.isVerified) {
    //   throw new CustomError.UnauthenticatedError("Please verify your email");
    // }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  });
};



export { register, login };
