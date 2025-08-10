const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // テスト用のデータをCookieにセット
  await context.addCookies([
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
            { puzzleIndex: 0, isCorrect: true, explanation: 'User型はnameとageを持つオブジェクト型を完成させます。', code: 'type User = ???;' },
            { puzzleIndex: 1, isCorrect: true, explanation: 'Point型はxとyを持つ二次元座標を表します。', code: 'type Point = ???;' },
            { puzzleIndex: 2, isCorrect: false, explanation: 'greetは文字列を返す関数型を指定します。', code: 'const greet: ??? = (name) => `Hello`;' },
            { puzzleIndex: 3, isCorrect: true, explanation: 'ジェネリック型Pairは同種の2要素のタプルを表します。', code: 'type Pair<T> = ???;' },
            { puzzleIndex: 4, isCorrect: true, explanation: 'DogはAnimalを継承してbarkメソッドを追加します。', code: 'interface Dog extends ??? { bark(): void }' },
          ],
        },
      ])),
      domain: 'localhost',
      path: '/',
    },
  ]);

  // リザルト画面に遷移
  await page.goto('http://localhost:3002/result?level=1');
  await page.waitForSelector('h2:has-text("Lv1 結果")');
  await page.waitForTimeout(1000);
  
  // スクリーンショットを撮影
  await page.screenshot({ 
    path: 'screenshots/result-screen.png',
    fullPage: true 
  });
  
  console.log('スクリーンショットを保存しました: screenshots/result-screen.png');
  
  await browser.close();
})();