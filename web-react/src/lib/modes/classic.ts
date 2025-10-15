export const CLASSIC_CONFIG = {
  toneDuration: 700,
  gapDuration: 300,
  startingLives: 3,
  scoreMultiplier: 10,
  streakBonus: 20,
  streakThreshold: 5,
};

export function calculateScore(round: number, streak: number): number {
  let score = round * CLASSIC_CONFIG.scoreMultiplier;
  if (streak >= CLASSIC_CONFIG.streakThreshold) {
    score += CLASSIC_CONFIG.streakBonus;
  }
  return score;
}
