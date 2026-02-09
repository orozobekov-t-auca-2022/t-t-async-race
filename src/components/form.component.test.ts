import { describe, it, expect } from 'vitest';
import { createForm } from './form.component';

describe('Form Component', () => {
  describe('basic structure', () => {
    it('should create a form element', () => {
      const form = createForm();

      expect(form).toBeInstanceOf(HTMLFormElement);
    });

    it('should have correct CSS class', () => {
      const form = createForm();

      expect(form.className).toBeTruthy();
    });
  });

  describe('create car fieldset', () => {
    it('should contain create fieldset', () => {
      const form = createForm();
      const createFieldset = form.querySelector('[data-form="create"]');

      expect(createFieldset).toBeInstanceOf(HTMLFieldSetElement);
    });

    it('should have create legend', () => {
      const form = createForm();
      const legend = form.querySelector('[data-form="create"] legend');

      expect(legend?.textContent).toBe('Create Car');
    });

    it('should contain create button with correct action', () => {
      const form = createForm();
      const createButton = form.querySelector('[data-action="create"]');

      expect(createButton).toBeInstanceOf(HTMLButtonElement);
      expect(createButton?.textContent).toBe('Add Car');
    });

    it('should not be disabled by default', () => {
      const form = createForm();
      const createFieldset = form.querySelector('[data-form="create"]');

      expect(createFieldset).toBeInstanceOf(HTMLFieldSetElement);
      if (!(createFieldset instanceof HTMLFieldSetElement)) {
        throw new TypeError('Expected create fieldset to be HTMLFieldSetElement');
      }

      expect(createFieldset.disabled).toBe(false);
    });
  });

  describe('edit car fieldset', () => {
    it('should contain edit fieldset', () => {
      const form = createForm();
      const editFieldset = form.querySelector('[data-form="edit"]');

      expect(editFieldset).toBeInstanceOf(HTMLFieldSetElement);
    });

    it('should have edit legend', () => {
      const form = createForm();
      const legend = form.querySelector('[data-form="edit"] legend');

      expect(legend?.textContent).toBe('Edit Car');
    });

    it('should be disabled by default', () => {
      const form = createForm();
      const editFieldset = form.querySelector('[data-form="edit"]');

      expect(editFieldset).toBeInstanceOf(HTMLFieldSetElement);
      if (!(editFieldset instanceof HTMLFieldSetElement)) {
        throw new TypeError('Expected edit fieldset to be HTMLFieldSetElement');
      }

      expect(editFieldset.disabled).toBe(true);
    });

    it('should contain edit button with correct action', () => {
      const form = createForm();
      const editButton = form.querySelector('[data-action="edit"]');

      expect(editButton).toBeInstanceOf(HTMLButtonElement);
      expect(editButton?.textContent).toBe('Edit Car');
    });
  });

  describe('form actions', () => {
    it('should contain race button', () => {
      const form = createForm();
      const raceButton = form.querySelector('[data-action="race"]');

      expect(raceButton).toBeInstanceOf(HTMLButtonElement);
      expect(raceButton?.textContent).toBe('Race');
    });

    it('should contain reset button', () => {
      const form = createForm();
      const resetButton = form.querySelector('[data-action="reset"]');

      expect(resetButton).toBeInstanceOf(HTMLButtonElement);
      expect(resetButton?.textContent).toBe('Reset');
      expect(resetButton?.id).toBe('reset-button');
    });

    it('should contain generate button', () => {
      const form = createForm();
      const generateButton = form.querySelector('[data-action="generate"]');

      expect(generateButton).toBeInstanceOf(HTMLButtonElement);
      expect(generateButton?.textContent).toBe('Generate Cars');
    });
  });

  describe('input fields', () => {
    it('should contain input fields in create fieldset', () => {
      const form = createForm();
      const createFieldset = form.querySelector('[data-form="create"]');
      if (!createFieldset) {
        throw new Error('Expected create fieldset');
      }

      const inputs = createFieldset.querySelectorAll('input');

      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should contain input fields in edit fieldset', () => {
      const form = createForm();
      const editFieldset = form.querySelector('[data-form="edit"]');
      if (!editFieldset) {
        throw new Error('Expected edit fieldset');
      }

      const inputs = editFieldset.querySelectorAll('input');

      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('integration', () => {
    it('should have all required elements', () => {
      const form = createForm();

      expect(form.querySelector('[data-form="create"]')).toBeTruthy();
      expect(form.querySelector('[data-form="edit"]')).toBeTruthy();

      expect(form.querySelector('[data-action="create"]')).toBeTruthy();
      expect(form.querySelector('[data-action="edit"]')).toBeTruthy();
      expect(form.querySelector('[data-action="race"]')).toBeTruthy();
      expect(form.querySelector('[data-action="reset"]')).toBeTruthy();
      expect(form.querySelector('[data-action="generate"]')).toBeTruthy();
    });

    it('should have proper nesting structure', () => {
      const form = createForm();
      const fieldsets = form.querySelectorAll('fieldset');

      expect(fieldsets.length).toBe(2);
      expect(form.children.length).toBeGreaterThanOrEqual(3);
    });
  });
});
