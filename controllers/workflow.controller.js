// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const { serve } = require("@upstash/workflow/express");
// import Subscription from "../models/subscription.model.js";
// import dayjs from "dayjs";
// import { sendReminderEmail } from "../utils/send-email.js";

// const REMINDERS = [7, 5, 2, 1];

// export const sendReminders = serve(async (context) => {
//   const { subscriptionId } = context.requestPayload;
//   console.log(`Starting workflow for subscription ${subscriptionId}`);

//   const subscription = await fetchSubscription(context, subscriptionId);

//   if (!subscription) {
//     console.log(`Subscription ${subscriptionId} not found`);
//     return;
//   }

//   if (subscription.status !== "active") {
//     console.log(`Subscription ${subscriptionId} is not active`);
//     return;
//   }

//   const renewalDate = dayjs(subscription.renewalDate);
//   console.log(`Renewal date: ${renewalDate.format("YYYY-MM-DD")}`);

//   if (renewalDate.isBefore(dayjs())) {
//     console.log(`Renewal date has passed for subscription ${subscriptionId}`);
//     return;
//   }

//   for (const daysBefore of REMINDERS) {
//     const reminderDate = renewalDate.subtract(daysBefore, "day");
//     console.log(
//       `Checking ${daysBefore}-day reminder at ${reminderDate.format()}`
//     );

//     if (reminderDate.isAfter(dayjs())) {
//       console.log(
//         `⏳ Sleeping until ${daysBefore}-day reminder at ${reminderDate.format()}`
//       );
//       await sleepUntilReminder(
//         context,
//         `${daysBefore}-day reminder`,
//         reminderDate
//       );
//       console.log(`🔔 Triggering ${daysBefore}-day reminder`);
//       await triggerReminder(
//         context,
//         `${daysBefore}-day reminder`,
//         subscription
//       );
//     } else {
//       console.log(`⏩ Skipping ${daysBefore}-day reminder (date in past)`);
//     }
//   }
// });

// const fetchSubscription = async (context, subscriptionId) => {
//   return await context.run("get subscription", async () => {
//     return Subscription.findById(subscriptionId).populate("user", "name email");
//   });
// };

// const sleepUntilReminder = async (context, label, date) => {
//   console.log(
//     `⏳ Sleep until ${label} at ${date.format(
//       "YYYY-MM-DD HH:mm:ss Z"
//     )} (${date.toDate()})`
//   );
//   await context.sleepUntil(label, date.toDate());
// };

// const triggerReminder = async (context, label, subscription) => {
//   return await context.run(label, async () => {
//     console.log(`Triggering ${label} reminder`);

//     await sendReminderEmail({
//       to: subscription.user.email,
//       type: label,
//       subscription,
//     });
//   });
// };

import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );
    }

    if (dayjs().isSame(reminderDate, "day")) {
      const label =
        daysBefore === 1
          ? "Final day reminder"
          : `${daysBefore} days before reminder`;

      await triggerReminder(context, label, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
