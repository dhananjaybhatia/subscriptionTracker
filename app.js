import express from "express";
import dotenv from "dotenv";
dotenv.config({ override: true });
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app
  .listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await connectToDatabase();
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err.message);
  });
