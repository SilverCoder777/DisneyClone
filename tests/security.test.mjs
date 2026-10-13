import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, digest } from "../lib/security.mjs";
test("password hashes are salted and verify only the correct password", () => {
  const first = hashPassword("a-long-secure-password");
  const second = hashPassword("a-long-secure-password");
  assert.notEqual(first, second);
  assert.ok(verifyPassword("a-long-secure-password", first));
  assert.equal(verifyPassword("wrong-password", first), false);
  assert.equal(verifyPassword("a-long-secure-password", "corrupted"), false);
});
test("session digest is deterministic without storing raw token", () => {
  const token = "a-random-session-token";
  assert.equal(digest(token), digest(token));
  assert.notEqual(digest(token), token);
  assert.equal(digest(token).length, 64);
  assert.notEqual(digest(token), digest("another-token"));
});
