// controllers/AuthController.js

import { authService } from "../services/auth.service.js";
import ResponseHandler from "../utils/apiResponse.js";

export class AuthController {
  async register(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await authService.register(req.dto);
      response.success(result, "User registered", 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await authService.login(req.dto);
      response.success(result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await authService.logout(req.user);
      response.success(result, "User logged out");
    } catch (error) {
      next(error);
    }
  }


  async verify(req, res, next) {
    const response = new ResponseHandler(res);
    const user = req.user;
    try {
      const result = await authService.verify(user);
      response.success(result, "User Verified successfully");
    } catch (error) {
      response.error(null, "User not verified", 401);
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    const response = new ResponseHandler(res);
    const allowedRoles = ["admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return response.error(null, "Forbidden", 403);
    }

    try {
      const users = await authService.getAllUsers();
      response.success({ users }, "All users fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
