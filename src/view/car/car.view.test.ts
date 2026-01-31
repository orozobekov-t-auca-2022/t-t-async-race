import { describe, it, expect } from 'vitest';
import { createCarView, createCarSVG } from './car.view';
import type { Car } from '../../models/car.model';

describe('Car View', () => {
  const mockCar: Car = {
    id: 1,
    name: 'Tesla Model S',
    color: '#ff0000',
  };

  describe('createCarView', () => {
    it('should create a car view element', () => {
      const carView = createCarView(mockCar);

      expect(carView).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct car id in dataset', () => {
      const carView = createCarView(mockCar);

      expect(carView.dataset.carId).toBe('1');
    });

    it('should display car name', () => {
      const carView = createCarView(mockCar);
      const nameElement = carView.querySelector('span');

      expect(nameElement?.textContent).toBe('Tesla Model S');
    });

    it('should contain select button', () => {
      const carView = createCarView(mockCar);
      const selectButton = carView.querySelector('[data-action="select"]');

      expect(selectButton).toBeTruthy();
      expect(selectButton?.textContent).toBe('Select');
    });

    it('should contain delete button', () => {
      const carView = createCarView(mockCar);
      const deleteButton = carView.querySelector('[data-action="delete"]');

      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.textContent).toBe('Delete');
    });

    it('should contain start button', () => {
      const carView = createCarView(mockCar);
      const startButton = carView.querySelector('[data-action="start"]');

      expect(startButton).toBeTruthy();
      expect(startButton?.textContent).toBe('A');
    });

    it('should contain stop button', () => {
      const carView = createCarView(mockCar);
      const stopButton = carView.querySelector('[data-action="stop"]');

      expect(stopButton).toBeTruthy();
      expect(stopButton?.textContent).toBe('B');
    });

    it('should have stop button disabled by default', () => {
      const carView = createCarView(mockCar);
      const stopButton = carView.querySelector('[data-action="stop"]');

      expect(stopButton).toBeInstanceOf(HTMLButtonElement);
      if (!(stopButton instanceof HTMLButtonElement)) {
        throw new TypeError('Expected stop button to be HTMLButtonElement');
      }

      expect(stopButton.disabled).toBe(true);
    });

    it('should contain car preview element', () => {
      const carView = createCarView(mockCar);
      const carPreview = carView.querySelector('[data-car-element="true"]');

      expect(carPreview).toBeTruthy();
    });

    it('should contain SVG elements', () => {
      const carView = createCarView(mockCar);
      const svg = carView.querySelector('svg');

      expect(svg).toBeTruthy();
    });

    it('should create different views for different cars', () => {
      const car1 = createCarView({ id: 1, name: 'Car 1', color: '#ff0000' });
      const car2 = createCarView({ id: 2, name: 'Car 2', color: '#00ff00' });

      expect(car1.dataset.carId).toBe('1');
      expect(car2.dataset.carId).toBe('2');
    });
  });

  describe('createCarSVG', () => {
    it('should create an SVG element', () => {
      const svg = createCarSVG('#ff0000');

      expect(svg).toBeInstanceOf(SVGElement);
      expect(svg.tagName.toLowerCase()).toBe('svg');
    });

    it('should set correct color', () => {
      const svg = createCarSVG('#00ff00');

      expect(svg.getAttribute('fill')).toBe('#00ff00');
    });

    it('should have viewBox attribute', () => {
      const svg = createCarSVG('#ff0000');

      expect(svg.getAttribute('viewBox')).toBe('0 0 324.018 324.017');
    });

    it('should contain SVG paths', () => {
      const svg = createCarSVG('#ff0000');

      expect(svg.innerHTML).toContain('<path');
    });

    it('should handle different colors', () => {
      const red = createCarSVG('#ff0000');
      const blue = createCarSVG('#0000ff');
      const green = createCarSVG('#00ff00');

      expect(red.getAttribute('fill')).toBe('#ff0000');
      expect(blue.getAttribute('fill')).toBe('#0000ff');
      expect(green.getAttribute('fill')).toBe('#00ff00');
    });

    it('should create valid SVG structure', () => {
      const svg = createCarSVG('#ff0000');
      const paths = svg.querySelectorAll('path');

      expect(paths.length).toBeGreaterThan(0);
    });
  });
});
