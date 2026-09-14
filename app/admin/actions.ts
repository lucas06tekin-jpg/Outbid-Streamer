"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  checkPassword,
  createSessionToken,
  verifySessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/admin-auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

export async function approveAction(id: string) {
  await requireAdmin();
  await prisma.streamer.update({ where: { id }, data: { status: "PAID" } });
  revalidatePath("/admin");
}

export async function rejectAction(id: string) {
  await requireAdmin();
  await prisma.streamer.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin");
}

export async function deleteAction(id: string) {
  await requireAdmin();
  await prisma.streamer.delete({ where: { id } });
  revalidatePath("/admin");
}
