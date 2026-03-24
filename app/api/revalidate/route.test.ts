import { test } from 'node:test';
import assert from 'node:assert';
import { createHash, timingSafeEqual } from "node:crypto";

function secureCompare(a: string | null, b: string | undefined): boolean {
    if (typeof a !== "string" || typeof b !== "string") return false;
    const hashA = createHash("sha256").update(a).digest();
    const hashB = createHash("sha256").update(b).digest();
    return timingSafeEqual(hashA, hashB);
}

test('secureCompare', async (t) => {
    await t.test('returns true for matching strings', () => {
        assert.strictEqual(secureCompare('my-secret-token', 'my-secret-token'), true);
        assert.strictEqual(secureCompare('', ''), true);
    });

    await t.test('returns false for mismatching strings', () => {
        assert.strictEqual(secureCompare('my-secret-token', 'wrong-token'), false);
        assert.strictEqual(secureCompare('my-secret-token', 'my-secret-toke'), false);
        assert.strictEqual(secureCompare('my-secret-toke', 'my-secret-token'), false);
    });

    await t.test('returns false for null or undefined', () => {
        assert.strictEqual(secureCompare(null, 'token'), false);
        assert.strictEqual(secureCompare('token', undefined), false);
        assert.strictEqual(secureCompare(null, undefined), false);
    });
});
