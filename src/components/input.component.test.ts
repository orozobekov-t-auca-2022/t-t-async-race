import { describe, it, expect } from 'vitest';
import { createInput } from './input.component';

describe('Input Component', () => {
  it('should create an input element', () => {
    const input = createInput();
    
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.type).toBe('text');
  });

  it('should use custom placeholder', () => {
    const input = createInput({ placeholder: 'Enter name' });
    
    expect(input.placeholder).toBe('Enter name');
  });

  it('should use default placeholder when not provided', () => {
    const input = createInput();
    
    expect(input.placeholder).toBe('Enter text here');
  });

  it('should have correct CSS class', () => {
    const input = createInput();
    
    expect(input.className).toBeTruthy();
  });
});