export class PsychologyTestDto {
  constructor({
    energy,
    motivation,
    sleep,
    appetite,
    sadness,
    enjoyment,
    focus,
    restlessness,
    guilt,
    lifeWorth,
  }) {
    this.energy = energy;
    this.motivation = motivation;
    this.sleep = sleep;
    this.appetite = appetite;
    this.sadness = sadness;
    this.enjoyment = enjoyment;
    this.focus = focus;
    this.restlessness = restlessness;
    this.guilt = guilt;
    this.lifeWorth = lifeWorth;
  }

  validate() {
    const validOptions = ["A", "B", "C", "D"];
    const fields = [
      "energy",
      "motivation", 
      "sleep",
      "appetite",
      "sadness",
      "enjoyment",
      "focus",
      "restlessness",
      "guilt",
      "lifeWorth"
    ];

    for (const field of fields) {
      if (!this[field]) {
        throw new Error(`${field} is required.`);
      }
      if (!validOptions.includes(this[field])) {
        throw new Error(`${field} must be one of: A, B, C, D`);
      }
    }
  }
}
