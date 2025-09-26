export class CreateTeamDto {
  constructor({ name, description, memberIds }) {
    this.name = name;
    this.description = description;
    this.memberIds = memberIds || [];
  }

  validate() {
    if (!this.name) {
      throw new Error("Team name is required");
    }
    if (!Array.isArray(this.memberIds) || this.memberIds.length === 0) {
      throw new Error("At least one team member is required");
    }
  }
}

export class UpdateTeamDto {
  constructor({ name, description, memberIds }) {
    this.name = name;
    this.description = description;
    this.memberIds = memberIds;
  }

  validate() {
    if (
      this.memberIds &&
      (!Array.isArray(this.memberIds) || this.memberIds.length === 0)
    ) {
      throw new Error("At least one team member is required");
    }
  }
}
