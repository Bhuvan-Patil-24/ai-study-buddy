import { Team } from "../models/Team.js";
import { User } from "../models/User.js";

export class TeamService {
  async createTeam(dto, createdBy) {
    // Verify all members exist and have valid roles
    const members = await User.find({
      _id: { $in: dto.memberIds },
      role: { $in: ["admin", "employee", "intern"] },
    });

    if (members.length !== dto.memberIds.length) {
      throw new Error("Some users not found or have invalid roles");
    }

    const team = await Team.create({
      name: dto.name,
      description: dto.description,
      createdBy: createdBy,
      members: dto.memberIds,
    });

    return await Team.findById(team._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");
  }

  async getAllTeams(user) {
    let query = { isActive: true };

    // Non-admins can only see teams they're part of
    if (!["admin", "superadmin"].includes(user.role)) {
      query.members = user._id;
    }

    return await Team.find(query)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });
  }

  async getTeamById(teamId, user) {
    const team = await Team.findById(teamId)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!team) {
      throw new Error("Team not found");
    }

    // Check access
    const hasAccess =
      ["admin", "superadmin"].includes(user.role) ||
      team.members.some((member) => member._id.equals(user._id));

    if (!hasAccess) {
      throw new Error("Access denied");
    }

    return team;
  }

  async updateTeam(teamId, dto, user) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Only creator or admin can update
    if (
      !team.createdBy.equals(user._id) &&
      !["admin", "superadmin"].includes(user.role)
    ) {
      throw new Error("Permission denied");
    }

    if (dto.memberIds) {
      const members = await User.find({
        _id: { $in: dto.memberIds },
        role: { $in: ["admin", "employee", "intern"] },
      });

      if (members.length !== dto.memberIds.length) {
        throw new Error("Some users not found or have invalid roles");
      }
      team.members = dto.memberIds;
    }

    if (dto.name) team.name = dto.name;
    if (dto.description !== undefined) team.description = dto.description;

    await team.save();

    return await Team.findById(team._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");
  }

  async deleteTeam(teamId, user) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Only creator or admin can delete
    if (
      !team.createdBy.equals(user._id) &&
      !["admin", "superadmin"].includes(user.role)
    ) {
      throw new Error("Permission denied");
    }

    team.isActive = false;
    await team.save();

    return { message: "Team deleted successfully" };
  }
}

export const teamService = new TeamService();
