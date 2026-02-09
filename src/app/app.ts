import { createElement } from '../utils/dom';
import { createStore } from '../state/store/store';
import { initialState, type SortField, type SortOrder } from '../state/types';
import { Router } from '../router';
import { GarageView } from '../view/garage/garage.view';
import { WinnersView } from '../view/winners/winners.view';
import { createCar, updateCar, deleteCar } from '../api/garage.api';
import { startOrStopEngine, switchToDriveMode } from '../api/engine.api';
import { getWinnerById, createWinner, updateWinner } from '../api/winner.api';
import type { Car } from '../models/car.model';
import showWinnerMessage from '../components/winner-message.component';

function isSortField(value: unknown): value is SortField {
  return value === 'wins' || value === 'time';
}

export class App {
  private readonly store = createStore(initialState);
  private readonly router = new Router(this.store);

  private readonly root: HTMLDivElement;
  private readonly container: HTMLElement = createElement('main');
  private readonly nav: HTMLDivElement = createElement('div');
  private readonly content: HTMLDivElement = createElement('div');

  private readonly garageBtn: HTMLButtonElement = createElement('button');
  private readonly winnersBtn: HTMLButtonElement = createElement('button');
  private readonly garageView: GarageView;
  private readonly winnersView: WinnersView;

  private selectedCarId: number | null = null;
  private stoppedCars: Set<number> = new Set();

  public constructor(root: HTMLDivElement) {
    this.root = root;
    this.garageView = new GarageView(this.content);
    this.winnersView = new WinnersView(this.content);
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
    this.attachWinnersListeners();
    this.store.subscribe(() => this.render());
    this.render();
    this.router.start();
  }

  private render(): void {
    const state = this.store.getState();

    if (state.route === 'garage') {
      void this.renderGarage();
    } else if (state.route === 'winners') {
      void this.renderWinners();
    }
  }

  private async renderGarage(): Promise<void> {
    const page = this.store.getState().garagePage;
    await this.garageView.render(page);
  }

  private async renderWinners(): Promise<void> {
    const state = this.store.getState();
    await this.winnersView.render(state.winnersPage, state.winnersSort, state.winnersSortOrder);
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
          const createFieldset = button.closest('fieldset[data-form="create"]');
          if (createFieldset instanceof HTMLElement) void this.handleCreateCar(createFieldset);
          break;
        }
        case 'edit': {
          const editFieldset = button.closest('fieldset[data-form="edit"]');
          if (editFieldset instanceof HTMLElement) void this.handleEditCar(editFieldset);
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

    const editFieldset = this.content.querySelector('fieldset[data-form="edit"]');
    if (editFieldset instanceof HTMLFieldSetElement) {
      editFieldset.disabled = false;
    }

    const nameInput = editFieldset?.querySelector('input[type="text"]');
    const colorInput = editFieldset?.querySelector('input[type="color"]');

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

      const editFieldset = this.content.querySelector('fieldset[data-form="edit"]');
      if (editFieldset instanceof HTMLFieldSetElement) {
        editFieldset.disabled = true;
      }

      await this.renderGarage();
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

    try {
      startButton.disabled = true;

      const { velocity, distance } = await startOrStopEngine(carId, 'started');
      const duration = distance / velocity;

      this.animateCar(carPreview, duration);

      stopButton.disabled = false;

      const driveResult = await switchToDriveMode(carId);

      if (driveResult === 'engine failure') {
        this.stopCarAnimation(carPreview);

        return;
      }

      return duration * 1000;
    } catch (error) {
      console.error('Failed to start engine:', error);
      startButton.disabled = false;
      stopButton.disabled = true;
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

  private stopCarAnimation(carElement: HTMLElement): void {
    const parentElement = carElement.parentElement;
    if (!parentElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    const carRect = carElement.getBoundingClientRect();
    const currentX = carRect.left - parentRect.left;

    carElement.style.transition = 'none !important';
    carElement.style.animation = 'none !important';

    carElement.style.transform = `translateX(${currentX}px)`;

    void carElement.offsetHeight;
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

      this.stoppedCars.add(carId);

      await startOrStopEngine(carId, 'stopped');

      carPreview.style.transition = 'transform 0.5s ease';
      carPreview.style.transform = 'translateX(0)';

      startButton.disabled = false;
    } catch (error) {
      console.error('Failed to stop engine:', error);
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  }

  private async handleStartAll(): Promise<void> {
    const cars = this.garageView.getCars();
    const carTime = new Map<Car, number>();

    this.stoppedCars.clear();

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

    requestAnimationFrame(() => {
      const drivePromises: Promise<void>[] = [];
      let winnerDeclared = false;

      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;

        const { velocity, distance } = result.value;
        const car = cars[index];
        const carElement = this.content.querySelector(`[data-car-id="${car.id}"] [data-car-element="true"]`);

        if (!(carElement instanceof HTMLElement)) return;

        const duration = distance / velocity;

        this.animateCar(carElement, duration);
        carTime.set(car, duration);

        const drivePromise = switchToDriveMode(car.id).then(async (driveResult) => {
          if (driveResult === 'engine failure') {
            try {
              await startOrStopEngine(car.id, 'stopped');
            } catch (error) {
              console.error('Failed to stop engine:', error);
            }

            this.stopCarAnimation(carElement);
            this.stoppedCars.add(car.id);
            carTime.delete(car);
          } else {
            if (!winnerDeclared) {
              winnerDeclared = true;
              showWinnerMessage(car.name, duration / 1000);
              void this.saveWinner(car.id, duration / 1000);
            }

            setTimeout(() => {
              void startOrStopEngine(car.id, 'stopped').catch((error) => {
                console.error(`Failed to stop engine for car ${car.id}:`, error);
              });
            }, duration);
          }
        });
        drivePromises.push(drivePromise);
      });
    });
  }

  private async saveWinner(carId: number, time: number): Promise<void> {
    try {
      const existingWinner = await getWinnerById(carId);

      const newWins = existingWinner.wins + 1;
      const newBestTime = Math.min(existingWinner.time, time);
      await updateWinner(carId, newWins, newBestTime);
    } catch {
      try {
        await createWinner(carId, time);
      } catch (createError) {
        console.error('Failed to create winner:', createError);
      }
    }
  }

  private async handleResetAll(): Promise<void> {
    await Promise.all(this.garageView.getCars().map((car) => this.handleStopEngine(car.id)));
  }

  private attachWinnersListeners(): void {
    this.content.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest('button');

      if (!button) return;

      const action = button.dataset.action;

      switch (action) {
        case 'prev-winners': {
          void this.handlePrevWinnersPage();
          break;
        }
        case 'next-winners': {
          void this.handleNextWinnersPage();
          break;
        }
      }
    });

    this.content.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const th = target.closest('th[data-sort]');

      if (th instanceof HTMLElement && th.dataset.sort && isSortField(th.dataset.sort)) {
        void this.handleSort(th.dataset.sort);
      }
    });
  }

  private async handlePrevWinnersPage(): Promise<void> {
    const state = this.store.getState();
    if (state.winnersPage > 1) {
      this.store.setState({ winnersPage: state.winnersPage - 1 });
      await this.renderWinners();
    }
  }

  private async handleNextWinnersPage(): Promise<void> {
    const state = this.store.getState();
    this.store.setState({ winnersPage: state.winnersPage + 1 });
    await this.renderWinners();
  }

  private async handleSort(field: SortField): Promise<void> {
    const state = this.store.getState();
    let newOrder: SortOrder = 'DESC';

    if (state.winnersSort === field) {
      newOrder = state.winnersSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    this.store.setState({
      winnersSort: field,
      winnersSortOrder: newOrder,
      winnersPage: 1,
    });

    await this.renderWinners();
  }
}
