import { describe, it } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { constantTimeEqual, verifyPassword } from "../auth";

describe("auth security logic", () => {
  it("constantTimeEqual checks string equality", () => {
    assert.ok(constantTimeEqual("hello", "hello"));
    assert.ok(!constantTimeEqual("hello", "world"));
    assert.ok(!constantTimeEqual("hello", "helloo"));
    assert.ok(!constantTimeEqual("helloo", "hello"));
  });

  it("verifyPassword rejects non-bcrypt hashes for database users", async () => {
    const plainTextHash = "!";
    // Database verifyPassword check should fail even if input matches plaintext hash
    const okPlain = await verifyPassword("!", plainTextHash);
    assert.ok(!okPlain, "Plaintext database hash fallback should be rejected");

    const validPassword = "my-secure-password";
    const validBcryptHash = await bcrypt.hash(validPassword, 10);
    
    const okCorrect = await verifyPassword(validPassword, validBcryptHash);
    assert.ok(okCorrect, "Valid bcrypt hash comparison should succeed");

    const okWrong = await verifyPassword("wrong-password", validBcryptHash);
    assert.ok(!okWrong, "Wrong password with valid bcrypt hash should fail");
  });
});
