import { test, expect } from '@playwright/test';
import { clearCookies } from './helpers';
import { ANSWERS as testAnswers } from './test-answers';

// Configure this test to always record video
test.use({
  video: {
    mode: 'on',
    size: { width: 1280, height: 720 },
  },
});

// Optimized helper function that directly sets Monaco editor content
async function setEditorContent(page: any, content: string) {
  // Wait for Monaco editor to be ready
  await page.waitForSelector('.monaco-editor');

  // Use Monaco Editor API to directly set content - much faster than typing
  await page.evaluate((newCode) => {
    // Access Monaco editor instance through global variables
    const monaco = (window as any).monaco;
    if (monaco && monaco.editor) {
      const editors = monaco.editor.getEditors();
      if (editors && editors.length > 0) {
        const editor = editors[0];
        const model = editor.getModel();
        if (model) {
          model.setValue(newCode);
          return true;
        }
      }
    }

    // Fallback: try to access editor through DOM manipulation
    const editorElement = document.querySelector('.view-lines') as HTMLElement;
    if (editorElement) {
      // Focus the editor
      editorElement.click();

      // Select all content and replace
      document.execCommand('selectAll');
      document.execCommand('insertText', false, newCode);
      return true;
    }

    return false;
  }, content);

  // Small delay to ensure content is set
  await page.waitForTimeout(200);
}

async function answerQuestionOptimized(page: any, answer: string) {
  await setEditorContent(page, answer);

  // Click check button
  await page.click('text=チェック');

  // Wait for result processing
  await page.waitForTimeout(1000);
}

test.describe('Optimized Result Screen Testing', () => {
  test.beforeEach(async ({ page }) => {
    await clearCookies(page);
  });

  test('最適化されたテスト - 2問間違いから結果画面確認まで', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Start Level 1
    await page.click('text=Lv1');
    await expect(page.locator('h2:has-text("Lv1")')).toBeVisible();

    // Wait for Monaco editor to be initialized
    await page.waitForSelector('.monaco-editor', { state: 'visible' });
    await page.waitForTimeout(1000); // Let Monaco fully initialize

    // Answer pattern: Correct, Wrong, Correct, Wrong, Correct (2 wrong answers)
    const answers = [
      testAnswers.level1[0], // Correct - User型
      'wrong answer 1', // Wrong
      testAnswers.level1[2], // Correct - greet関数型
      'wrong answer 2', // Wrong
      testAnswers.level1[4], // Correct - Dog extends Animal
    ];

    console.log('Starting to answer questions...');

    for (let i = 0; i < answers.length; i++) {
      console.log(`Answering question ${i + 1}/${answers.length}`);

      // Use optimized answering
      await answerQuestionOptimized(page, answers[i]);

      // Wait for automatic progression to next question (except last)
      if (i < answers.length - 1) {
        await page.waitForTimeout(1500);

        // Verify we moved to next question
        await expect(page.locator(`text=進捗: ${i + 2}/5`)).toBeVisible({ timeout: 10000 });
      }
    }

    console.log('Finished answering, waiting for result page...');

    // Should automatically redirect to result page
    await expect(page).toHaveURL(/\/result/, { timeout: 15000 });

    // Wait for score animation to complete
    await page.waitForTimeout(4000);

    // Verify final score (3 correct * 20 = 60)
    await expect(page.locator('text=60 / 100')).toBeVisible();
    console.log('Score verified: 60/100');

    // Verify detailed results section is present
    await expect(page.locator('text=問題詳細')).toBeVisible();

    // Check correct/incorrect badge counts
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(3);
    await expect(incorrectBadges).toHaveCount(2);
    console.log('Badge counts verified: 3 correct, 2 incorrect');

    // Test accordion functionality - expand all items to verify content display
    for (let i = 1; i <= 5; i++) {
      console.log(`Expanding problem ${i}...`);
      await page.click(`text=問題 ${i}`);
      await page.waitForTimeout(800);

      // Verify explanation is visible
      const explanationLocator = page.locator('.chakra-alert').nth(i - 1);
      await expect(explanationLocator).toBeVisible();

      // Verify answer sections are visible
      await expect(page.locator('text=正解例:').nth(i - 1)).toBeVisible();
      await expect(page.locator('text=あなたの回答:').nth(i - 1)).toBeVisible();
    }

    console.log('All accordion items expanded and verified');

    // Final wait for complete video recording
    await page.waitForTimeout(2000);

    // Scroll to see all content in video
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    console.log('Test completed successfully - 結果画面での点数表示と詳細確認完了');
  });

  test('最適化されたテスト - 3問間違いから結果画面確認まで', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Start Level 1
    await page.click('text=Lv1');
    await expect(page.locator('h2:has-text("Lv1")')).toBeVisible();

    // Wait for Monaco editor
    await page.waitForSelector('.monaco-editor', { state: 'visible' });
    await page.waitForTimeout(1000);

    // Answer pattern: Wrong, Wrong, Correct, Wrong, Correct (3 wrong answers)
    const answers = [
      'wrong answer 1', // Wrong
      'wrong answer 2', // Wrong
      testAnswers.level1[2], // Correct - greet関数型
      'wrong answer 3', // Wrong
      testAnswers.level1[4], // Correct - Dog extends Animal
    ];

    for (let i = 0; i < answers.length; i++) {
      await answerQuestionOptimized(page, answers[i]);

      if (i < answers.length - 1) {
        await page.waitForTimeout(1500);
        await expect(page.locator(`text=進捗: ${i + 2}/5`)).toBeVisible({ timeout: 10000 });
      }
    }

    // Wait for result page
    await expect(page).toHaveURL(/\/result/, { timeout: 15000 });
    await page.waitForTimeout(4000);

    // Verify final score (2 correct * 20 = 40)
    await expect(page.locator('text=40 / 100')).toBeVisible();

    // Verify badge counts
    const correctBadges = page.locator('text=正解 ✓');
    const incorrectBadges = page.locator('text=不正解 ✗');

    await expect(correctBadges).toHaveCount(2);
    await expect(incorrectBadges).toHaveCount(3);

    // Quick verification of accordion functionality
    await page.click('text=問題 1');
    await page.waitForTimeout(500);
    await expect(page.locator('.chakra-alert').first()).toBeVisible();

    // Scroll for video capture
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    console.log('3問間違いテスト完了 - 40点確認済み');
  });
});
