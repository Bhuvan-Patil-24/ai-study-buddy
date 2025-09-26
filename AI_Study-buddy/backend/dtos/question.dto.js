export class CreateQuestionDto {
    constructor({ questionText, options, correctAnswer, timeLimit, questionType, order }) {
      this.questionText = questionText;
      this.options = options;
      this.correctAnswer = correctAnswer;
      this.timeLimit = timeLimit; // in seconds
      this.questionType = questionType;
      this.order = order;
    }
  
    validate() {
      if (!this.questionText || !this.options || this.correctAnswer === undefined || this.order === undefined) {
        throw new Error("Question text, options, correct answer, and order are required.");
      }
      if (!Array.isArray(this.options) || this.options.length < 2) {
        throw new Error("Options must be an array with at least two choices.");
      }
      if (this.questionType && !["single_choice", "multiple_choice", "true_false", "text_input"].includes(this.questionType)) {
        throw new Error("Invalid question type.");
      }
      if (this.timeLimit !== undefined && this.timeLimit !== null && (typeof this.timeLimit !== 'number' || this.timeLimit < 5)) {
          throw new Error("Question time limit must be a number greater than 4 seconds, or null.");
      }
      if (typeof this.order !== 'number' || this.order < 1) {
          throw new Error("Question order must be a number greater than or equal to 1.");
      }
  
      // Specific validation for correctAnswer based on questionType
      if (this.questionType === "single_choice" || this.questionType === "true_false" || this.questionType === undefined) {
        if (!this.options.includes(this.correctAnswer)) {
          throw new Error("Correct answer must be one of the provided options for single choice/true false questions.");
        }
      } else if (this.questionType === "multiple_choice") {
        if (!Array.isArray(this.correctAnswer) || this.correctAnswer.length === 0) {
          throw new Error("Correct answer for multiple choice must be a non-empty array of options.");
        }
        for (const ans of this.correctAnswer) {
          if (!this.options.includes(ans)) {
            throw new Error("All correct answers for multiple choice must be among the provided options.");
          }
        }
      }
      // For 'text_input', correctAnswer can be any string, no need to check against options
    }
  }
  
  export class UpdateQuestionDto {
    constructor({ questionText, options, correctAnswer, timeLimit, questionType, order }) {
      this.questionText = questionText;
      this.options = options;
      this.correctAnswer = correctAnswer;
      this.timeLimit = timeLimit;
      this.questionType = questionType;
      this.order = order;
    }
  
    validate() {
      if (this.options !== undefined && (!Array.isArray(this.options) || this.options.length < 2)) {
        throw new Error("Options must be an array with at least two choices.");
      }
      if (this.questionType && !["single_choice", "multiple_choice", "true_false", "text_input"].includes(this.questionType)) {
        throw new Error("Invalid question type.");
      }
      if (this.timeLimit !== undefined && this.timeLimit !== null && (typeof this.timeLimit !== 'number' || this.timeLimit < 5)) {
          throw new Error("Question time limit must be a number greater than 4 seconds, or null.");
      }
      if (this.order !== undefined && (typeof this.order !== 'number' || this.order < 1)) {
          throw new Error("Question order must be a number greater than or equal to 1.");
      }
    }
  }