import { describe, it, expect } from 'vitest';
import { createElement, setText, clear } from './dom';

describe('DOM Utils', () => {
  describe('createElement', () => {
    it('should create an HTML element with the specified tag', () => {
      const div = createElement('div');
      expect(div).toBeInstanceOf(HTMLDivElement);
      expect(div.tagName).toBe('DIV');
    });

    it('should create different types of elements', () => {
      const button = createElement('button');
      const input = createElement('input');
      
      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(input).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('setText', () => {
    it('should set text content of an element', () => {
      const div = createElement('div');
      setText(div, 'Hello World');
      
      expect(div.textContent).toBe('Hello World');
    });

    it('should replace existing text content', () => {
      const div = createElement('div');
      div.textContent = 'Old Text';
      setText(div, 'New Text');
      
      expect(div.textContent).toBe('New Text');
    });
  });

  describe('clear', () => {
    it('should remove the first child of an element', () => {
      const container = createElement('div');
      const child1 = createElement('span');
      const child2 = createElement('span');
      
      container.append(child1);
      container.append(child2);
      
      clear(container);
      
      expect(container.children.length).toBe(1);
      expect(container.firstChild).toBe(child2);
    });

    it('should do nothing if element has no children', () => {
      const div = createElement('div');
      clear(div);
      
      expect(div.children.length).toBe(0);
    });
  });
});