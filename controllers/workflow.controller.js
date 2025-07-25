import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log(`Starting workflow for subscription ${subscriptionId}`);

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription) {
    console.log(`Subscription ${subscriptionId} not found`);
    return;
  }

  if (subscription.status !== "active") {
    console.log(`Subscription ${subscriptionId} is not active`);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  console.log(`Renewal date: ${renewalDate.format("YYYY-MM-DD")}`);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    console.log(
      `Checking ${daysBefore}-day reminder at ${reminderDate.format()}`
    );

    if (reminderDate.isAfter(dayjs())) {
      console.log(
        `⏳ Sleeping until ${daysBefore}-day reminder at ${reminderDate.format()}`
      );
      await sleepUntilReminder(
        context,
        `${daysBefore}-day reminder`,
        reminderDate
      );
      console.log(`🔔 Triggering ${daysBefore}-day reminder`);
      await triggerReminder(context, `${daysBefore}-day reminder`);
    } else {
      console.log(`⏩ Skipping ${daysBefore}-day reminder (date in past)`);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(
    `⏳ Sleep until ${label} at ${date.format(
      "YYYY-MM-DD HH:mm:ss Z"
    )} (${date.toDate()})`
  );
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
    //Send email here or SMS or Push any notification...
  });
};
