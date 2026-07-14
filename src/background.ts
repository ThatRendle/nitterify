// Service worker: keeps the dynamic redirect rules in sync with the configured
// instance. It only wakes to rebuild rules (install, browser start, or when the
// setting changes) — the actual redirecting is done natively by the DNR engine.

import { buildRules } from './rules';
import { DEFAULT_INSTANCE, STORAGE_KEY } from './instance';

async function getInstance(): Promise<string> {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  const value = stored[STORAGE_KEY];
  return typeof value === 'string' && value.length > 0 ? value : DEFAULT_INSTANCE;
}

async function syncRules(): Promise<void> {
  const instance = await getInstance();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules: buildRules(instance),
  });
}

chrome.runtime.onInstalled.addListener(() => {
  void syncRules();
});

chrome.runtime.onStartup.addListener(() => {
  void syncRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && STORAGE_KEY in changes) {
    void syncRules();
  }
});
