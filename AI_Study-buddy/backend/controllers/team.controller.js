import { teamService } from "../services/team.service.js";
import ResponseHandler from "../utils/apiResponse.js";

export class TeamController {
  async createTeam(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await teamService.createTeam(req.dto, req.user._id);
      response.success(result, "Team created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getTeams(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const teams = await teamService.getAllTeams(req.user);
      response.success({ teams }, "Teams fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getTeam(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const team = await teamService.getTeamById(req.params.teamId, req.user);
      response.success({ team }, "Team fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await teamService.updateTeam(
        req.params.teamId,
        req.dto,
        req.user
      );
      response.success(result, "Team updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await teamService.deleteTeam(req.params.teamId, req.user);
      response.success(result, "Team deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
