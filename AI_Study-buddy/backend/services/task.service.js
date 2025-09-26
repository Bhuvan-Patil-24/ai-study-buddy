import { Task } from "../models/Task.js";
import { Team } from "../models/Team.js";

export class TaskService {
  async createTask(teamId, dto, assignedBy) {
    const team = await Team.findById(teamId).populate("members");
    if (!team) {
      throw new Error("Team not found");
    }

    // Check if user can assign tasks to this team
    const canAssign =
      ["admin", "superadmin"].includes(assignedBy.role) ||
      team.members.some((member) => member._id.equals(assignedBy._id));

    if (!canAssign) {
      throw new Error("Cannot assign tasks to this team");
    }

    // Verify assigned users are team members
    const teamMemberIds = team.members.map((m) => m._id.toString());
    const invalidAssignees = dto.assignedTo.filter(
      (id) => !teamMemberIds.includes(id)
    );

    if (invalidAssignees.length > 0) {
      throw new Error("Some assignees are not team members");
    }

    const task = await Task.create({
      title: dto.title,
      description: dto.description,
      team: teamId,
      assignedBy: assignedBy._id,
      assignedTo: dto.assignedTo,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });

    return await Task.findById(task._id)
      .populate("team", "name")
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email role");
  }

  async getTeamTasks(teamId, user) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Check access
    const hasAccess =
      ["admin", "superadmin"].includes(user.role) ||
      team.members.includes(user._id);

    if (!hasAccess) {
      throw new Error("Access denied");
    }

    return await Task.find({ team: teamId })
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email role")
      .populate("team", "name")
      .sort({ createdAt: -1 });
  }

  async getMyTasks(user) {
    return await Task.find({ assignedTo: user._id })
      .populate("assignedBy", "name email")
      .populate("team", "name")
      .sort({ createdAt: -1 });
  }

  async updateTaskStatus(taskId, status, user) {
    const task = await Task.findById(taskId).populate("team");
    if (!task) {
      throw new Error("Task not found");
    }

    // Check if user can update this task
    const canUpdate =
      task.assignedTo.includes(user._id) ||
      ["admin", "superadmin"].includes(user.role);

    if (!canUpdate) {
      throw new Error("Cannot update this task");
    }

    task.status = status;
    await task.save();

    return await Task.findById(task._id)
      .populate("team", "name")
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email role");
  }

  async getTaskById(taskId, user) {
    const task = await Task.findById(taskId)
      .populate("team", "name")
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email role");

    if (!task) {
      throw new Error("Task not found");
    }

    // Check access
    const hasAccess =
      task.assignedTo.includes(user._id) ||
      task.assignedBy.equals(user._id) ||
      ["admin", "superadmin"].includes(user.role);

    if (!hasAccess) {
      throw new Error("Access denied");
    }

    return task;
  }
}

export const taskService = new TaskService();
