import express from "express";
import dotenv from "dotenv";
dotenv.config({ override: true });
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjectMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();
app.use(express.json()); // allows help use json data sent through requests.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjectMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app
  .listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await connectToDatabase();
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err.message);
  });
