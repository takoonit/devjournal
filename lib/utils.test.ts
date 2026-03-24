import test from 'node:test';
import assert from 'node:assert';
import { generateSlug } from './utils.ts';

test('generateSlug', async (t) => {
    await t.test('handles basic strings', () => {
        assert.strictEqual(generateSlug('Hello World'), 'hello-world');
    });

    await t.test('handles uppercase letters by lowercasing them', () => {
        assert.strictEqual(generateSlug('UpperCaseLetters'), 'uppercaseletters');
    });

    await t.test('replaces spaces with hyphens', () => {
        assert.strictEqual(generateSlug('a b c'), 'a-b-c');
    });

    await t.test('handles multiple spaces', () => {
        assert.strictEqual(generateSlug('a  b   c'), 'a-b-c');
    });

    await t.test('removes special characters', () => {
        assert.strictEqual(generateSlug('hello@world!#$'), 'hello-world');
    });

    await t.test('removes leading and trailing hyphens', () => {
        assert.strictEqual(generateSlug('-hello-world-'), 'hello-world');
        assert.strictEqual(generateSlug('---hello-world---'), 'hello-world');
        assert.strictEqual(generateSlug('!hello world?'), 'hello-world');
    });

    await t.test('handles numbers', () => {
        assert.strictEqual(generateSlug('Year 2024'), 'year-2024');
    });

    await t.test('handles empty strings', () => {
        assert.strictEqual(generateSlug(''), '');
    });

    await t.test('handles strings with only special characters', () => {
        assert.strictEqual(generateSlug('!@#$%^&*()'), '');
    });

    await t.test('handles accented characters (might not be supported based on current impl, but testing current behavior)', () => {
        assert.strictEqual(generateSlug('café'), 'caf');
    });
});
