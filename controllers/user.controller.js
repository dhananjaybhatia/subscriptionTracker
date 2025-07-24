import User from "../models/user.model.js";

//fetch all users from the database.
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

//fetch single user from the database.
export const getSingleUser = async (req, res, next) => {
  try {
    const singleUser = await User.findById(req.params.id).select("-password");
    if (!singleUser) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
      res.status(200).json({success: true, data: singleUser})
  } catch (error) {
    next(error);
  }
};
