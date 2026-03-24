import test from 'node:test';
import assert from 'node:assert';
import { formatDate } from './utils.ts';

test('formatDate', async (t) => {
    await t.test('formats Date object with default format', () => {
        const date = new Date(2023, 9, 15, 12, 0, 0); // Oct 15, 2023
        assert.strictEqual(formatDate(date), 'Oct 15, 2023');
    });

    await t.test('formats date string with default format', () => {
        const dateStr = '2023-10-15T12:00:00.000Z'; // UTC time
        // The output depends on the local timezone where the test is run,
        // because new Date(dateStr) creates a local date.
        // To make the test robust, let's create a date and use its ISO string,
        // so it matches the expected local format.
        const date = new Date(2023, 9, 15, 12, 0, 0);
        assert.strictEqual(formatDate(date.toISOString()), 'Oct 15, 2023');
    });

    await t.test('formats Date object with custom format', () => {
        const date = new Date(2023, 9, 15, 12, 0, 0);
        assert.strictEqual(formatDate(date, 'yyyy-MM-dd'), '2023-10-15');
    });

    await t.test('formats date string with custom format', () => {
        const date = new Date(2023, 9, 15, 12, 0, 0);
        assert.strictEqual(formatDate(date.toISOString(), 'dd/MM/yyyy'), '15/10/2023');
    });
});
