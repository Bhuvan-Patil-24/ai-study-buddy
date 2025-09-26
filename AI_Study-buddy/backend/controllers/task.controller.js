import { taskService } from "../services/task.service.js";
import ResponseHandler from "../utils/apiResponse.js";

export class TaskController {
  async createTask(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await taskService.createTask(
        req.params.teamId,
        req.dto,
        req.user
      );
      response.success(result, "Task created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getTeamTasks(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const tasks = await taskService.getTeamTasks(req.params.teamId, req.user);
      response.success({ tasks }, "Team tasks fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMyTasks(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const tasks = await taskService.getMyTasks(req.user);
      response.success({ tasks }, "My tasks fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const task = await taskService.getTaskById(req.params.taskId, req.user);
      response.success({ task }, "Task fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await taskService.updateTaskStatus(
        req.params.taskId,
        req.body.status,
        req.user
      );
      response.success({ task: result }, "Task status updated successfully");
    } catch (error) {
      next(error);
    }
  }
}
