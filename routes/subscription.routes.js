import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send({ title: "Get all Subs" }));

subscriptionRouter.get("/:id", (req, res) =>
  res.send({ title: "Get Subscription details" })
);

export default subscriptionRouter;
