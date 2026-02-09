import { describe, it, expect } from 'vitest';
import { createColorInput } from './color-input.component';

describe('Color Input Component', () => {
  describe('basic creation', () => {
    it('should create a color input element', () => {
      const input = createColorInput();

      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input.type).toBe('color');
    });

    it('should have color type', () => {
      const input = createColorInput({});

      expect(input.type).toBe('color');
    });
  });

  describe('placeholder', () => {
    it('should use custom placeholder', () => {
      const input = createColorInput({ placeholder: 'Select color' });

      expect(input.placeholder).toBe('Select color');
    });

    it('should use default placeholder when not provided', () => {
      const input = createColorInput();

      expect(input.placeholder).toBe('Enter text here');
    });

    it('should use default placeholder with empty object', () => {
      const input = createColorInput({});

      expect(input.placeholder).toBe('Enter text here');
    });

    it('should handle different placeholder values', () => {
      const input1 = createColorInput({ placeholder: 'Pick a color' });
      const input2 = createColorInput({ placeholder: 'Car color' });

      expect(input1.placeholder).toBe('Pick a color');
      expect(input2.placeholder).toBe('Car color');
    });
  });

  describe('CSS class', () => {
    it('should have correct CSS class', () => {
      const input = createColorInput();

      expect(input.className).toBeTruthy();
      expect(typeof input.className).toBe('string');
    });
  });

  describe('color behavior', () => {
    it('should accept color value', () => {
      const input = createColorInput();

      input.value = '#ff0000';

      expect(input.value).toBe('#ff0000');
    });

    it('should start with empty or default value', () => {
      const input = createColorInput();

      expect(typeof input.value).toBe('string');
    });
  });

  describe('integration', () => {
    it('should create fully configured color input', () => {
      const input = createColorInput({ placeholder: 'Choose car color' });

      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input.type).toBe('color');
      expect(input.placeholder).toBe('Choose car color');
      expect(input.className).toBeTruthy();
    });
  });
});
