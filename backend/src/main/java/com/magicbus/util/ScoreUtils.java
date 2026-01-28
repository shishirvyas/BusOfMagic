package com.magicbus.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

/**
 * Utility class for score calculations
 */
public class ScoreUtils {

    private static final Random random = new Random();
    
    // Engagement score range
    private static final int ENGAGEMENT_MIN = 27;
    private static final int ENGAGEMENT_MAX = 85;
    
    // Dropout risk score range
    private static final int DROPOUT_RISK_MIN = 5;
    private static final int DROPOUT_RISK_MAX = 45;

    /**
     * Generate a random engagement score between 27 and 85
     * @return BigDecimal engagement score with 2 decimal places
     */
    public static BigDecimal getEngagementScore() {
        double score = ENGAGEMENT_MIN + (random.nextDouble() * (ENGAGEMENT_MAX - ENGAGEMENT_MIN));
        return BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Generate a random dropout risk score between 5 and 45
     * @return BigDecimal dropout risk score with 2 decimal places
     */
    public static BigDecimal getDropoutRiskScore() {
        double score = DROPOUT_RISK_MIN + (random.nextDouble() * (DROPOUT_RISK_MAX - DROPOUT_RISK_MIN));
        return BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Generate engagement score within a custom range
     * @param min minimum value
     * @param max maximum value
     * @return BigDecimal score with 2 decimal places
     */
    public static BigDecimal getRandomScore(int min, int max) {
        double score = min + (random.nextDouble() * (max - min));
        return BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP);
    }
}
