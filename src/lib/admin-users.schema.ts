import { z } from "zod";

export const newAdminSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
});

export function assertAdministrator(roles: { role: string }[]) {
  if (!roles.some((entry) => entry.role === "admin")) {
    throw new Error("Accès réservé aux administrateurs.");
  }
}