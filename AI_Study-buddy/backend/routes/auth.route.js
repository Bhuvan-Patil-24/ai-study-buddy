import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { UserRegisterDto, UserLoginDto } from "../dtos/auth.dto.js";
import { validateDto } from "../middlewares/validateDto.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class AuthRoutes {
  constructor() {
    this.router = express.Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", validateDto(UserRegisterDto), this.authController.register);

    this.router.post("/login", validateDto(UserLoginDto), this.authController.login);

    this.router.post("/logout", this.authMiddleware.isAuthenticated, this.authController.logout);

    this.router.get("/sessions/me", this.authMiddleware.isAuthenticated, this.authController.getUserSessions);

    this.router.get("/sessions/all", this.authMiddleware.isAuthenticated, this.authController.getAllSessions);

    this.router.get("/users", this.authMiddleware.isAuthenticated, this.authMiddleware.checkRole(["superadmin", "admin"]), this.authController.getAllUsers);

    this.router.get("/me", this.authMiddleware.isAuthenticated, this.authController.verify);
  }

  getRouter() {
    return this.router;
  }
}
