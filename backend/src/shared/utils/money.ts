import { APP_CONSTANTS } from "@/config/constants";

export const toMinorUnits = (amountBDT: number | string): bigint => {
  const num = typeof amountBDT === "string" ? parseFloat(amountBDT) : amountBDT;
  if (isNaN(num) || !isFinite(num)) {
    throw new Error("Invalid currency amount");
  }
  // Round to 2 decimal places before converting to integer minor units
  return BigInt(Math.round(num * Number(APP_CONSTANTS.MINOR_UNIT_FACTOR)));
};

export const toMajorUnits = (minor: bigint | number | string): number => {
  const b = typeof minor === "bigint" ? minor : BigInt(minor);
  return Number(b) / Number(APP_CONSTANTS.MINOR_UNIT_FACTOR);
};

export const formatBDT = (minor: bigint | number | string): string => {
  const major = toMajorUnits(minor);
  return `৳ ${major.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const serializeMoney = (minor: bigint | number | string) => {
  const major = toMajorUnits(minor);
  return {
    amount: major.toFixed(2),
    amountMinor: (typeof minor === "bigint" ? minor : BigInt(minor)).toString(),
    currency: APP_CONSTANTS.DEFAULT_CURRENCY,
    formatted: formatBDT(minor),
  };
};
