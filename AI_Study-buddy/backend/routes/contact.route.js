import express from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { validateDto } from "../middlewares/validateDto.js";
import { ContactDTO } from "../dtos/contact.dto.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class ContactRoutes {
  constructor() {
    this.router = express.Router();
    this.contactController = new ContactController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/add",
      validateDto(ContactDTO),
      this.contactController.createContact
    );

    this.router.get(
      "/get",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.isAdmin,
      this.contactController.getContacts
    );
  }

  getRouter() {
    return this.router;
  }
}
