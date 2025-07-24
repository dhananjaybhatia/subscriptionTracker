import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Why Use Transactions?
//Prevent partial updates (e.g., balance deducted but subscription not created)
//Useful for financial, user-auth, or multi-model operations
//Requires MongoDB replica set (even if it's a single-node dev replica set)

export const signUp = async (req, res, next) => {   
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;

    //check if user already exist or not?
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error("User Already exists.");
      error.statusCode = 409;
      throw error;
    }

    // if its a new user then we need to hash the password:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          name: name,
          email: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign(
      { userId: newUser[0]._id }, // Payload
      process.env.JWT_SECRET, // Secret key (keep private!)
      { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration time
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User Created Successfully !",
      data: { token, user: newUser[0] },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 404;
      throw error;
    }
    //compare password is the current password they are typing and user.password is saved in our db.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully.",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {};
