import { createElement } from '../utils/dom';
import { createStore } from '../state/store/store';
import { initialState } from '../state/types';
import { Router } from '../router';
import { GarageView } from '../view/garage/garage.view';
import { createCar, updateCar, deleteCar } from '../api/garage.api';
import { startOrStopEngine } from '../api/engine.api';
import type { Car } from '../models/car.model';
import showWinnerMessage from '../components/winner-message.component';

export class App {
  private readonly store = createStore(initialState);
  private readonly router = new Router(this.store);

  private readonly root: HTMLDivElement;
  private readonly container: HTMLDivElement = createElement('div');
  private readonly nav: HTMLDivElement = createElement('div');
  private readonly content: HTMLDivElement = createElement('div');

  private readonly garageBtn: HTMLButtonElement = createElement('button');
  private readonly winnersBtn: HTMLButtonElement = createElement('button');
  private readonly garageView: GarageView;

  private selectedCarId: number | null = null;

  public constructor(root: HTMLDivElement) {
    this.root = root;
    this.garageView = new GarageView(this.content);
  }

  public mount(): void {
    this.container.className = 'container';
    this.nav.className = 'nav';
    this.content.className = 'content';

    this.garageBtn.className = 'nav__btn';
    this.garageBtn.textContent = 'Garage';
    this.garageBtn.addEventListener('click', () => this.router.next('garage'));

    this.winnersBtn.className = 'nav__btn';
    this.winnersBtn.textContent = 'Winners';
    this.winnersBtn.addEventListener('click', () => this.router.next('winners'));

    this.nav.append(this.garageBtn, this.winnersBtn);
    this.container.append(this.nav, this.content);
    this.root.append(this.container);

    this.attachGarageListeners();
    this.store.subscribe(() => this.render());
    this.render();
    this.router.start();
  }

  private render(): void {
    const state = this.store.getState();

    if (state.route === 'garage') {
      void this.renderGarage();
    }
  }

  private async renderGarage(): Promise<void> {
    const page = this.store.getState().garagePage;
    await this.garageView.render(page);
  }

  private attachGarageListeners(): void {
    this.content.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest('button');

      if (!button) return;

      const action = button.dataset.action;
      const carElement = button.closest('[data-car-id]');
      const carId =
        carElement instanceof HTMLElement && carElement.dataset.carId ? Number(carElement.dataset.carId) : null;

      const formGroup = button.closest('.form-group');

      switch (action) {
        case 'select': {
          if (carId) void this.handleSelectCar(carId);
          break;
        }
        case 'delete': {
          if (carId) void this.handleDeleteCar(carId);
          break;
        }
        case 'generate': {
          void this.handleGenerateCars();
          break;
        }
        case 'create': {
          if (formGroup instanceof HTMLElement) void this.handleCreateCar(formGroup);
          break;
        }
        case 'edit': {
          if (formGroup instanceof HTMLElement) void this.handleEditCar(formGroup);
          break;
        }
        case 'prev': {
          void this.handlePrevPage();
          break;
        }
        case 'next': {
          void this.handleNextPage();
          break;
        }
        case 'start': {
          if (carId) void this.handleStartEngine(carId);
          break;
        }
        case 'stop': {
          if (carId) void this.handleStopEngine(carId);
          break;
        }
        case 'race': {
          void this.handleStartAll();
          break;
        }
        case 'reset': {
          void this.handleResetAll();
          break;
        }
        case 'startAll': {
          void this.handleStartAll();
          break;
        }
      }
    });
  }

  private async handleSelectCar(carId: number): Promise<void> {
    const cars = this.garageView.getCars();
    const car = cars.find((c) => c.id === carId);

    if (!car) return;

    this.selectedCarId = carId;

    const editFieldset = this.content.querySelector('fieldset:nth-of-type(2)');
    if (!(editFieldset instanceof HTMLFieldSetElement)) return;
    editFieldset.disabled = false;

    const editForm = this.content.querySelector('fieldset:nth-of-type(2) .form-group');
    if (!(editForm instanceof HTMLElement)) return;

    const nameInput = editForm?.querySelector('input[type="text"]');
    const colorInput = editForm?.querySelector('input[type="color"]');

    if (nameInput instanceof HTMLInputElement && colorInput instanceof HTMLInputElement) {
      nameInput.value = car.name;
      colorInput.value = car.color;
    }
  }

  private async handleDeleteCar(carId: number): Promise<void> {
    try {
      await deleteCar(carId);
      await this.renderGarage();
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  }

  private async handleCreateCar(form: HTMLElement): Promise<void> {
    const nameInput = form.querySelector('input[type="text"]');
    const colorInput = form.querySelector('input[type="color"]');

    if (!(nameInput instanceof HTMLInputElement) || !(colorInput instanceof HTMLInputElement)) return;

    const name = nameInput.value.trim();
    const color = colorInput.value;

    if (!name) {
      alert('Please enter a car name');
      return;
    }

    try {
      await createCar(name, color);
      nameInput.value = '';
      colorInput.value = '#000000';
      await this.renderGarage();
    } catch (error) {
      console.error('Failed to create car:', error);
    }
  }

  private async handleEditCar(form: HTMLElement): Promise<void> {
    if (!this.selectedCarId) {
      alert('Please select a car first');
      return;
    }

    const nameInput = form.querySelector('input[type="text"]');
    const colorInput = form.querySelector('input[type="color"]');

    if (!(nameInput instanceof HTMLInputElement) || !(colorInput instanceof HTMLInputElement)) return;

    const name = nameInput.value.trim();
    const color = colorInput.value;

    if (!name) {
      alert('Please enter a car name');
      return;
    }

    try {
      await updateCar(this.selectedCarId, name, color);
      this.selectedCarId = null;
      nameInput.value = '';
      colorInput.value = '#000000';
      await this.renderGarage();

      const editFieldset = this.content.querySelector('fieldset:nth-of-type(2)');
      if (!(editFieldset instanceof HTMLFieldSetElement)) return;
      editFieldset.disabled = true;
    } catch (error) {
      console.error('Failed to update car:', error);
    }
  }

  private async handleGenerateCars(): Promise<void> {
    const generateButton = this.content.querySelector('button[data-action="generate"]');
    if (!(generateButton instanceof HTMLButtonElement)) {
      return;
    }
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';
    try {
      await this.generateRandomCars(100);
      await this.renderGarage();
    } finally {
      generateButton.disabled = false;
      generateButton.textContent = 'Generate 100 Cars';
    }
  }

  private async generateRandomCars(count: number): Promise<void> {
    const carBrands = [
      'Ferrari',
      'Lamborghini',
      'McLaren',
      'BMW',
      'Audi',
      'Mercedes',
      'RedBull',
      'Tesla',
      'Toyota',
      'Nissan',
      'Aston Martin',
      'Bugatti',
      'Pagani',
      'Koenigsegg',
      'Porsche',
    ];
    const carModels = ['GT', 'Sport', 'X', 'Z', 'S', 'R', 'V', 'Q', 'L', 'M'];
    const carColors = [
      '#FF5733',
      '#33FF57',
      '#3357FF',
      '#F333FF',
      '#33FFF5',
      '#F5FF33',
      '#FF33A8',
      '#A833FF',
      '#33FFA8',
      '#FFA833',
    ];
    const createPromises = [];

    for (let i = 0; i < count; i++) {
      const name =
        carBrands[Math.floor(Math.random() * carBrands.length)] +
        ' ' +
        carModels[Math.floor(Math.random() * carModels.length)];
      const color = carColors[Math.floor(Math.random() * carColors.length)];
      createPromises.push(createCar(name, color));
    }
    await Promise.all(createPromises);
  }

  private async handlePrevPage(): Promise<void> {
    const state = this.store.getState();
    if (state.garagePage > 1) {
      this.store.setState({ garagePage: state.garagePage - 1 });
      await this.renderGarage();
    }
  }

  private async handleNextPage(): Promise<void> {
    const state = this.store.getState();
    this.store.setState({ garagePage: state.garagePage + 1 });
    await this.renderGarage();
  }

  private async handleStartEngine(carId: number): Promise<number | void> {
    const carElement = this.content.querySelector(`[data-car-id="${carId}"]`);
    if (!(carElement instanceof HTMLElement)) return;

    const startButton = carElement.querySelector('button[data-action="start"]');
    const stopButton = carElement.querySelector('button[data-action="stop"]');
    const carPreview = carElement.querySelector('[data-car-element="true"]');

    if (
      !(startButton instanceof HTMLButtonElement) ||
      !(stopButton instanceof HTMLButtonElement) ||
      !(carPreview instanceof HTMLElement)
    )
      return;

    startButton.disabled = false;
    stopButton.disabled = true;
    try {
      startButton.disabled = true;
      const { velocity, distance } = await startOrStopEngine(carId, 'started');
      const duration = distance / velocity;
      this.animateCar(carPreview, duration);
      stopButton.disabled = false;
      return duration * 1000;
    } catch (error) {
      console.error('Failed to start engine:', error);
    }
  }

  private animateCar(carElement: HTMLElement, duration: number): void {
    const road = carElement.parentElement;

    if (!(road instanceof HTMLElement)) return;

    const carWidth = carElement.offsetWidth;
    const roadWidth = road.offsetWidth;
    const distance = roadWidth - carWidth;

    carElement.style.transition = `transform ${duration}ms linear`;
    carElement.style.transform = `translateX(${distance}px)`;
  }

  private async handleStopEngine(carId: number): Promise<void> {
    const carElement = this.content.querySelector(`[data-car-id="${carId}"]`);

    if (!(carElement instanceof HTMLElement)) return;

    const startButton = carElement.querySelector('button[data-action="start"]');
    const stopButton = carElement.querySelector('button[data-action="stop"]');
    const carPreview = carElement.querySelector('[data-car-element="true"]');

    if (
      !(startButton instanceof HTMLButtonElement) ||
      !(stopButton instanceof HTMLButtonElement) ||
      !(carPreview instanceof HTMLElement)
    )
      return;

    try {
      stopButton.disabled = true;
      await startOrStopEngine(carId, 'stopped');
      carPreview.style.transition = '';
      carPreview.style.transform = 'translateX(0)';
      startButton.disabled = false;
    } catch (error) {
      console.error('Failed to stop engine:', error);
    }
  }

  private async handleStartAll(): Promise<void> {
    const cars = this.garageView.getCars();
    const carTime = new Map<Car, number>();

    const results = await Promise.allSettled(cars.map((car) => startOrStopEngine(car.id, 'started')));

    results.forEach((result, index) => {
      if (result.status !== 'fulfilled') return;

      const car = cars[index];
      const carElement = this.content.querySelector(`[data-car-id="${car.id}"] [data-car-element="true"]`);

      if (!(carElement instanceof HTMLElement)) return;

      carElement.style.transition = 'none';
      carElement.style.transform = 'translateX(0)';
      void carElement.offsetWidth;
    });

    const resetButton = this.content.querySelector('button[data-action="reset"]');
    const startAllButton = this.content.querySelector('button[data-action="race"]');
    if (startAllButton instanceof HTMLButtonElement) {
      startAllButton.disabled = true;
    }
    if (resetButton instanceof HTMLButtonElement) {
      resetButton.disabled = false;
    }

    requestAnimationFrame(() => {
      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;

        const { velocity, distance } = result.value;
        const car = cars[index];
        const carElement = this.content.querySelector(`[data-car-id="${car.id}"] [data-car-element="true"]`);

        if (!(carElement instanceof HTMLElement)) return;

        const duration = distance / velocity;

        this.animateCar(carElement, duration);
        carTime.set(car, duration);
      });

      let winner: Car | null = null;
      let minTime = Infinity;

      for (const [car, time] of carTime) {
        if (time < minTime) {
          minTime = time;
          winner = car;
        }
      }

      if (winner) {
        setTimeout(() => {
          showWinnerMessage(winner.name, minTime);
        }, minTime);
      }
    });
  }

  private async handleResetAll(): Promise<void> {
    await Promise.all(this.garageView.getCars().map((car) => this.handleStopEngine(car.id)));
    const resetButton = this.content.querySelector('button[data-action="reset"]');
    const startAllButton = this.content.querySelector('button[data-action="race"]');
    if (startAllButton instanceof HTMLButtonElement) {
      startAllButton.disabled = false;
    }
    if (resetButton instanceof HTMLButtonElement) {
      resetButton.disabled = true;
    }
  }
}
