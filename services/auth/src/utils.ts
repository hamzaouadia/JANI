export const sanitizeEmail = (value: string) => value.trim().toLowerCase();

export const isStrongPassword = (password: string) => password.length >= 8;
