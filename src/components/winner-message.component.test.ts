import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import showWinnerMessage from './winner-message.component';

describe('Winner Message Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('message creation', () => {
    it('should create and append message to body', () => {
      showWinnerMessage('Tesla', 10.5);

      const container = document.querySelector('div');
      expect(container).toBeTruthy();
      expect(document.body.contains(container)).toBe(true);
    });

    it('should display correct car name and time', () => {
      showWinnerMessage('BMW', 12.34);

      const message = document.querySelector('h2');
      expect(message?.textContent).toBe('Car BMW wins! Time: 12.34 seconds');
    });

    it('should format time with 2 decimal places', () => {
      showWinnerMessage('Audi', 8.123456);

      const message = document.querySelector('h2');
      expect(message?.textContent).toBe('Car Audi wins! Time: 8.12 seconds');
    });

    it('should handle different car names', () => {
      showWinnerMessage('Mercedes-Benz', 15.99);

      const message = document.querySelector('h2');
      expect(message?.textContent).toContain('Mercedes-Benz');
    });
  });

  describe('message removal', () => {
    it('should remove message after 3 seconds', () => {
      showWinnerMessage('Tesla', 10.5);

      const containerBefore = document.querySelector('div');
      expect(containerBefore).toBeTruthy();

      vi.advanceTimersByTime(3000);

      const containerAfter = document.querySelector('div');
      expect(containerAfter).toBeFalsy();
    });

    it('should not remove message before 3 seconds', () => {
      showWinnerMessage('BMW', 12.34);

      vi.advanceTimersByTime(2999);

      const container = document.querySelector('div');
      expect(container).toBeTruthy();
    });

    it('should remove only after exactly 3000ms', () => {
      showWinnerMessage('Audi', 8.12);

      vi.advanceTimersByTime(2999);
      expect(document.querySelector('div')).toBeTruthy();

      vi.advanceTimersByTime(1);
      expect(document.querySelector('div')).toBeFalsy();
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes to container', () => {
      showWinnerMessage('Tesla', 10.5);

      const container = document.querySelector('div');
      expect(container?.className).toBeTruthy();
    });

    it('should apply correct CSS classes to message', () => {
      showWinnerMessage('BMW', 12.34);

      const message = document.querySelector('h2');
      expect(message?.className).toBeTruthy();
    });
  });
});
