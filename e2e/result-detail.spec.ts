import { test, expect } from '@playwright/test';
import { clearCookies, fillEditorAndCheck } from './helpers';
import { testAnswers } from './test-answers';

test.describe('Result Detail Display', () => {
  test.beforeEach(async ({ page }) => {
    await clearCookies(page);
  });

  test('should display detailed results for 2 wrong answers scenario', async ({ page }) => {
    await page.goto('/');

    // Start Level 1
    await page.click('text=Lv1');

    // Answer pattern: Correct, Wrong, Correct, Wrong, Correct (2 wrong answers)
    const answers = [
      testAnswers.level1[0], // Correct
      'wrong answer', // Wrong
      testAnswers.level1[2], // Correct
      'wrong answer', // Wrong
      testAnswers.level1[4], // Correct
    ];

    for (let i = 0; i < answers.length; i++) {
      await fillEditorAndCheck(page, answers[i], true);

      if (i < answers.length - 1) {
        // Wait for automatic progression (except last question)
        await page.waitForTimeout(2000);
      }
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result/);

    // Check final score (3 correct * 20 = 60)
    await expect(page.locator('text=60 / 100')).toBeVisible();

    // Check detailed results section
    await expect(page.locator('text=問題詳細')).toBeVisible();

    // Check all 5 problems are listed
    for (let i = 1; i <= 5; i++) {
      await expect(page.locator(`text=問題 ${i}`)).toBeVisible();
    }

    // Check correct/incorrect badges
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(3);
    await expect(incorrectBadges).toHaveCount(2);

    // Expand first accordion item to check details
    await page.click('text=問題 1');
    await expect(
      page.locator('text=User型はnameとageを持つオブジェクト型を完成させます。'),
    ).toBeVisible();
    await expect(page.locator('text=正解例:')).toBeVisible();
    await expect(page.locator('text=あなたの回答:')).toBeVisible();

    // Check if correct answer is highlighted in green
    const correctAnswerCode = page.locator('.chakra-code').first();
    await expect(correctAnswerCode).toHaveCSS('background-color', /green/);

    // Expand second accordion item (wrong answer)
    await page.click('text=問題 2');
    await expect(page.locator('text=Point型はxとyを持つ二次元座標を表します。')).toBeVisible();

    // Check if incorrect answer is highlighted in red
    const incorrectAnswerSection = page.locator('.chakra-code').nth(2); // User's answer for problem 2
    await expect(incorrectAnswerSection).toHaveCSS('background-color', /red/);
  });

  test('should display detailed results for 3 wrong answers scenario', async ({ page }) => {
    await page.goto('/');

    // Start Level 1
    await page.click('text=Lv1');

    // Answer pattern: Wrong, Wrong, Correct, Wrong, Correct (3 wrong answers)
    const answers = [
      'wrong answer', // Wrong
      'wrong answer', // Wrong
      testAnswers.level1[2], // Correct
      'wrong answer', // Wrong
      testAnswers.level1[4], // Correct
    ];

    for (let i = 0; i < answers.length; i++) {
      await fillEditorAndCheck(page, answers[i], true);

      if (i < answers.length - 1) {
        // Wait for automatic progression
        await page.waitForTimeout(2000);
      }
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result/);

    // Check final score (2 correct * 20 = 40)
    await expect(page.locator('text=40 / 100')).toBeVisible();

    // Check detailed results section
    await expect(page.locator('text=問題詳細')).toBeVisible();

    // Check correct/incorrect badges count
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(2);
    await expect(incorrectBadges).toHaveCount(3);

    // Test accordion functionality - expand all items
    for (let i = 1; i <= 5; i++) {
      await page.click(`text=問題 ${i}`);
      await expect(page.locator('text=正解例:').nth(i - 1)).toBeVisible();
      await expect(page.locator('text=あなたの回答:').nth(i - 1)).toBeVisible();
    }
  });

  test('should handle perfect score (all correct) with detailed results', async ({ page }) => {
    await page.goto('/');

    // Start Level 1
    await page.click('text=Lv1');

    // Answer all questions correctly
    for (let i = 0; i < testAnswers.level1.length; i++) {
      await fillEditorAndCheck(page, testAnswers.level1[i], true);

      if (i < testAnswers.level1.length - 1) {
        await page.waitForTimeout(2000);
      }
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result/);

    // Check final score (5 correct * 20 = 100)
    await expect(page.locator('text=100 / 100')).toBeVisible();

    // Check that all badges are correct
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(5);
    await expect(incorrectBadges).toHaveCount(0);

    // Check that all user answers have green highlighting
    await page.click('text=問題 1');
    const userAnswerCodes = page.locator('.chakra-code').filter({ hasText: testAnswers.level1[0] });
    await expect(userAnswerCodes.first()).toHaveCSS('background-color', /green/);
  });

  test('should handle zero score (all wrong) with detailed results', async ({ page }) => {
    await page.goto('/');

    // Start Level 1
    await page.click('text=Lv1');

    // Answer all questions incorrectly
    for (let i = 0; i < 5; i++) {
      await fillEditorAndCheck(page, 'completely wrong answer', true);

      if (i < 4) {
        await page.waitForTimeout(2000);
      }
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result/);

    // Check final score (0 correct * 20 = 0)
    await expect(page.locator('text=0 / 100')).toBeVisible();

    // Check that all badges are incorrect
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(0);
    await expect(incorrectBadges).toHaveCount(5);

    // Check that all user answers have red highlighting
    await page.click('text=問題 1');
    const userAnswerSection = page
      .locator('text=あなたの回答:')
      .first()
      .locator('..')
      .locator('.chakra-code');
    await expect(userAnswerSection).toHaveCSS('background-color', /red/);
  });

  test('should display explanations from puzzle data', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Lv1');

    // Answer first question correctly
    await fillEditorAndCheck(page, testAnswers.level1[0], true);
    await page.waitForTimeout(2000);

    // Answer second question incorrectly to end early for testing
    await fillEditorAndCheck(page, 'wrong', true);
    await page.waitForTimeout(2000);

    // Complete remaining questions
    for (let i = 2; i < 5; i++) {
      await fillEditorAndCheck(page, testAnswers.level1[i], true);
      if (i < 4) {
        await page.waitForTimeout(2000);
      }
    }

    // Check explanations in detailed results
    await expect(page).toHaveURL(/\/result/);

    // Expand first problem and check explanation
    await page.click('text=問題 1');
    await expect(
      page.locator('text=User型はnameとageを持つオブジェクト型を完成させます。'),
    ).toBeVisible();

    // Expand second problem and check explanation
    await page.click('text=問題 2');
    await expect(page.locator('text=Point型はxとyを持つ二次元座標を表します。')).toBeVisible();
  });
});
