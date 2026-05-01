export interface RankTier {
  name: string;
  tiers: number;
  starsPerTier: number;
  minStars?: number; // Minimum absolute stars to reach this rank
  maxStars?: number; // Maximum stars within this rank
}

export const RANK_CONFIG: Record<string, RankTier> = {
  warrior: { name: "Warrior", tiers: 3, starsPerTier: 3 },
  elite: { name: "Elite", tiers: 3, starsPerTier: 4 },
  master: { name: "Master", tiers: 4, starsPerTier: 4 },
  grandmaster: { name: "Grandmaster", tiers: 5, starsPerTier: 5 },
  epic: { name: "Epic", tiers: 5, starsPerTier: 5 },
  legend: { name: "Legend", tiers: 5, starsPerTier: 5 },
  mythic: { name: "Mythic", tiers: 1, starsPerTier: 25, minStars: 0, maxStars: 24 },
  mythical_honor: { name: "Mythical Honor", tiers: 1, starsPerTier: 25, minStars: 25, maxStars: 49 },
  mythical_glory: { name: "Mythical Glory", tiers: 1, starsPerTier: 50, minStars: 50, maxStars: 99 },
  mythical_immortal: { name: "Mythical Immortal", tiers: 1, starsPerTier: 900, minStars: 100, maxStars: 1000 },
};

export const PRICE_PER_STAR: Record<string, number> = {
  warrior: 1000,
  elite: 1000,
  master: 1000,
  grandmaster: 1500,
  epic: 2500,
  legend: 4000,
  mythic: 6000,
  mythical_honor: 8500,
  mythical_glory: 12000,
  mythical_immortal: 18000,
};

export const RANK_ORDER = [
  "warrior",
  "elite",
  "master",
  "grandmaster",
  "epic",
  "legend",
  "mythic",
  "mythical_honor",
  "mythical_glory",
  "mythical_immortal",
];

const MYTHIC_RANKS = ["mythic", "mythical_honor", "mythical_glory", "mythical_immortal"];

export function getRankIndex(rankId: string): number {
  return RANK_ORDER.indexOf(rankId.toLowerCase());
}

/**
 * Calculates the absolute star count for a given rank, tier, and stars.
 */
export function calculateTotalStars(rankId: string, tier: number, starCount: number): number {
  const rankKey = rankId.toLowerCase();
  let totalStars = 0;

  // 1. Sum up all stars from traditional ranks before the current one
  for (let i = 0; i < getRankIndex(rankKey); i++) {
    const r = RANK_ORDER[i];
    if (MYTHIC_RANKS.includes(r)) break; // Stop at mythic
    const config = RANK_CONFIG[r];
    totalStars += config.tiers * config.starsPerTier;
  }

  // 2. Add stars for the current rank/tier
  if (MYTHIC_RANKS.includes(rankKey)) {
    // For mythic, starCount is the absolute star value (0-1000)
    totalStars += starCount;
  } else {
    const config = RANK_CONFIG[rankKey];
    const completedTiers = config.tiers - tier;
    totalStars += (completedTiers * config.starsPerTier) + starCount;
  }

  return totalStars;
}

export interface RankOutput {
  current_total_stars: number;
  target_total_stars: number;
  stars_needed: number;
  price_per_star: number;
  multiplier: number;
  total_price: number;
  currency: "IDR";
}

export function calculateRankOutput(
  currentRank: string,
  currentTier: number,
  currentStar: number,
  targetRank: string,
  targetTier: number,
  targetStar: number,
  multiplier: number = 1
): RankOutput {
  const currentTotal = calculateTotalStars(currentRank, currentTier, currentStar);
  const targetTotal = calculateTotalStars(targetRank, targetTier, targetStar);

  const starsNeeded = Math.max(0, targetTotal - currentTotal);
  const pricePerStar = PRICE_PER_STAR[currentRank.toLowerCase()] || 1000;

  return {
    current_total_stars: currentTotal,
    target_total_stars: targetTotal,
    stars_needed: starsNeeded,
    price_per_star: pricePerStar,
    multiplier: multiplier,
    total_price: starsNeeded * pricePerStar * multiplier,
    currency: "IDR",
  };
}

export function getTierList(rankId: string): number[] {
  const config = RANK_CONFIG[rankId.toLowerCase()];
  if (!config || MYTHIC_RANKS.includes(rankId.toLowerCase())) return [1];
  return Array.from({ length: config.tiers }, (_, i) => config.tiers - i);
}

export function getRomanNumeral(num: number): string {
  return ["I", "II", "III", "IV", "V"][num - 1] || num.toString();
}

export function getRankMaxStars(rankId: string): number {
  const config = RANK_CONFIG[rankId.toLowerCase()];
  return config?.maxStars ?? config?.starsPerTier ?? 0;
}

export function getRankMinStars(rankId: string): number {
  return RANK_CONFIG[rankId.toLowerCase()]?.minStars ?? 0;
}