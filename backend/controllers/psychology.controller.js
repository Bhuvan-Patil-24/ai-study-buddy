import { psychologyService } from "../services/psychology.service.js";
import ResponseHandler from "../utils/apiResponse.js";

export class PsychologyController {
  async submitTest(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await psychologyService.submitTest(req.user._id, req.dto);
      response.success(result, "Psychology test submitted successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getTodayStatus(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await psychologyService.getTodayTestStatus(req.user._id);
      response.success(result, "Today's test status retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getTestHistory(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const limit = parseInt(req.query.limit) || 30;
      const tests = await psychologyService.getUserTestHistory(req.user._id, limit);
      response.success({ tests }, "Test history retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getStressTrends(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const days = parseInt(req.query.days) || 7;
      const trends = await psychologyService.getStressTrends(req.user._id, days);
      response.success({ trends }, "Stress trends retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Admin only - Get all users' psychology data
  async getAllUsersData(req, res, next) {
    const response = new ResponseHandler(res);
    const allowedRoles = ["admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return response.error(null, "Forbidden", 403);
    }

    try {
      const { PsychologyTest } = await import("../models/PsychologyTest.js");
      const tests = await PsychologyTest.find()
        .populate("user", "name email")
        .sort({ date: -1 })
        .limit(100);

      response.success({ tests }, "All users psychology data retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}
