import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { assertAdministrator, newAdminSchema } from "./admin-users.schema";

describe("Administrator access", () => {
  test("an administrator can provision administrators", () => {
    assert.doesNotThrow(() => assertAdministrator([{ role: "admin" }]));
  });
  test("a traveller cannot provision administrators", () => {
    assert.throws(() => assertAdministrator([{ role: "user" }]));
  });
  test("an editor cannot provision administrators", () => {
    assert.throws(() => assertAdministrator([{ role: "editor" }]));
  });
  test("missing role never grants administrator access", () => {
    assert.throws(() => assertAdministrator([]));
  });
  test("email and name are normalized without altering password", () => {
    const input = { fullName: " TABITO ", email: " ADMIN@EXAMPLE.COM ", password: "test-only-secret-2026" };
    assert.deepEqual(newAdminSchema.parse(input), { ...input, fullName: "TABITO", email: "admin@example.com" });
  });
});