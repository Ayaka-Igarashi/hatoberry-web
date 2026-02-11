import { test, expect } from '@playwright/test';

// chatページのテスト

test('send', async ({ page }) => {
  await page.goto('/chat');

  // テキストボックスとボタンを取得
  const input = page.locator('input[type="text"]');
  const button = page.getByRole('button', { name: /send/i });

  // テスト用のテキスト
  const testText = 'Test Message';

  // テキストを入力して送信
  await input.fill(testText);
  await button.click();

  // 送信後に少し待つ（WebSocketやAPI反映待ち）
  await page.waitForTimeout(1000);

  // スクリーンショットを保存
  // await page.screenshot({ path: 'test-results/chat-page/chat-page-after-send.png', fullPage: true });

  // 最後のメッセージが送信テキストであることのみを検証
  await expect(page.locator('.message').last()).toHaveText(testText);
});
