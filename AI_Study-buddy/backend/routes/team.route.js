import express from "express";
import { TeamController } from "../controllers/team.controller.js";
import { CreateTeamDto, UpdateTeamDto } from "../dtos/team.dto.js";
import { validateDto } from "../middlewares/validateDto.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class TeamRoutes {
  constructor() {
    this.router = express.Router();
    this.teamController = new TeamController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create-team", 
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["admin", "superadmin"]),
      validateDto(CreateTeamDto),
      this.teamController.createTeam
    );

    this.router.get("/get-teams", 
      this.authMiddleware.isAuthenticated,
      this.teamController.getTeams
    );

    this.router.get("/get-team/:teamId", 
      this.authMiddleware.isAuthenticated,
      this.teamController.getTeam
    );

    this.router.put("/update-team/:teamId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["admin", "superadmin"]),
      validateDto(UpdateTeamDto),
      this.teamController.updateTeam
    );

    this.router.delete("/delete-team/:teamId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["admin", "superadmin"]),
      this.teamController.deleteTeam
    );
  }

  getRouter() {
    return this.router;
  }
}