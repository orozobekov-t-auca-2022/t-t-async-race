import { createElement } from '../utils/dom';
import { createStore } from '../state/store/store';
import { initialState } from '../state/types';
import { Router } from '../router';
import { GarageView } from '../view/garage/garage.view';
import { createCar, updateCar, deleteCar } from '../api/garage.api';

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
      if(!(target instanceof HTMLElement)) return;
      const button = target.closest('button');
      
      if (!button) return;

      const action = button.dataset.action;
      const carElement = button.closest('[data-car-id]');
      const carId = (carElement instanceof HTMLElement && carElement.dataset.carId) 
        ? Number(carElement.dataset.carId) 
        : null;

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
      }
    });
  }

  private async handleSelectCar(carId: number): Promise<void> {
    const cars = this.garageView.getCars();
    const car = cars.find(c => c.id === carId);
    
    if (!car) return;

    this.selectedCarId = carId;
    
    const editForm = this.content.querySelector('fieldset:nth-of-type(2) .form-group');
    if(!(editForm instanceof HTMLElement)) return;
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
    const carNames = ['Ferrari', 'Lamborghini', 'McLaren', 'BMW', 'Audi', 'Mercedes', 'RedBull', 'Tesla', 'Toyota', 'Nissan', 'Aston Martin', 'Bugatti', 'Pagani', 'Koenigsegg', 'Porsche'];
    const carColors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#F5FF33', '#FF33A8', '#A833FF', '#33FFA8', '#FFA833'];
    const createPromises = [];

    for (let i = 0; i < count; i++) {
      const name = carNames[Math.floor(Math.random() * carNames.length)] + ' ' + Math.floor(Math.random() * 1000);
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
}