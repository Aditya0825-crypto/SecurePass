const COMMON_PATTERNS = [
  "123456", "12345678", "123456789", "password", "qwerty", "abc123",
  "111111", "123123", "admin", "letmein", "welcome", "monkey",
  "1234567890", "abcdef", "abcabc", "qwertyuiop", "asdfgh",
];

const SEQUENTIAL = "abcdefghijklmnopqrstuvwxyz0123456789";
const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export interface PasswordAnalysis {
  score: number;
  strength: "Weak" | "Fair" | "Strong" | "Very Strong";
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasSequential: boolean;
  hasRepeated: boolean;
  hasCommonPattern: boolean;
  crackTime: string;
  suggestions: string[];
  improvedPassword: string;
}

function detectSequential(pw: string): boolean {
  const lower = pw.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const sub = lower.substring(i, i + 3);
    if (SEQUENTIAL.includes(sub)) return true;
    const rev = sub.split("").reverse().join("");
    if (SEQUENTIAL.includes(rev)) return true;
  }
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i < lower.length - 2; i++) {
      const sub = lower.substring(i, i + 3);
      if (row.includes(sub)) return true;
    }
  }
  return false;
}

function detectRepeated(pw: string): boolean {
  return /(.)\1{2,}/.test(pw);
}

function detectCommon(pw: string): boolean {
  const lower = pw.toLowerCase();
  return COMMON_PATTERNS.some((p) => lower.includes(p));
}

function estimateCrackTime(score: number): string {
  if (score < 20) return "Instantly";
  if (score < 40) return "Minutes";
  if (score < 60) return "Hours";
  if (score < 80) return "Months";
  return "Centuries";
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0, strength: "Weak", length: 0,
      hasUppercase: false, hasLowercase: false, hasNumbers: false, hasSymbols: false,
      hasSequential: false, hasRepeated: false, hasCommonPattern: false,
      crackTime: "Instantly", suggestions: ["Enter a password to analyze"], improvedPassword: "",
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const hasSequential = detectSequential(password);
  const hasRepeated = detectRepeated(password);
  const hasCommonPattern = detectCommon(password);

  let score = 0;
  // Length scoring
  score += Math.min(password.length * 4, 40);
  // Variety
  const variety = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
  score += variety * 10;
  // Penalties
  if (hasSequential) score -= 15;
  if (hasRepeated) score -= 10;
  if (hasCommonPattern) score -= 20;
  if (password.length < 8) score -= 10;

  score = Math.max(0, Math.min(100, score));

  const strength: PasswordAnalysis["strength"] =
    score < 25 ? "Weak" : score < 50 ? "Fair" : score < 75 ? "Strong" : "Very Strong";

  const suggestions: string[] = [];
  if (!hasUppercase) suggestions.push("Add uppercase letters (A-Z)");
  if (!hasLowercase) suggestions.push("Add lowercase letters (a-z)");
  if (!hasNumbers) suggestions.push("Add numbers (0-9)");
  if (!hasSymbols) suggestions.push("Add special characters (!@#$%...)");
  if (password.length < 12) suggestions.push("Increase length to at least 12 characters");
  if (hasSequential) suggestions.push("Avoid sequential patterns (abc, 123, qwerty)");
  if (hasRepeated) suggestions.push("Avoid repeated characters (aaa, 111)");
  if (hasCommonPattern) suggestions.push("Avoid common password patterns");

  const improvedPassword = generateImproved(password);

  return {
    score, strength, length: password.length,
    hasUppercase, hasLowercase, hasNumbers, hasSymbols,
    hasSequential, hasRepeated, hasCommonPattern,
    crackTime: estimateCrackTime(score), suggestions, improvedPassword,
  };
}

function generateImproved(base: string): string {
  const symbols = "!@#$%^&*";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  let improved = base;
  if (!/[A-Z]/.test(improved)) improved += upper[Math.floor(Math.random() * upper.length)];
  if (!/[0-9]/.test(improved)) improved += digits[Math.floor(Math.random() * digits.length)];
  if (!/[^A-Za-z0-9]/.test(improved)) improved += symbols[Math.floor(Math.random() * symbols.length)];
  while (improved.length < 14) {
    improved += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }
  return improved;
}

export function generatePassword(
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): string {
  let chars = "";
  if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) chars += "0123456789";
  if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}
