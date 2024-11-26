import { compare, hash } from "bcrypt";

export async function getPasswordHash(password: string) {
  return await hash(password);
}

export async function testPassword(password: string, hash: string) {
  return await compare(password, hash);
}
