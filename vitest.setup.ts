/// <reference types="vitest/globals" />
/// <reference types="jsdom" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { JSDOM } from 'jsdom';

// DOMのセットアップ
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously',
});

// グローバルオブジェクトの設定
Object.defineProperty(globalThis, 'document', {
  value: dom.window.document,
  writable: true,
});
Object.defineProperty(globalThis, 'window', {
  value: dom.window,
  writable: true,
});
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  writable: true,
});

// テスト用のルート要素を作成
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

// グローバル変数のスタブ
vi.stubGlobal('React', React);
vi.stubGlobal('fetch', vi.fn());

// テスト環境の設定
vi.stubGlobal('document', dom.window.document);
vi.stubGlobal('window', dom.window);
vi.stubGlobal('navigator', dom.window.navigator); 