import "reflect-metadata";
import { JsonController, Get } from "routing-controllers";
import passport from "passport";

@JsonController("/auth")
export class AuthController {
  @Get("/google")
  async GoogleAuth() {
    return passport.authenticate("google", {
      scope: ["email", "profile"],
    });
  }

  @Get("/google/callback")
  async GoogleCallback() {
    return passport.authenticate("google", {
      scope: ["email", "profile"],
    });
  }
}
