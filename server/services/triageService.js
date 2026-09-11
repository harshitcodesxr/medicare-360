// AI Triage Service - Local deterministic engine
// No external API dependency

class TriageService {
  // Emergency keywords that indicate CRITICAL priority
  static CRITICAL_KEYWORDS = [
    'severe',
    'unable to breathe',
    'chest pain',
    'unconscious',
    'stroke',
    'severe bleeding',
    'severe pain',
    'loss of consciousness',
    'difficulty breathing',
    'collapsed',
    'severe allergy',
    'anaphylaxis'
  ];

  static MEDIUM_KEYWORDS = [
    'moderate',
    'persistent',
    'continuous',
    'severe headache',
    'dizziness',
    'fainting',
    'fracture',
    'severe vomiting'
  ];

  /**
   * Calculate AI Triage Result
   * Returns: { priority, riskScore, reason, emergencyKeywords }
   */
  static calculateTriage(triageData) {
    let riskScore = 0;
    let emergencyKeywords = [];

    // 1. SYMPTOM ANALYSIS (40% weight)
    const symptomSeverity = this.analyzeSymptoms(
      triageData.symptoms,
      triageData.mainSymptom,
      emergencyKeywords
    );
    riskScore += symptomSeverity * 0.4;

    // 2. VITALS ANALYSIS (40% weight)
    const vitalsSeverity = this.analyzeVitals(
      triageData.temperature,
      triageData.heartRate,
      triageData.bloodPressureSystolic,
      triageData.bloodPressureDiastolic,
      triageData.oxygenSaturation,
      emergencyKeywords
    );
    riskScore += vitalsSeverity * 0.4;

    // 3. EMERGENCY FLAGS (20% weight)
    const emergencyScore = this.checkEmergencyFlags(
      triageData,
      emergencyKeywords
    );
    riskScore += emergencyScore * 0.2;

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);
    riskScore = Math.max(riskScore, 0);
    riskScore = Math.round(riskScore);

    // Determine priority based on risk score
    let priority = 'NORMAL';
    let reason = '';

    if (riskScore >= 75) {
      priority = 'CRITICAL';
      reason = 'Symptoms indicate potentially serious medical urgency and require immediate professional evaluation.';
    } else if (riskScore >= 50) {
      priority = 'MEDIUM';
      reason = 'Symptoms suggest moderate medical concern and require timely professional evaluation.';
    } else {
      priority = 'NORMAL';
      reason = 'Symptoms appear stable. Routine consultation recommended.';
    }

    return {
      priority,
      riskScore,
      reason,
      emergencyKeywords: [...new Set(emergencyKeywords)]
    };
  }

  /**
   * Analyze symptoms for severity
   */
  static analyzeSymptoms(symptoms, mainSymptom, emergencyKeywords) {
    let score = 0;
    const allSymptoms = (symptoms || []).concat([mainSymptom]).filter(Boolean);

    allSymptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase();

      // Check for critical keywords
      for (let keyword of this.CRITICAL_KEYWORDS) {
        if (lowerSymptom.includes(keyword)) {
          score += 25;
          emergencyKeywords.push(keyword);
        }
      }

      // Check for medium keywords
      for (let keyword of this.MEDIUM_KEYWORDS) {
        if (lowerSymptom.includes(keyword)) {
          score += 12;
          if (!emergencyKeywords.includes(keyword)) {
            emergencyKeywords.push(keyword);
          }
        }
      }
    });

    return Math.min(score, 100);
  }

  /**
   * Analyze vital signs for severity
   */
  static analyzeVitals(
    temperature,
    heartRate,
    bpSystolic,
    bpDiastolic,
    oxygenSaturation,
    emergencyKeywords
  ) {
    let score = 0;

    // Temperature analysis
    if (temperature) {
      if (temperature > 104 || temperature < 95) {
        score += 30;
        emergencyKeywords.push('Critical Temperature');
      } else if (temperature > 101 || temperature < 96) {
        score += 15;
      }
    }

    // Heart rate analysis
    if (heartRate) {
      if (heartRate > 140 || heartRate < 40) {
        score += 30;
        emergencyKeywords.push('Critical Heart Rate');
      } else if (heartRate > 120 || heartRate < 50) {
        score += 15;
      }
    }

    // Blood pressure analysis
    if (bpSystolic) {
      if (bpSystolic > 180 || bpSystolic < 80) {
        score += 30;
        emergencyKeywords.push('Critical Blood Pressure');
      } else if (bpSystolic > 160 || bpSystolic < 90) {
        score += 15;
      }
    }

    // Oxygen saturation analysis
    if (oxygenSaturation) {
      if (oxygenSaturation < 90) {
        score += 35;
        emergencyKeywords.push('Low Oxygen Saturation');
      } else if (oxygenSaturation < 95) {
        score += 20;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Check emergency flags
   */
  static checkEmergencyFlags(triageData, emergencyKeywords) {
    let score = 0;

    if (triageData.lossOfConsciousness) {
      score += 50;
      emergencyKeywords.push('Loss of Consciousness');
    }

    if (triageData.chestPain) {
      score += 40;
      emergencyKeywords.push('Chest Pain');
    }

    if (triageData.breathingDifficulty && triageData.breathingDifficulty.toLowerCase().includes('severe')) {
      score += 40;
      emergencyKeywords.push('Severe Breathing Difficulty');
    }

    return Math.min(score, 100);
  }

  /**
   * Get priority color for UI
   */
  static getPriorityColor(priority) {
    switch (priority) {
      case 'CRITICAL':
        return '#dc3545'; // Red
      case 'MEDIUM':
        return '#ffc107'; // Yellow/Orange
      case 'NORMAL':
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Gray
    }
  }
}

module.exports = TriageService;