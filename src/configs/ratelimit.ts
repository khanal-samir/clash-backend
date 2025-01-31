import { rateLimit } from "express-rate-limit";

export const appLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// less limit for auth routes--prevents DDOS attack
export const authLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many login attempts, please try again in an hour.",
  // If behind a proxy:
  // trustProxy: true,
  // For production:
  // store: new RedisStore({...})
});
