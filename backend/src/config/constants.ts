export const APP_CONSTANTS = {
  APP_NAME: "Digonto API",
  API_PREFIX: "/api/v1",
  DEFAULT_CURRENCY: "BDT",

  // Minor units conversion (1 BDT = 100 Paisa)
  MINOR_UNIT_FACTOR: 100n,

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Financial safety limits (in minor units / Paisa)
  FINANCE: {
    MIN_WITHDRAWAL_MINOR: 20000n, // ৳200.00
    MAX_WITHDRAWAL_MINOR: 1000000n, // ৳10,000.00
    DEFAULT_REFERRAL_BONUS_MINOR: 2000n, // ৳20.00
  },

  // Task settings
  TASKS: {
    DAILY_FREE_LIMIT: 2,
    DEFAULT_EXPIRY_DAYS: 30,
  },
} as const;
