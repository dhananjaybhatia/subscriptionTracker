import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of the account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    if (!subscriptions || subscriptions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No subscriptions found." });
    }

    return res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const allSubscription = async (req, res, next) => {
  try {
    const allSubscription = await Subscription.find();
    res.status(200).json({ success: true, data: allSubscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("No subscription found.");
      error.status = 404;
      throw error;
    }

    // Ensure the logged-in user is the owner of the subscription
    if (req.user.id !== subscription.user.toString()) {
      const error = new Error("You are not the owner of this subscription.");
      error.status = 401;
      throw error;
    }

    // Update the subscription fields
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedSubscription });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      res.error = new Error("No active subscription to cancel");
      error.status = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user.id) {
      res.error = new Error("You can only cancel your own Subscription");
      error.status = 403;
      throw error;
    }

    await Subscription.deleteOne({ _id: subscriptionId });

    res.status(200).json({
      success: true,
      message: "Subscription has been successfully cancelled",
    });
  } catch (error) {
    next(error);
  }
};
