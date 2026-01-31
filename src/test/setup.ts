import { afterEach, vi } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

const mockConsole = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

Object.assign(globalThis.console, mockConsole);