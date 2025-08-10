import { test, expect } from '@playwright/test';

test('リザルト画面のスクリーンショット', async ({ page }) => {
  // テスト用のデータをCookieにセット
  await page.context().addCookies([
    {
      name: 'scores',
      value: '80-60-40-20-100',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'level',
      value: '1',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'results',
      value: encodeURIComponent(JSON.stringify([
        {
          level: 1,
          results: [
            { puzzleIndex: 0, isCorrect: true, explanation: 'User型はnameとageを持つオブジェクト型を完成させます。', code: 'type User = ???;\\nconst u: User = { name: "Taro", age: 20 };' },
            { puzzleIndex: 1, isCorrect: true, explanation: 'Point型はxとyを持つ二次元座標を表します。', code: 'type Point = ???;\\nconst p: Point = { x: 1, y: 2 };' },
            { puzzleIndex: 2, isCorrect: false, explanation: 'greetは文字列を返す関数型を指定します。', code: 'const greet: ??? = (name: string) => `Hello, ${name}`;' },
            { puzzleIndex: 3, isCorrect: true, explanation: 'ジェネリック型Pairは同種の2要素のタプルを表します。', code: 'type Pair<T> = ???;\\nconst pair: Pair<number> = [1, 2];' },
            { puzzleIndex: 4, isCorrect: true, explanation: 'DogはAnimalを継承してbarkメソッドを追加します。', code: 'interface Animal { name: string }\\ninterface Dog extends ??? { bark(): void }' },
          ],
        },
      ])),
      domain: 'localhost',
      path: '/',
    },
  ]);

  // リザルト画面に遷移
  await page.goto('/result?level=1');
  
  // ページが読み込まれるまで待機
  await page.waitForSelector('h2:has-text("Lv1 結果")');
  
  // アニメーションが完了するまで少し待機
  await page.waitForTimeout(1000);
  
  // スクリーンショットを撮影
  await page.screenshot({ 
    path: 'screenshots/result-screen-level.png',
    fullPage: true 
  });
  
  // アコーディオンを開く
  await page.click('button:has-text("問題 1")');
  await page.waitForTimeout(500);
  
  await page.click('button:has-text("問題 3")');
  await page.waitForTimeout(500);
  
  // 詳細が表示された状態でスクリーンショット
  await page.screenshot({ 
    path: 'screenshots/result-screen-details.png',
    fullPage: true 
  });
  
  // 全体結果画面
  await page.goto('/result');
  await page.waitForSelector('h2:has-text("結果")');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ 
    path: 'screenshots/result-screen-all.png',
    fullPage: true 
  });
});

test('問題画面からリザルト画面への遷移', async ({ page }) => {
  // play画面に遷移
  await page.goto('/play?level=1');
  await page.waitForSelector('h2:has-text("TypeScript 型パズル")');
  
  // 型チェックボタンをクリック（5回）
  for (let i = 0; i < 5; i++) {
    await page.click('button:has-text("型チェック")');
    await page.waitForTimeout(1000);
  }
  
  // リザルト画面に遷移しているか確認
  await expect(page).toHaveURL(/.*\/result/);
  
  // リザルト画面のスクリーンショット
  await page.screenshot({ 
    path: 'screenshots/result-screen-after-play.png',
    fullPage: true 
  });
});