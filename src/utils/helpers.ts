import { bytesToHex, Hex } from 'viem';
// import crypto from 'crypto';

export const charLimit = (str: string, limit = 18): string => {
  if (str.length > limit) {
    return str.slice(0, limit) + '...';
  }
  return str;
};
export const generateRandomBytes32 = (): Hex => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const randomHexValue = bytesToHex(randomBytes);
  return randomHexValue;
};

export const generateRandomHexColor = (): string => {
  const hexDigits = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexDigits[Math.floor(Math.random() * 16)];
  }

  return color;
};
export function isValidOptionalUrl(str: string) {
  if (str === '') return true; // Empty string is valid (optional)

  const urlPattern =
    /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/\S*)?$/;
  return urlPattern.test(str);
}

export function isBytes32(value: string): boolean {
  // Remove '0x' prefix if present
  const stripped = value.startsWith('0x') ? value.slice(2) : value;

  // Check if it's a valid hex string and exactly 64 characters long
  return /^[0-9A-Fa-f]{64}$/.test(stripped);
}

export const randomCharacters = (length = 8) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
