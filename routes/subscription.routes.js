import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscription,
  allSubscription,
  getSubscriptionDetails,
  updateSubscriptionById,
  cancelSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// POST a new subscription (requires user to be authenticated)
subscriptionRouter.post("/", authorize, createSubscription);

// GET User subscription (requires user to be authenticated)
subscriptionRouter.get("/user/:id", authorize, getUserSubscription);

// GET all subscriptions (no authorise user is required. Anyone can see all plans)
subscriptionRouter.get("/", allSubscription);

// GET subscription details by subscription ID (for viewing one specific subscription)
subscriptionRouter.get("/:id", getSubscriptionDetails);

// Updates a specific subscription by ID (e.g., change price, status, or payment method).
subscriptionRouter.put("/:id", authorize, updateSubscriptionById);

// Delete Subs
subscriptionRouter.delete("/:id", (req, res) => ({ title: "Delete Subs" }));

// Cancel selected subscription
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

//upcoming renewals
subscriptionRouter.get("/upcoming-renewals", (req, res) => ({
  title: "Get upciming renewals",
}));

export default subscriptionRouter;
