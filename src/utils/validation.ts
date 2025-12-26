export const isValidEmail = (v: string) => {
  const value = v.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const normalizeEmail = (v: string) => v.trim();

export const validateEmail = (v: string): string | null => {
  const email = v.trim();
  if (!email) return "Enter your email";
  if (!isValidEmail(email)) return "Please enter a valid email";
  return null;
};

export const validateName = (v: string): string | null => {
  const name = v.trim();
  if (!name) return "Enter your name";
  if (!isValidName(name)) return "Please enter a valid name";
  return null;
};

export const isValidName = (v: string) => {
  const value = v.trim();

  if (value.length < 2) return false;
  if (value.length > 50) return false;

  if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]+$/.test(value)) return false;

  const lettersCount = (value.match(/[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]/g) ?? []).length;
  if (lettersCount < 2) return false;

  if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ].*[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]$/.test(value)) return false;

  return true;
};
