import { describe, it, expect, vi } from 'vitest';
import { createButton } from './button.component';

describe('Button Component', () => {
  it('should create a button element with text', () => {
    const button = createButton({ text: 'Click me' });
    
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.textContent).toBe('Click me');
    expect(button.type).toBe('button');
  });

  it('should set button type', () => {
    const submitButton = createButton({ text: 'Submit', type: 'submit' });
    
    expect(submitButton.type).toBe('submit');
  });

  it('should disable button when disabled prop is true', () => {
    const button = createButton({ text: 'Disabled', disabled: true });
    
    expect(button.disabled).toBe(true);
  });

  it('should not be disabled by default', () => {
    const button = createButton({ text: 'Enabled' });
    
    expect(button.disabled).toBe(false);
  });

  it('should attach click event handler', () => {
    const onClick = vi.fn();
    const button = createButton({ text: 'Click', onClick });
    
    button.click();
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct CSS class', () => {
    const button = createButton({ text: 'Test' });
    
    expect(button.className).toBeTruthy();
  });
});