const PASSWORD_RULES = [
  {
    test: (value: string) => value.length >= 8,
    message: "au moins 8 caractères",
  },
  { test: (value: string) => /[a-z]/.test(value), message: "une minuscule" },
  { test: (value: string) => /[A-Z]/.test(value), message: "une majuscule" },
  { test: (value: string) => /[0-9]/.test(value), message: "un chiffre" },
];

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidMalagasyPhone = (phone: string): boolean =>
  /^(\+261|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));

export const validatePasswordStrength = (password: string): string | null => {
  const missingRules = PASSWORD_RULES.filter((rule) => !rule.test(password));
  if (missingRules.length === 0) return null;
  return `Le mot de passe doit contenir ${missingRules
    .map((rule) => rule.message)
    .join(", ")}.`;
};
