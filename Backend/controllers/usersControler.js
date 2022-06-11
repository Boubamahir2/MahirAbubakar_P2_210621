import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
} from "../errors/index.js";
import  checkPermissions  from "../utils/checkPermissions.js";


// get all users
const getAllUsers = async (req, res, next) => {
  const users = await User.find({
    role: "user",
  }).select("-password");
  res.status(StatusCodes.OK).json({ users ,count:users.length});
};

// get single user
const getSingleUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
}

// show current user
const showCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({ user: req.user });
}

// update user
const updateUser = async (req, res, next) => {
  const { email, name, lastName } = req.body;
  if (!email || !name || !lastName) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  await user.save();
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
};

//  updateUserPassword 
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};