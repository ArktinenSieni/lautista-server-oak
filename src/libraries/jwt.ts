import { create, getNumericDate, Payload, verify } from "@zaubrik/djwt";
import type { Auth } from "../types.ts";

export async function getJwt(payload: PayloadLautis) {
  return await create(
    { alg: "HS512", type: "JWT" },
    { ...payload, exp: getNumericDate(minute * 60) },
    key,
  );
}

export async function getJwtPayload(jwt: string): Promise<PayloadLautis> {
  return await verify(jwt, key);
}

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export type PayloadLautis = Payload & Auth;

const minute = 60;
