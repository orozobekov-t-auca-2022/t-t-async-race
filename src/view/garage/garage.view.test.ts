import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showGarageView, GarageView } from './garage.view';
import { CARS_PER_PAGE } from '../../constants';
import * as garageApi from '../../api/garage.api';

// Mock API
vi.mock('../../api/garage.api', () => ({
  getAllCars: vi.fn(),
}));

describe('Garage View', () => {
  describe('showGarageView', () => {
    it('should create garage view container', () => {
      const cars: HTMLElement[] = [];
      const view = showGarageView(cars);

      expect(view).toBeInstanceOf(HTMLElement);
    });

    it('should render with provided cars', () => {
      const car1 = document.createElement('div');
      car1.textContent = 'Car 1';
      const car2 = document.createElement('div');
      car2.textContent = 'Car 2';

      const view = showGarageView([car1, car2]);

      expect(view.textContent).toContain('Car 1');
      expect(view.textContent).toContain('Car 2');
    });

    it('should have garage title', () => {
      const view = showGarageView([]);
      const title = view.querySelector('h2');

      expect(title?.textContent).toBe('Garage');
    });

    it('should contain pagination buttons', () => {
      const view = showGarageView([]);
      const buttons = view.querySelectorAll('button');

      const buttonTexts = [...buttons].map((b) => b.textContent);
      expect(buttonTexts).toContain('Prev');
      expect(buttonTexts).toContain('Next');
    });

    it('should render with empty car list', () => {
      const view = showGarageView([]);

      expect(view).toBeTruthy();
    });

    it('should have form section', () => {
      const view = showGarageView([]);
      const form = view.querySelector('form');

      expect(form).toBeTruthy();
    });
  });

  describe('GarageView class', () => {
    let container: HTMLElement;
    let garageView: GarageView;

    beforeEach(() => {
      container = document.createElement('div');
      garageView = new GarageView(container);

      vi.mocked(garageApi.getAllCars).mockResolvedValue({
        cars: [
          { id: 1, name: 'Tesla', color: '#ff0000' },
          { id: 2, name: 'BMW', color: '#0000ff' },
        ],
        total: 2,
      });
    });

    it('should create instance', () => {
      expect(garageView).toBeInstanceOf(GarageView);
    });

    it('should render garage view', async () => {
      await garageView.render(1);

      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should call getAllCars API', async () => {
      await garageView.render(1);

      expect(garageApi.getAllCars).toHaveBeenCalled();
    });

    it('should handle pagination', async () => {
      await garageView.render(2);

      expect(garageApi.getAllCars).toHaveBeenCalledWith(2, CARS_PER_PAGE);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(garageApi.getAllCars).mockRejectedValue(new Error('API Error'));

      await garageView.render(1);

      expect(container.textContent).toContain('Error');
    });

    it('should render different pages', async () => {
      await garageView.render(1);
      expect(garageApi.getAllCars).toHaveBeenCalledWith(1, CARS_PER_PAGE);

      await garageView.render(3);
      expect(garageApi.getAllCars).toHaveBeenCalledWith(3, CARS_PER_PAGE);
    });

    it('should expose getCars method', async () => {
      await garageView.render(1);

      const cars = garageView.getCars();

      expect(cars).toEqual([
        { id: 1, name: 'Tesla', color: '#ff0000' },
        { id: 2, name: 'BMW', color: '#0000ff' },
      ]);
    });
  });
});import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showGarageView, GarageView } from './garage.view';
import { CARS_PER_PAGE } from '../../constants';
import * as garageApi from '../../api/garage.api';

// Mock API
vi.mock('../../api/garage.api', () => ({
  getAllCars: vi.fn(),
}));

describe('Garage View', () => {
  describe('showGarageView', () => {
    it('should create garage view container', () => {
      const cars: HTMLElement[] = [];
      const view = showGarageView(cars);

      expect(view).toBeInstanceOf(HTMLElement);
    });

    it('should render with provided cars', () => {
      const car1 = document.createElement('div');
      car1.textContent = 'Car 1';
      const car2 = document.createElement('div');
      car2.textContent = 'Car 2';

      const view = showGarageView([car1, car2]);

      expect(view.textContent).toContain('Car 1');
      expect(view.textContent).toContain('Car 2');
    });

    it('should have garage title', () => {
      const view = showGarageView([]);
      const title = view.querySelector('h2');

      expect(title?.textContent).toBe('Garage');
    });

    it('should contain pagination buttons', () => {
      const view = showGarageView([]);
      const buttons = view.querySelectorAll('button');

      const buttonTexts = [...buttons].map((b) => b.textContent);
      expect(buttonTexts).toContain('Prev');
      expect(buttonTexts).toContain('Next');
    });

    it('should render with empty car list', () => {
      const view = showGarageView([]);

      expect(view).toBeTruthy();
    });

    it('should have form section', () => {
      const view = showGarageView([]);
      const form = view.querySelector('form');

      expect(form).toBeTruthy();
    });
  });

  describe('GarageView class', () => {
    let container: HTMLElement;
    let garageView: GarageView;

    beforeEach(() => {
      container = document.createElement('div');
      garageView = new GarageView(container);

      vi.mocked(garageApi.getAllCars).mockResolvedValue({
        cars: [
          { id: 1, name: 'Tesla', color: '#ff0000' },
          { id: 2, name: 'BMW', color: '#0000ff' },
        ],
        total: 2,
      });
    });

    it('should create instance', () => {
      expect(garageView).toBeInstanceOf(GarageView);
    });

    it('should render garage view', async () => {
      await garageView.render(1);

      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should call getAllCars API', async () => {
      await garageView.render(1);

      expect(garageApi.getAllCars).toHaveBeenCalled();
    });

    it('should handle pagination', async () => {
      await garageView.render(2);

      expect(garageApi.getAllCars).toHaveBeenCalledWith(2, CARS_PER_PAGE);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(garageApi.getAllCars).mockRejectedValue(new Error('API Error'));

      await garageView.render(1);

      expect(container.textContent).toContain('Error');
    });

    it('should render different pages', async () => {
      await garageView.render(1);
      expect(garageApi.getAllCars).toHaveBeenCalledWith(1, CARS_PER_PAGE);

      await garageView.render(3);
      expect(garageApi.getAllCars).toHaveBeenCalledWith(3, CARS_PER_PAGE);
    });

    it('should expose getCars method', async () => {
      await garageView.render(1);

      const cars = garageView.getCars();

      expect(cars).toEqual([
        { id: 1, name: 'Tesla', color: '#ff0000' },
        { id: 2, name: 'BMW', color: '#0000ff' },
      ]);
    });
  });
});import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showGarageView, GarageView } from './garage.view';
import { CARS_PER_PAGE } from '../../constants';
import { CARS_PER_PAGE } from '../../constants';
import * as garageApi from '../../api/garage.api';

// Mock API
vi.mock('../../api/garage.api', () => ({
  getAllCars: vi.fn(),
}));

describe('Garage View', () => {
  describe('showGarageView', () => {
    it('should create garage view container', () => {
      const cars: HTMLElement[] = [];
      const view = showGarageView(cars);

      expect(view).toBeInstanceOf(HTMLElement);
    });

    it('should render with provided cars', () => {
      const car1 = document.createElement('div');
      car1.textContent = 'Car 1';
      const car2 = document.createElement('div');
      car2.textContent = 'Car 2';

      const view = showGarageView([car1, car2]);

      expect(view.textContent).toContain('Car 1');
      expect(view.textContent).toContain('Car 2');
    });

    it('should have garage title', () => {
      const view = showGarageView([]);
      const title = view.querySelector('h2');

      expect(title?.textContent).toBe('Garage');
    });

    it('should contain pagination buttons', () => {
      const view = showGarageView([]);
      const buttons = view.querySelectorAll('button');

      const buttonTexts = [...buttons].map((b) => b.textContent);
      expect(buttonTexts).toContain('Prev');
      expect(buttonTexts).toContain('Next');
    });

    it('should render with empty car list', () => {
      const view = showGarageView([]);

      expect(view).toBeTruthy();
    });

    it('should have form section', () => {
      const view = showGarageView([]);
      const form = view.querySelector('form');

      expect(form).toBeTruthy();
    });
  });

  describe('GarageView class', () => {
    let container: HTMLElement;
    let garageView: GarageView;

    beforeEach(() => {
      container = document.createElement('div');
      garageView = new GarageView(container);

      vi.mocked(garageApi.getAllCars).mockResolvedValue({
        cars: [
          { id: 1, name: 'Tesla', color: '#ff0000' },
          { id: 2, name: 'BMW', color: '#0000ff' },
        ],
        total: 2,
      });
    });

    it('should create instance', () => {
      expect(garageView).toBeInstanceOf(GarageView);
    });

    it('should render garage view', async () => {
      await garageView.render(1);

      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should call getAllCars API', async () => {
      await garageView.render(1);

      expect(garageApi.getAllCars).toHaveBeenCalled();
    });

    it('should handle pagination', async () => {
      await garageView.render(2);

      expect(garageApi.getAllCars).toHaveBeenCalledWith(2, CARS_PER_PAGE);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(garageApi.getAllCars).mockRejectedValue(new Error('API Error'));

      await garageView.render(1);

      expect(container.textContent).toContain('Error');
    });

    it('should render different pages', async () => {
      await garageView.render(1);
      expect(garageApi.getAllCars).toHaveBeenCalledWith(1, CARS_PER_PAGE);

      await garageView.render(3);
      expect(garageApi.getAllCars).toHaveBeenCalledWith(3, CARS_PER_PAGE);
    });

    it('should expose getCars method', async () => {
      await garageView.render(1);
      
      const cars = garageView.getCars();
      
      expect(cars).toEqual([
        { id: 1, name: 'Tesla', color: '#ff0000' },
        { id: 2, name: 'BMW', color: '#0000ff' },
      ]);
    });
  });
});
