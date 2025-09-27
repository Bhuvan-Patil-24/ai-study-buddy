import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  }

  async generateStudyRoomSummary(messages) {
    try {
      const prompt = `
        Analyze the following study room conversation and generate a concise summary of the key discussion points, questions asked, and answers provided. 
        Focus on educational content and learning outcomes.
        
        Messages: ${JSON.stringify(messages)}
        
        Provide a summary in 2-3 sentences that captures the main learning points.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating study room summary:", error);
      return "Unable to generate summary at this time.";
    }
  }

  async generateNoteSummary(content, contentType) {
    try {
      let prompt = "";
      
      if (contentType === "youtube") {
        prompt = `
          Analyze this YouTube video content and generate:
          1. A comprehensive summary (2-3 paragraphs)
          2. Key learning points (bullet points)
          3. Important concepts covered
          
          Content: ${content}
        `;
      } else {
        prompt = `
          Analyze this study material and generate:
          1. A comprehensive summary (2-3 paragraphs)
          2. Key learning points (bullet points)
          3. Important concepts covered
          
          Content: ${content}
        `;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating note summary:", error);
      return "Unable to generate summary at this time.";
    }
  }

  async generateFlashcards(content, subject) {
    try {
      const prompt = `
        Generate 5-8 flashcards based on the following study material. 
        Return ONLY a JSON array with this exact format:
        [
          {"question": "Question text", "answer": "Answer text"},
          {"question": "Question text", "answer": "Answer text"}
        ]
        
        Subject: ${subject}
        Content: ${content}
        
        Make questions and answers concise but comprehensive.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return [
        {"question": "What is the main topic?", "answer": "Please try again with more specific content."}
      ];
    } catch (error) {
      console.error("Error generating flashcards:", error);
      return [
        {"question": "Error generating flashcards", "answer": "Please try again later."}
      ];
    }
  }

  async generateQuiz(content, subject) {
    try {
      const prompt = `
        Generate 3-5 multiple choice questions based on the following study material.
        Return ONLY a JSON array with this exact format:
        [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": 0
          }
        ]
        
        Subject: ${subject}
        Content: ${content}
        
        Make questions challenging but fair, with 4 options each.
        The answer should be the index (0-3) of the correct option.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return [
        {
          "question": "What is the main topic?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": 0
        }
      ];
    } catch (error) {
      console.error("Error generating quiz:", error);
      return [
        {
          "question": "Error generating quiz",
          "options": ["Please try again", "Later", "With different content", "Contact support"],
          "answer": 0
        }
      ];
    }
  }

  async generateMotivationalMessage(stressLevel, userProgress) {
    try {
      const prompt = `
        Generate a personalized motivational message for a student based on their stress level and progress.
        
        Stress Level: ${stressLevel}
        Recent Progress: ${userProgress}
        
        Make it encouraging, specific to their situation, and 1-2 sentences long.
        Be supportive and motivating.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating motivational message:", error);
      return "Keep up the great work! You're making excellent progress! 🌟";
    }
  }

  async analyzeStressLevel(responses) {
    try {
      const prompt = `
        Analyze these stress level responses and determine the student's overall stress level.
        Return ONLY a JSON object with this format:
        {"level": "low|moderate|high", "recommendations": ["rec1", "rec2", "rec3"]}
        
        Responses: ${JSON.stringify(responses)}
        
        Consider factors like focus hours, fatigue level, and stress indicators.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        level: "moderate",
        recommendations: ["Take regular breaks", "Maintain a study schedule", "Get adequate sleep"]
      };
    } catch (error) {
      console.error("Error analyzing stress level:", error);
      return {
        level: "moderate",
        recommendations: ["Take regular breaks", "Maintain a study schedule", "Get adequate sleep"]
      };
    }
  }
}

export const aiService = new AIService();
