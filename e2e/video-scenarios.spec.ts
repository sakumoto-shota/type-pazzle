import { test, expect } from '@playwright/test';
import { clearCookies, fillEditorAndCheck } from './helpers';
import { ANSWERS as testAnswers } from './test-answers';

// Configure this test to always record video
test.use({
  video: {
    mode: 'on',
    size: { width: 1280, height: 720 },
  },
});

test.describe('Video Recording Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await clearCookies(page);
  });

  test('2問間違いのシナリオ - 動画撮影', async ({ page }) => {
    await page.goto('/');

    // Start Level 1
    await page.click('text=Lv1');
    await expect(page.locator('h2:has-text("Lv1")')).toBeVisible();

    // Answer pattern: Correct, Wrong, Correct, Wrong, Correct (2 wrong answers)
    const answers = [
      testAnswers.level1[0], // Correct - User型
      'wrong answer 1', // Wrong
      testAnswers.level1[2], // Correct - greet関数型
      'wrong answer 2', // Wrong
      testAnswers.level1[4], // Correct - Dog extends Animal
    ];

    for (let i = 0; i < answers.length; i++) {
      // Wait a bit before answering for better video visibility
      await page.waitForTimeout(500);

      // Use optimized editor filling
      await fillEditorAndCheck(page, answers[i], true);

      // Wait for result processing
      await page.waitForTimeout(1500);

      // If not the last question, wait for automatic progression
      if (i < answers.length - 1) {
        await page.waitForTimeout(2000);
      }
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result/);

    // Wait for score animation
    await page.waitForTimeout(4000);

    // Check final score (3 correct * 20 = 60)
    await expect(page.locator('text=60 / 100')).toBeVisible();

    // Check detailed results section
    await expect(page.locator('text=問題詳細')).toBeVisible();

    // Expand accordion items to show details
    for (let i = 1; i <= 5; i++) {
      await page.click(`text=問題 ${i}`);
      await page.waitForTimeout(1000);

      // Check that explanation is visible
      const explanationLocator = page.locator('.chakra-alert').nth(i - 1);
      await expect(explanationLocator).toBeVisible();

      // Check that correct answer is visible
      await expect(page.locator('text=正解例:').nth(i - 1)).toBeVisible();

      // Check that user answer is visible
      await expect(page.locator('text=あなたの回答:').nth(i - 1)).toBeVisible();
    }

    // Wait for final view
    await page.waitForTimeout(3000);

    // Force test failure to trigger video save
    test.setTimeout(60000);
    throw new Error('Video recording complete - 2問間違いシナリオ');
  });

  test('3問間違いのシナリオ - 動画撮影', async ({ page }) => {
    await page.goto('/');

    // Start Level 1
    await page.click('text=Lv1');
    await expect(page.locator('h2:has-text("Lv1")')).toBeVisible();

    // Answer pattern: Wrong, Wrong, Correct, Wrong, Correct (3 wrong answers)
    const answers = [
      'wrong answer 1', // Wrong
      'wrong answer 2', // Wrong
      testAnswers.level1[2], // Correct - greet関数型
      'wrong answer 3', // Wrong
      testAnswers.level1[4], // Correct - Dog extends Animal
    ];

    for (let i = 0; i < answers.length; i++) {
      // Wait a bit before answering for better video visibility
      await page.waitForTimeout(500);

      // Use optimized editor filling
      await fillEditorAndCheck(page, answers[i], true);

      // Wait for result processing
      await page.waitForTimeout(1500);

      // If not the last question, wait for automatic progression
      if (i < answers.length - 1) {
        await page.waitForTimeout(2000);
      }
    }

    // Should be on result page
    await expect(page).toHaveURL(/\/result/);

    // Wait for score animation
    await page.waitForTimeout(4000);

    // Check final score (2 correct * 20 = 40)
    await expect(page.locator('text=40 / 100')).toBeVisible();

    // Check detailed results section
    await expect(page.locator('text=問題詳細')).toBeVisible();

    // Check correct/incorrect badges count
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(2);
    await expect(incorrectBadges).toHaveCount(3);

    // Expand all accordion items to show details
    for (let i = 1; i <= 5; i++) {
      await page.click(`text=問題 ${i}`);
      await page.waitForTimeout(1000);

      // Check that content is visible
      const explanationLocator = page.locator('.chakra-alert').nth(i - 1);
      await expect(explanationLocator).toBeVisible();
    }

    // Scroll to see all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // Wait for final view
    await page.waitForTimeout(3000);

    // Force test failure to trigger video save
    test.setTimeout(60000);
    throw new Error('Video recording complete - 3問間違いシナリオ');
  });
});
