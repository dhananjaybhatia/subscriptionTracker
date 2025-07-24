import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscription,
  allSubscription,
  getSubscriptionDetails,
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

// Update Subs
subscriptionRouter.put("/:id", (req, res) => ({ title: "Update Subs" }));

// Delete Subs
subscriptionRouter.delete("/:id", (req, res) => ({ title: "Delete Subs" }));

// Cancel subs
subscriptionRouter.put("/:id/cancel", (req, res) => ({ title: "Cancel Subs" }));

//upcoming renewals
subscriptionRouter.get("/upcoming-renewals", (req, res) => ({
  title: "Get upciming renewals",
}));

export default subscriptionRouter;
