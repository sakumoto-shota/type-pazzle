import { test } from '@playwright/test';
import { playLevel } from './helpers';

// Lv1 テスト
test.describe('Level 1', () => {
  test('Lv1 - 80点 (4問正解)', async ({ page }) => {
    await playLevel(page, 1, 4, 'lv1-80.png');
  });

  test('Lv1 - 100点 (5問正解)', async ({ page }) => {
    await playLevel(page, 1, 5, 'lv1-100.png');
  });
});

// Lv2 テスト
test.describe('Level 2', () => {
  test('Lv2 - 80点 (4問正解)', async ({ page }) => {
    await playLevel(page, 2, 4, 'lv2-80.png');
  });

  test('Lv2 - 100点 (5問正解)', async ({ page }) => {
    await playLevel(page, 2, 5, 'lv2-100.png');
  });
});

// Lv3 テスト
test.describe('Level 3', () => {
  test('Lv3 - 80点 (4問正解)', async ({ page }) => {
    await playLevel(page, 3, 4, 'lv3-80.png');
  });

  test('Lv3 - 100点 (5問正解)', async ({ page }) => {
    await playLevel(page, 3, 5, 'lv3-100.png');
  });
});

// Lv4 テスト
test.describe('Level 4', () => {
  test('Lv4 - 80点 (4問正解)', async ({ page }) => {
    await playLevel(page, 4, 4, 'lv4-80.png');
  });

  test('Lv4 - 100点 (5問正解)', async ({ page }) => {
    await playLevel(page, 4, 5, 'lv4-100.png');
  });
});

// Lv5 テスト
test.describe('Level 5', () => {
  test('Lv5 - 80点 (4問正解)', async ({ page }) => {
    await playLevel(page, 5, 4, 'lv5-80.png');
  });

  test('Lv5 - 100点 (5問正解)', async ({ page }) => {
    await playLevel(page, 5, 5, 'lv5-100.png');
  });
});