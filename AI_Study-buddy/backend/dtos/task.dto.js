export class CreateTaskDto {
  constructor({ title, description, assignedTo, priority, dueDate }) {
    this.title = title;
    this.description = description;
    this.assignedTo = assignedTo || [];
    this.priority = priority || "medium";
    this.dueDate = dueDate;
  }

  validate() {
    if (!this.title || !this.description) {
      throw new Error("Title and description are required");
    }
    if (!Array.isArray(this.assignedTo) || this.assignedTo.length === 0) {
      throw new Error("At least one assignee is required");
    }
    if (!["low", "medium", "high"].includes(this.priority)) {
      throw new Error("Invalid priority level");
    }
  }
}
