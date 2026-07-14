import { DEFAULT_INSTANCE, STORAGE_KEY, normalizeInstance } from './instance';

const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('instance') as HTMLInputElement;
const status = document.getElementById('status') as HTMLParagraphElement;

async function load(): Promise<void> {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  const value = stored[STORAGE_KEY];
  input.value = typeof value === 'string' && value.length > 0 ? value : DEFAULT_INSTANCE;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = normalizeInstance(input.value);
  input.value = value; // reflect the normalized value back to the user
  void chrome.storage.sync.set({ [STORAGE_KEY]: value }).then(() => {
    status.textContent = `Saved — x.com links now redirect to ${value}`;
  });
});

void load();
