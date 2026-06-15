import "server-only";
import bcrypt from "bcryptjs";

/** Wachtwoord-hashing (bcrypt, pure JS — geen native build op Windows nodig). */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
