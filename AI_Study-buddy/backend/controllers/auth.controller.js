// controllers/AuthController.js

import { UserSession } from "../models/UserSession.js"; // Ensure this import is correct
import { authService } from "../services/auth.service.js";
import ResponseHandler from "../utils/apiResponse.js"; // Assuming this is your response utility

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
      // Extract device info from the request
      const ipAddress = req.ip; // Or req.connection.remoteAddress, depending on your setup
      const userAgent = req.headers["user-agent"];

      const result = await authService.login(req.dto, { ipAddress, userAgent }); // Pass device info
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

  async getUserSessions(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const sessions = await UserSession.find({ user: req.user._id }).sort({
        loginTime: -1,
      });
      const formatted = sessions.map((s) => ({
        loginTime: s.loginTime,
        logoutTime: s.logoutTime || null,
        ipAddress: s.ipAddress || "N/A", // Include new fields
        userAgent: s.userAgent || "N/A", // Include new fields
      }));
      response.success({ sessions: formatted }, "User session history");
    } catch (error) {
      next(error);
    }
  }

  async getAllSessions(req, res, next) {
    const response = new ResponseHandler(res);
    const allowedRoles = ["superadmin", "admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return response.error(null, "Forbidden", 403);
    }

    try {
      const sessions = await UserSession.find()
        .populate("user", "name email role")
        .sort({ loginTime: -1 });

      const formatted = sessions.map((s) => ({
        user: {
          name: s.user.name,
          email: s.user.email,
          role: s.user.role,
        },
        loginTime: s.loginTime,
        logoutTime: s.logoutTime || null,
        ipAddress: s.ipAddress || "N/A", // Include new fields
        userAgent: s.userAgent || "N/A", // Include new fields
      }));

      response.success({ sessions: formatted }, "All user sessions");
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
    const allowedRoles = ["superadmin", "admin"];

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
