// Quest Data and Management System

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'health' | 'wealth' | 'insurance';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  totalPoints: number;
  timeLimit: number; // in seconds
  badge?: string;
  prerequisiteLevel: number;
}

// Health Quests
const healthQuests: Quest[] = [
  {
    id: 'health_cardio_basics',
    title: 'Cardio Fundamentals',
    description: 'Master the basics of cardiovascular exercise and understand how it benefits your heart, lungs, and overall wellness.',
    type: 'health',
    difficulty: 'easy',
    prerequisiteLevel: 1,
    timeLimit: 180, // 3 minutes
    totalPoints: 150,
    questions: [
      {
        id: 'q1',
        text: 'How many minutes of moderate cardio exercise does the WHO recommend per week for adults?',
        options: [
          '75 minutes',
          '150 minutes',
          '300 minutes',
          '60 minutes'
        ],
        correctAnswer: 1,
        explanation: 'The World Health Organization recommends at least 150 minutes of moderate-intensity aerobic activity throughout the week for adults.',
        points: 25
      },
      {
        id: 'q2',
        text: 'Which of these is NOT a benefit of regular cardiovascular exercise?',
        options: [
          'Improved heart health',
          'Better mood and mental health',
          'Decreased bone density',
          'Enhanced immune system'
        ],
        correctAnswer: 2,
        explanation: 'Regular cardio exercise actually INCREASES bone density, not decreases it. Weight-bearing cardio exercises help strengthen bones.',
        points: 30
      },
      {
        id: 'q3',
        text: 'What is the target heart rate zone for moderate-intensity exercise?',
        options: [
          '40-50% of maximum heart rate',
          '50-70% of maximum heart rate',
          '70-85% of maximum heart rate',
          '85-95% of maximum heart rate'
        ],
        correctAnswer: 1,
        explanation: 'Moderate-intensity exercise should be performed at 50-70% of your maximum heart rate for optimal cardiovascular benefits.',
        points: 35
      },
      {
        id: 'q4',
        text: 'Which cardio exercise burns the most calories per hour for an average person?',
        options: [
          'Walking at 3.5 mph',
          'Cycling at moderate pace',
          'Swimming laps',
          'Running at 8 mph'
        ],
        correctAnswer: 3,
        explanation: 'Running at 8 mph typically burns the most calories per hour, around 800-1000 calories depending on body weight.',
        points: 40
      },
      {
        id: 'q5',
        text: 'How long should you warm up before intense cardio exercise?',
        options: [
          '2-3 minutes',
          '5-10 minutes',
          '15-20 minutes',
          'No warm-up needed'
        ],
        correctAnswer: 1,
        explanation: 'A proper warm-up should last 5-10 minutes to gradually prepare your body for intense exercise and reduce injury risk.',
        points: 20
      }
    ]
  },
  {
    id: 'health_nutrition_basics',
    title: 'Nutrition Essentials',
    description: 'Learn the fundamentals of healthy eating, macronutrients, and how nutrition impacts your wellness journey.',
    type: 'health',
    difficulty: 'medium',
    prerequisiteLevel: 3,
    timeLimit: 240, // 4 minutes
    totalPoints: 200,
    questions: [
      {
        id: 'q1',
        text: 'What percentage of your daily calories should come from carbohydrates according to dietary guidelines?',
        options: [
          '20-30%',
          '45-65%',
          '70-80%',
          '10-20%'
        ],
        correctAnswer: 1,
        explanation: 'The recommended daily calorie intake from carbohydrates is 45-65% for optimal energy and brain function.',
        points: 40
      },
      {
        id: 'q2',
        text: 'Which vitamin is primarily obtained from sunlight exposure?',
        options: [
          'Vitamin A',
          'Vitamin C',
          'Vitamin D',
          'Vitamin B12'
        ],
        correctAnswer: 2,
        explanation: 'Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight, earning it the nickname "sunshine vitamin".',
        points: 35
      },
      {
        id: 'q3',
        text: 'How much water should an average adult consume per day?',
        options: [
          '4-6 glasses',
          '8-10 glasses',
          '12-14 glasses',
          '2-3 glasses'
        ],
        correctAnswer: 1,
        explanation: 'The general recommendation is 8-10 glasses (about 2-2.5 liters) of water per day, though needs vary by individual and activity level.',
        points: 30
      },
      {
        id: 'q4',
        text: 'Which macronutrient provides the most calories per gram?',
        options: [
          'Carbohydrates (4 cal/g)',
          'Protein (4 cal/g)',
          'Fat (9 cal/g)',
          'Alcohol (7 cal/g)'
        ],
        correctAnswer: 2,
        explanation: 'Fats provide 9 calories per gram, more than double the calories provided by carbohydrates and proteins (4 cal/g each).',
        points: 45
      },
      {
        id: 'q5',
        text: 'What is the recommended daily fiber intake for adults?',
        options: [
          '10-15 grams',
          '25-35 grams',
          '45-50 grams',
          '5-10 grams'
        ],
        correctAnswer: 1,
        explanation: 'Adults should consume 25-35 grams of fiber daily for optimal digestive health and disease prevention.',
        points: 50
      }
    ]
  }
];

// Wealth/Finance Quests
const wealthQuests: Quest[] = [
  {
    id: 'wealth_investment_basics',
    title: 'Investment 101',
    description: 'Learn the fundamentals of investing, from stocks and bonds to mutual funds and risk management.',
    type: 'wealth',
    difficulty: 'easy',
    prerequisiteLevel: 1,
    timeLimit: 300, // 5 minutes
    totalPoints: 175,
    questions: [
      {
        id: 'q1',
        text: 'What does "diversification" mean in investment terms?',
        options: [
          'Putting all money in one stock',
          'Spreading investments across different assets',
          'Only investing in government bonds',
          'Buying and selling stocks quickly'
        ],
        correctAnswer: 1,
        explanation: 'Diversification means spreading your investments across different types of assets to reduce risk and potential losses.',
        points: 30
      },
      {
        id: 'q2',
        text: 'What is compound interest?',
        options: [
          'Interest paid only on the principal amount',
          'Interest paid on both principal and previously earned interest',
          'A type of bank fee',
          'Interest that decreases over time'
        ],
        correctAnswer: 1,
        explanation: 'Compound interest is when you earn interest not only on your initial investment but also on the interest that has already been earned.',
        points: 35
      },
      {
        id: 'q3',
        text: 'Which investment typically offers higher returns but also higher risk?',
        options: [
          'Government bonds',
          'Bank savings accounts',
          'Stocks/Equities',
          'Fixed deposits'
        ],
        correctAnswer: 2,
        explanation: 'Stocks generally offer higher potential returns than bonds or savings accounts, but they also come with higher risk and volatility.',
        points: 40
      },
      {
        id: 'q4',
        text: 'What is the general rule for emergency fund savings?',
        options: [
          '1-2 months of expenses',
          '3-6 months of expenses',
          '12 months of expenses',
          'Emergency funds are unnecessary'
        ],
        correctAnswer: 1,
        explanation: 'Financial experts recommend keeping 3-6 months worth of living expenses in an easily accessible emergency fund.',
        points: 35
      },
      {
        id: 'q5',
        text: 'What does P/E ratio stand for in stock analysis?',
        options: [
          'Profit/Expense ratio',
          'Price/Earnings ratio',
          'Performance/Efficiency ratio',
          'Principal/Equity ratio'
        ],
        correctAnswer: 1,
        explanation: 'P/E (Price-to-Earnings) ratio compares a company\'s stock price to its earnings per share, helping evaluate if a stock is overvalued or undervalued.',
        points: 35
      }
    ]
  },
  {
    id: 'wealth_ulip_myths',
    title: 'ULIP Myths Busted',
    description: 'Separate fact from fiction about Unit Linked Insurance Plans and make informed financial decisions.',
    type: 'wealth',
    difficulty: 'medium',
    prerequisiteLevel: 5,
    timeLimit: 360, // 6 minutes
    totalPoints: 250,
    questions: [
      {
        id: 'q1',
        text: 'What is the lock-in period for ULIP investments in India?',
        options: [
          '3 years',
          '5 years',
          '7 years',
          '10 years'
        ],
        correctAnswer: 1,
        explanation: 'ULIPs have a mandatory lock-in period of 5 years, during which you cannot withdraw your investment without penalties.',
        points: 45
      },
      {
        id: 'q2',
        text: 'Which is a common myth about ULIPs?',
        options: [
          'ULIPs provide both insurance and investment',
          'ULIPs have high charges compared to mutual funds',
          'ULIPs guarantee high returns',
          'ULIPs offer tax benefits'
        ],
        correctAnswer: 2,
        explanation: 'MYTH: ULIPs do NOT guarantee high returns. Returns depend on market performance and fund management, just like other market-linked investments.',
        points: 50
      },
      {
        id: 'q3',
        text: 'After the lock-in period, how many free withdrawals are typically allowed per year?',
        options: [
          'Unlimited withdrawals',
          '4 free withdrawals',
          'No withdrawals allowed',
          '12 free withdrawals'
        ],
        correctAnswer: 1,
        explanation: 'Most ULIPs allow 4 free partial withdrawals per year after the lock-in period. Additional withdrawals may incur charges.',
        points: 40
      },
      {
        id: 'q4',
        text: 'What happens to the insurance coverage if you stop paying ULIP premiums after 3 years?',
        options: [
          'Insurance continues for life',
          'Insurance coverage stops immediately',
          'Coverage continues until the lock-in period ends',
          'Coverage reduces to zero gradually'
        ],
        correctAnswer: 1,
        explanation: 'If you stop paying premiums after 3 years but within the lock-in period, your policy becomes a discontinued policy but insurance coverage typically continues until the lock-in period ends.',
        points: 55
      },
      {
        id: 'q5',
        text: 'Which charge is typically the highest in the initial years of a ULIP?',
        options: [
          'Fund management charge',
          'Premium allocation charge',
          'Mortality charge',
          'Administrative charge'
        ],
        correctAnswer: 1,
        explanation: 'Premium allocation charges are typically highest in the initial years, often taking a significant portion of your premium in the first few years.',
        points: 60
      }
    ]
  }
];

// Insurance Quests
const insuranceQuests: Quest[] = [
  {
    id: 'insurance_policy_basics',
    title: 'Insurance Policy Fundamentals',
    description: 'Master the basics of insurance policies, coverage types, and how to choose the right protection for your needs.',
    type: 'insurance',
    difficulty: 'easy',
    prerequisiteLevel: 2,
    timeLimit: 270, // 4.5 minutes
    totalPoints: 160,
    questions: [
      {
        id: 'q1',
        text: 'What is a deductible in insurance terms?',
        options: [
          'The maximum amount insurance will pay',
          'The amount you pay before insurance covers costs',
          'The monthly insurance premium',
          'A type of insurance policy'
        ],
        correctAnswer: 1,
        explanation: 'A deductible is the amount you must pay out-of-pocket before your insurance coverage kicks in to pay for covered expenses.',
        points: 30
      },
      {
        id: 'q2',
        text: 'What does "sum assured" mean in life insurance?',
        options: [
          'The premium you pay annually',
          'The amount paid to beneficiaries upon death',
          'The cash value of the policy',
          'The number of years the policy is valid'
        ],
        correctAnswer: 1,
        explanation: 'Sum assured is the guaranteed amount that will be paid to your beneficiaries in case of your death during the policy term.',
        points: 35
      },
      {
        id: 'q3',
        text: 'Which factor does NOT typically affect life insurance premiums?',
        options: [
          'Age',
          'Health condition',
          'Smoking habits',
          'Favorite color'
        ],
        correctAnswer: 3,
        explanation: 'Life insurance premiums are based on risk factors like age, health, lifestyle habits, and occupation - not personal preferences like favorite color.',
        points: 25
      },
      {
        id: 'q4',
        text: 'What is the grace period in insurance?',
        options: [
          'Time to file a claim',
          'Period to pay overdue premiums without policy lapse',
          'Waiting period before coverage begins',
          'Time to change beneficiaries'
        ],
        correctAnswer: 1,
        explanation: 'Grace period is the time (usually 30 days) after a premium due date during which you can pay the premium without the policy lapsing.',
        points: 40
      },
      {
        id: 'q5',
        text: 'What is the difference between term insurance and whole life insurance?',
        options: [
          'Term is permanent, whole life is temporary',
          'Term covers specific period, whole life covers entire lifetime',
          'No difference, they are the same',
          'Term is more expensive than whole life'
        ],
        correctAnswer: 1,
        explanation: 'Term insurance provides coverage for a specific period (term), while whole life insurance provides coverage for your entire lifetime.',
        points: 30
      }
    ]
  },
  {
    id: 'insurance_health_coverage',
    title: 'Health Insurance Mastery',
    description: 'Understand health insurance coverage, claim processes, and how to maximize your healthcare benefits.',
    type: 'insurance',
    difficulty: 'medium',
    prerequisiteLevel: 4,
    timeLimit: 300, // 5 minutes
    totalPoints: 220,
    questions: [
      {
        id: 'q1',
        text: 'What is a pre-existing condition in health insurance?',
        options: [
          'A condition that develops after buying insurance',
          'A medical condition you have before getting insurance',
          'A condition covered immediately',
          'A condition that never gets covered'
        ],
        correctAnswer: 1,
        explanation: 'A pre-existing condition is any health problem you have before purchasing your health insurance policy.',
        points: 40
      },
      {
        id: 'q2',
        text: 'What is the typical waiting period for pre-existing conditions in health insurance?',
        options: [
          '6 months',
          '1 year',
          '2-4 years',
          'No waiting period'
        ],
        correctAnswer: 2,
        explanation: 'Most health insurance policies have a waiting period of 2-4 years for pre-existing conditions before they are covered.',
        points: 45
      },
      {
        id: 'q3',
        text: 'What does "cashless treatment" mean?',
        options: [
          'Treatment is completely free',
          'You pay later with interest',
          'Insurance company pays hospital directly',
          'You get cash back after treatment'
        ],
        correctAnswer: 2,
        explanation: 'Cashless treatment means the insurance company settles the bill directly with the hospital, so you don\'t need to pay upfront.',
        points: 40
      },
      {
        id: 'q4',
        text: 'What is co-payment in health insurance?',
        options: [
          'Payment made by a co-worker',
          'Percentage of claim amount you must pay',
          'Payment made to multiple doctors',
          'Full payment of the premium'
        ],
        correctAnswer: 1,
        explanation: 'Co-payment is a percentage of the claim amount that you must bear from your own pocket, while insurance covers the rest.',
        points: 50
      },
      {
        id: 'q5',
        text: 'Which is typically NOT covered under standard health insurance?',
        options: [
          'Hospitalization expenses',
          'Cosmetic surgery for beauty',
          'Emergency ambulance costs',
          'Pre and post hospitalization expenses'
        ],
        correctAnswer: 1,
        explanation: 'Cosmetic or plastic surgery done purely for aesthetic reasons is typically excluded from standard health insurance coverage.',
        points: 45
      }
    ]
  }
];

// Quest Management Functions
export class QuestManager {
  private static allQuests: Quest[] = [...healthQuests, ...wealthQuests, ...insuranceQuests];

  static getAllQuests(): Quest[] {
    return this.allQuests;
  }

  static getQuestById(id: string): Quest | null {
    return this.allQuests.find(quest => quest.id === id) || null;
  }

  static getQuestsByType(type: 'health' | 'wealth' | 'insurance'): Quest[] {
    return this.allQuests.filter(quest => quest.type === type);
  }

  static getQuestsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Quest[] {
    return this.allQuests.filter(quest => quest.difficulty === difficulty);
  }

  static getAvailableQuests(userLevel: number): Quest[] {
    return this.allQuests.filter(quest => quest.prerequisiteLevel <= userLevel);
  }

  static getRandomQuest(type?: 'health' | 'wealth' | 'insurance', userLevel: number = 1): Quest | null {
    let availableQuests = this.getAvailableQuests(userLevel);
    
    if (type) {
      availableQuests = availableQuests.filter(quest => quest.type === type);
    }
    
    if (availableQuests.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableQuests.length);
    return availableQuests[randomIndex];
  }

  static calculateQuestReward(quest: Quest, score: number, timeRemaining: number, userLevel: number): number {
    const basePoints = quest.totalPoints * (score / 100);
    const timeBonus = Math.floor((timeRemaining / quest.timeLimit) * 50);
    const difficultyMultiplier = quest.difficulty === 'hard' ? 2 : quest.difficulty === 'medium' ? 1.5 : 1;
    const levelBonus = Math.floor(userLevel * 5);
    
    return Math.floor((basePoints + timeBonus + levelBonus) * difficultyMultiplier);
  }

  static getQuestBadge(_quest: Quest, score: number): string {
    if (score >= 90) return '🏆 Master';
    if (score >= 80) return '🥇 Expert';
    if (score >= 70) return '🥈 Proficient';
    if (score >= 60) return '🥉 Competent';
    return '📚 Learner';
  }
}

export default QuestManager;