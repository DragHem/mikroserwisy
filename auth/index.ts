import { createExpressServer } from "routing-controllers";
import { AuthController } from "./controllers/auth.controller";
import "dotenv/config";
import passport from "passport";
import session from "express-session";
import express, { Application } from "express";

import "./utils/passport.js";

// const sessionMiddleware = session({
//   secret: process.env.SESSION_SECRET as string,
//   resave: false,
//   saveUninitialized: false,
// });

// const app = createExpressServer({
//   routePrefix: "/api",
//   controllers: [AuthController],
//   middlewares: [sessionMiddleware, passport.initialize(), passport.session()],
// });

const app: Application = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string, // session secret
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`My Node.JS APP`);
});

// authetication route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Call back route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    accessType: "offline",
    scope: ["email", "profile"],
  }),
  (req, res) => {
    if (!req.user) {
      res.status(400).json({ error: "Authentication failed" });
    }
    // return user details
    res.status(200).json(req.user);
  }
);

app.listen(3000, () => {
  console.log("Server running at PORT: http://localhost:3000");
});
