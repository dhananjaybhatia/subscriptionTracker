import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//Basically the purpse is - someone is making a request - middleware make sure before the request is completed - there is a check in between. if everything supplied by the user is correct then move to the next step.

//steps are - someone is making a request getUser details -> authorize middle -> verify -> next -> get details.

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing or invalid token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Get user

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach user to request.
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default authorize;
