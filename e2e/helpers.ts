import { expect, type Page } from '@playwright/test';
import { ANSWERS as testAnswers } from './test-answers';

export async function clearCookies(page: Page) {
  await page.context().clearCookies();
}

export async function fillEditorAndCheck(page: Page, answer: string, shouldCheck = true) {
  // Use Monaco Editor API to directly set content - much faster than typing
  await page.evaluate((newCode) => {
    const editor = (window as any).monaco?.editor?.getModels?.()?.[0];
    if (editor) {
      editor.setValue(newCode);
    } else {
      // Fallback to keyboard simulation if Monaco API not available
      const editorElement = document.querySelector('.monaco-editor .view-lines') as HTMLElement;
      if (editorElement) {
        editorElement.click();
        document.execCommand('selectAll');
        document.execCommand('delete');
        document.execCommand('insertText', false, newCode);
      }
    }
  }, answer);

  // Small delay to ensure editor is updated
  await page.waitForTimeout(100);

  if (shouldCheck) {
    // Click check button
    await page.click('text=チェック');

    // Wait for result
    await page.waitForTimeout(1000);
  }
}

export async function playLevel(
  page: Page,
  level: number,
  correctAnswers: number,
  screenshotName: string,
) {
  await clearCookies(page);
  await page.goto('/');

  // Start specified level
  await page.click(`text=Lv${level}`);
  await expect(page.locator(`h2:has-text("Lv${level}")`)).toBeVisible();

  // Get answers for the level
  const levelAnswers = testAnswers[`level${level}` as keyof typeof testAnswers];

  // Answer questions (correct answers first, then wrong for the rest)
  for (let i = 0; i < 5; i++) {
    const shouldAnswerCorrectly = i < correctAnswers;
    const answer = shouldAnswerCorrectly ? levelAnswers[i] : 'wrong answer';

    await fillEditorAndCheck(page, answer, true);

    // Wait for automatic progression (except last question)
    if (i < 4) {
      await page.waitForTimeout(2000);
    }
  }

  // Should be on result page
  await expect(page).toHaveURL(/\/result/);

  // Wait for score animation
  await page.waitForTimeout(4000);

  // Take screenshot
  await page.screenshot({ path: `screenshots/${screenshotName}` });
}
