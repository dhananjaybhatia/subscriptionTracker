//FOR RATE-LIMITING

import aj from "../arcject.config.js";

const arcjectMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    console.log("Arcjet decision:", decision);
    console.log("Remaining tokens:", decision.results[0]?.remaining);

    if (decision.isDenied()) {
      console.log("Arcjet reason:", decision.reason);

      if (decision.reason.isRateLimit())
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (decision.reason.isBot())
        return res.status(403).json({ error: "Bot detected" });
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    console.error(`Arcject Middleware Error: ${error}`);
    next(error);
  }
};

export default arcjectMiddleware;
