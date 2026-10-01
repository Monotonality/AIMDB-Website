const EDU_EMAIL = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.edu$/i;

export function isEduEmail(email: string) {
  return EDU_EMAIL.test(email.trim());
}
