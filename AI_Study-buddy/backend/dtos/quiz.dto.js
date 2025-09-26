export class CreateQuizDto {
  constructor({ title, description, globalTimeLimit, assignedTo, isActive }) {
    this.title = title;
    this.description = description;
    this.globalTimeLimit = globalTimeLimit; // in minutes
    this.assignedTo = assignedTo; // Array of user IDs
    this.isActive = isActive;
  }

  validate() {
    if (!this.title) {
      throw new Error("Quiz title is required.");
    }
    if (
      this.globalTimeLimit !== null &&
      this.globalTimeLimit !== undefined &&
      (typeof this.globalTimeLimit !== "number" || this.globalTimeLimit < 1)
    ) {
      throw new Error(
        "Global time limit must be a number greater than 0, or null."
      );
    }
    if (this.assignedTo && !Array.isArray(this.assignedTo)) {
      throw new Error("Assigned users must be an array of IDs.");
    }
  }
}

export class UpdateQuizDto {
  constructor({ title, description, globalTimeLimit, assignedTo, isActive }) {
    this.title = title;
    this.description = description;
    this.globalTimeLimit = globalTimeLimit;
    this.assignedTo = assignedTo;
    this.isActive = isActive;
  }

  validate() {
    if (
      this.globalTimeLimit !== undefined &&
      this.globalTimeLimit !== null &&
      (typeof this.globalTimeLimit !== "number" || this.globalTimeLimit < 1)
    ) {
      throw new Error(
        "Global time limit must be a number greater than 0, or null."
      );
    }
    if (this.assignedTo !== undefined && !Array.isArray(this.assignedTo)) {
      throw new Error("Assigned users must be an array of IDs.");
    }
  }
}

export class AssignUsersDto {
  constructor({ userIds }) {
    this.userIds = userIds;
  }

  validate() {
    if (
      !this.userIds ||
      !Array.isArray(this.userIds) ||
      this.userIds.length === 0
    ) {
      throw new Error("User IDs array is required for assignment.");
    }
  }
}
