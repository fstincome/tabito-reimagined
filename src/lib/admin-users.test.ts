import { describe, expect, test } from "bun:test";
import { assertAdministrator, newAdminSchema } from "./admin-users.schema";

describe("Administrator access", () => {
  test("an administrator can provision administrators", () => {
    expect(() => assertAdministrator([{ role: "admin" }])).not.toThrow();
  });
  test("a traveller cannot provision administrators", () => {
    expect(() => assertAdministrator([{ role: "user" }])).toThrow();
  });
  test("an editor cannot provision administrators", () => {
    expect(() => assertAdministrator([{ role: "editor" }])).toThrow();
  });
  test("missing role never grants administrator access", () => {
    expect(() => assertAdministrator([])).toThrow();
  });
  test("email and name are normalized without altering password", () => {
    const input = { fullName: " TABITO ", email: " ADMIN@EXAMPLE.COM ", password: "test-only-secret-2026" };
    expect(newAdminSchema.parse(input)).toEqual({ ...input, fullName: "TABITO", email: "admin@example.com" });
  });
});