import "server-only";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
  type AdminSession,
} from "@/lib/session";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/** True selama email/kata sandi masih memakai nilai demo bawaan. */
export function isDemoLogin(): boolean {
  return !process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD;
}

export function demoLoginHint(): { email: string; password: string } {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyCredentials(email: string, password: string): boolean {
  return (
    safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.toLowerCase()) &&
    safeEqual(password, ADMIN_PASSWORD)
  );
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) return null;
  if (session.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null;

  return session;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function startSession(email: string): Promise<void> {
  const token = await createSessionToken(email);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
