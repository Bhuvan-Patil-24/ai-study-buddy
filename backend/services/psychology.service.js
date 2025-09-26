import { PsychologyTest } from "../models/PsychologyTest.js";

export class PsychologyService {
  // Calculate stress level based on responses
  calculateStressLevel(responses) {
    const scores = {
      A: 0, // Best
      B: 1, // Good
      C: 2, // Concerning
      D: 3  // Severe
    };

    let totalScore = 0;
    Object.values(responses).forEach(response => {
      totalScore += scores[response];
    });

    if (totalScore <= 5) return { level: "low", score: totalScore };
    if (totalScore <= 15) return { level: "moderate", score: totalScore };
    if (totalScore <= 25) return { level: "high", score: totalScore };
    return { level: "severe", score: totalScore };
  }

  // Get recommendations based on stress level
  getRecommendations(stressLevel) {
    const recommendations = {
      low: [
        "Keep up the great work!",
        "Maintain your current routine",
        "Continue practicing self-care"
      ],
      moderate: [
        "Take regular breaks during study",
        "Practice deep breathing exercises",
        "Ensure you're getting enough sleep",
        "Try light physical activity"
      ],
      high: [
        "Consider reducing study intensity",
        "Practice mindfulness or meditation",
        "Talk to friends or family",
        "Take a day off if possible",
        "Consider professional counseling"
      ],
      severe: [
        "Please seek professional help immediately",
        "Contact a mental health professional",
        "Reach out to support groups",
        "Consider taking a break from studies",
        "Emergency helpline: 988 (if in US)"
      ]
    };

    return recommendations[stressLevel] || recommendations.moderate;
  }

  // Get motivational quote based on stress level
  getMotivationalQuote(stressLevel) {
    const quotes = {
      low: [
        "You're doing amazing! Keep up the excellent work! 🌟",
        "Your positive energy is inspiring! Continue shining! ✨",
        "Great job maintaining your well-being! You've got this! 💪",
        "Your dedication and balance are truly admirable! 🎯"
      ],
      moderate: [
        "It's okay to have ups and downs. You're stronger than you think! 💪",
        "Every small step forward is progress. Keep going! 🚀",
        "Remember to be kind to yourself. You're doing your best! 💙",
        "Challenges make us stronger. You've overcome them before! 🌈"
      ],
      high: [
        "It's okay to ask for help. You don't have to face this alone. 🤝",
        "Taking care of yourself is not selfish—it's necessary. 💚",
        "This feeling is temporary. Brighter days are ahead. ☀️",
        "You are valued and important. Don't forget that. 💝"
      ],
      severe: [
        "You are not alone in this. Help is available and you deserve it. 🤗",
        "Your life has value and meaning. Please reach out for support. 💙",
        "It's okay to not be okay. Professional help can make a difference. 🆘",
        "You matter. Your feelings are valid. Please seek help. 💜"
      ]
    };

    const levelQuotes = quotes[stressLevel] || quotes.moderate;
    return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
  }

  // Submit psychology test
  async submitTest(userId, dto) {
    // Check if user already took test today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingTest = await PsychologyTest.findOne({
      user: userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingTest) {
      throw new Error("You have already taken the psychology test today");
    }

    // Calculate stress level and score
    const { level: stressLevel, score } = this.calculateStressLevel(dto);
    const recommendations = this.getRecommendations(stressLevel);
    const motivationalQuote = this.getMotivationalQuote(stressLevel);

    // Create new test record
    const psychologyTest = await PsychologyTest.create({
      user: userId,
      responses: dto,
      stressLevel,
      score,
      recommendations,
      motivationalQuote,
    });

    return {
      test: psychologyTest,
      stressLevel,
      score,
      recommendations,
      motivationalQuote,
    };
  }

  // Get user's test history
  async getUserTestHistory(userId, limit = 30) {
    const tests = await PsychologyTest.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit)
      .select("-__v");

    return tests;
  }

  // Get today's test status
  async getTodayTestStatus(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTest = await PsychologyTest.findOne({
      user: userId,
      date: { $gte: today, $lt: tomorrow }
    });

    return {
      hasTakenToday: !!todayTest,
      test: todayTest,
    };
  }

  // Get stress level trends
  async getStressTrends(userId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const tests = await PsychologyTest.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    return tests.map(test => ({
      date: test.date,
      stressLevel: test.stressLevel,
      score: test.score,
    }));
  }
}

export const psychologyService = new PsychologyService();
