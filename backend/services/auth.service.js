// services/auth.service.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export class AuthService {
  async register(dto) {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || 'student',
    });

    return this._generateToken(user);
  }

  async login(dto) {
    const user = await User.findOne({ email: dto.email }).select("+password");
    if (!user) throw new Error("User is not register");

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return this._generateToken(user);
  }

  async logout(user) {
    return { message: "Logout successful" };
  }

  async verify(user) {
    if (user) {
      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }

    if (!user) {
      return {
        user: { message: "User not verified" },
      };
    }
  }

  async getAllUsers() {
    return await User.find({}, "name email role createdAt updatedAt").sort({
      createdAt: -1,
    });
  }

  _generateToken(user) {
    const payload = { userID: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export const authService = new AuthService();
