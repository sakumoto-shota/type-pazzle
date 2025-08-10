import { Page } from '@playwright/test';
import { ANSWERS } from './test-answers';

export async function playLevel(
  page: Page, 
  level: number, 
  correctAnswers: number, // 正解する問題数（80点なら4、100点なら5）
  screenshotName: string
) {
  const levelKey = `level${level}` as keyof typeof ANSWERS;
  const answers = ANSWERS[levelKey];
  
  // トップページへ
  await page.goto('http://localhost:3000');
  
  // クッキーをクリア
  await page.context().clearCookies();
  
  // Playページへ
  await page.click('text=ゲームを始める');
  await page.waitForURL('**/play');
  
  // レベルを選択
  await page.click(`text=Lv${level}`);
  await page.waitForTimeout(2000);
  
  // モナコエディタがロードされるまで待機
  await page.waitForSelector('.monaco-editor', { timeout: 10000 });
  
  // 指定された数の問題を正解
  for (let i = 0; i < correctAnswers; i++) {
    // Monaco Editorに回答を入力（Ctrl+A → Delete → Paste方式）
    await page.waitForSelector('.monaco-editor textarea');
    await page.locator('.monaco-editor textarea').focus();
    
    // 全選択してクリア
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    
    // 回答をペースト
    await page.locator('.monaco-editor textarea').fill(answers[i]);
    
    // 型チェック
    await page.click('text=型チェック');
    await page.waitForTimeout(3000);
  }
  
  // 残りの問題はスキップ
  for (let i = correctAnswers; i < 5; i++) {
    await page.click('text=次の問題へ');
    if (i < 4) { // 最後の問題でない場合は待機
      await page.waitForTimeout(2000);
    }
  }
  
  // 結果ページへ遷移するまで待機
  await page.waitForURL('**/result', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // スクリーンショットを撮る
  await page.screenshot({ path: `screenshots/${screenshotName}`, fullPage: true });
}