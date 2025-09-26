import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import ResponseHandler from "../utils/apiResponse.js";

export class AuthMiddleware {
  async isAuthenticated(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return response.error(null, "Token missing", 401);
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.userID).select("-password");
      if (!user) {
        return response.error(null, "User not found", 404);
      }

      req.user = user;
      next();
    } catch (err) {
      return response.error(null, err.message || "Authentication failed", 401);
    }
  }

  isSuperAdmin(req, res, next) {
    const response = new ResponseHandler(res);
    if (req.user?.role !== "superadmin") {
      return response.error(null, "Super Admin access only", 403);
    }
    next();
  }

  isAdmin(req, res, next) {
    const response = new ResponseHandler(res);
    if (req.user?.role !== "admin") {
      return response.error(null, "Admin access only", 403);
    }
    next();
  }

  checkRole(allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return response.error(null, "Forbidden: Insufficient role", 403);
      }
      next();
    };
  }
}
