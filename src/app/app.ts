import { createElement } from '../utils/dom';
import { createStore } from '../state/store/store';
import { initialState } from '../state/types';
import { Router } from '../router';
import { showGarageView } from '../view/garage/garage.view';
import { showCarView } from '../view/car/car.view';
import { getAllCars, getCarById, createCar, updateCar, deleteCar } from '../api/garage.api';

export class App {
  private readonly store = createStore(initialState);
  private readonly router = new Router(this.store);

  private readonly root: HTMLDivElement;
  private readonly container: HTMLDivElement = createElement('div');
  private readonly nav: HTMLDivElement = createElement('div');
  private readonly content: HTMLDivElement = createElement('div');
  private selectedCarId: number | null = null;

  private readonly garageBtn: HTMLButtonElement = createElement('button');
  private readonly winnersBtn: HTMLButtonElement = createElement('button');

  public constructor(root: HTMLDivElement) {
    this.root = root;
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
    this.content.innerHTML = showGarageView('<div>Loading...</div>', 0, this.store.getState().garagePage, 1);
    try {
      const { cars, total } = await getAllCars(this.store.getState().garagePage);
      const carsHtml = cars.map((car) => showCarView(car.name, car.color)).join('');
      const totalPages = total % 7 === 0 ? total / 7 : Math.floor(total / 7) + 1;
      this.content.innerHTML = showGarageView(carsHtml, total, this.store.getState().garagePage, totalPages);
      this.attachAddCarListener();
      this.attachDeleteCarListener();
      this.attachSelectListener();
      this.attachEditCarListener();
      this.attachGenerateCarsListener();
      this.attachPaginationListeners(totalPages);
    } catch (error) {
      this.content.innerHTML = showGarageView('<div>Error loading cars.</div>', 0, this.store.getState().garagePage, 1);
      console.error('Failed to render garage:', error);
    }
  }

  private async attachAddCarListener(): Promise<void> {
    const form = this.content.querySelector('#create-car-form');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameInput = form.querySelector('#car-name') as HTMLInputElement;
        const colorInput = form.querySelector('#car-color') as HTMLInputElement;
        console.log(nameInput, colorInput);
        const name = nameInput.value;
        const color = colorInput.value;
        try {
          await createCar(name, color);
          await this.renderGarage();
        } catch (error) {
          console.error('Failed to add car:', error);
        }
      });
    }
  }

  private async attachDeleteCarListener(): Promise<void> {
    const deleteButtons = this.content.querySelectorAll(`#delete-car`);
    if (deleteButtons) {
      deleteButtons.forEach((deleteButton, index) => {
        deleteButton.addEventListener('click', async (event) => {
          event.preventDefault();
          try {
            const { cars } = await getAllCars(this.store.getState().garagePage);
            const carId = cars[index].id;
            await deleteCar(carId);
            await this.renderGarage();
          } catch (error) {
            console.error('Failed to delete car:', error);
          }
        });
      });
    }
  }

  private async attachSelectListener(): Promise<void> {
    const selectButtons = this.content.querySelectorAll(`#select-car`);
    if (selectButtons) {
      selectButtons.forEach((selectButton, index) => {
        selectButton.addEventListener('click', async (event) => {
          event.preventDefault();
          try {
            const { cars } = await getAllCars(this.store.getState().garagePage);
            const car = await getCarById(cars[index].id);
            const editInput = this.content.querySelector('#edit-car-name') as HTMLInputElement;
            const editColorInput = this.content.querySelector('#edit-car-color') as HTMLInputElement;
            this.selectedCarId = car.id;
            editInput.value = car.name;
            editColorInput.value = car.color;
          } catch (error) {
            console.error('Failed to select car:', error);
          }
        });
      });
    }
  }

  private async attachEditCarListener(): Promise<void> {
    const form = this.content.querySelector('#edit-car-form');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameInput = form.querySelector('#edit-car-name') as HTMLInputElement;
        const colorInput = form.querySelector('#edit-car-color') as HTMLInputElement;
        const name = nameInput.value;
        const color = colorInput.value;
        try {
          const selectedCarId = this.selectedCarId;
          if (selectedCarId === null) {
            console.error('No car selected for editing.');
            return;
          }
          await updateCar(selectedCarId, name, color);
          await this.renderGarage();
        } catch (error) {
          console.error('Failed to edit car:', error);
        }
      });
    }
  }

  private async attachGenerateCarsListener(): Promise<void> {
    const generateButton = this.content.querySelector('#generate-cars');
    if (generateButton) {
      generateButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          for (let i = 0; i < 100; i++) {
            const name = `Car ${Math.floor(Math.random() * 1000)}`;
            const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            await createCar(name, color);
          }
          await this.renderGarage();
        } catch (error) {
          console.error('Failed to generate cars:', error);
        }
      });
    }
  }

  private async attachPaginationListeners(totalPages: number): Promise<void> {
    const previousButton = this.content.querySelector('#prev-page');
    const nextButton = this.content.querySelector('#next-page');

    if (previousButton) {
      previousButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const state = this.store.getState();
        if (state.garagePage > 1) {
          this.store.setState({ garagePage: state.garagePage - 1 });
          await this.renderGarage();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const state = this.store.getState();
        if (state.garagePage < totalPages) {
          this.store.setState({ garagePage: state.garagePage + 1 });
          await this.renderGarage();
        }
      });
    }
  }
}
