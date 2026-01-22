import { createElement } from '../utils/dom';
import { createStore } from '../state/store/store';
import { initialState } from '../state/types';
import { Router } from '../router';
import { GarageView } from '../view/garage/garage.view';

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
    this.store.subscribe(() => this.render());
    this.render();
    this.router.start();
  }

  private render(): void {
    const state = this.store.getState();

    if (state.route === 'garage') {
      this.renderGarage();
    }
  }

  private renderGarage(): void {
    this.garageView.render();
  }
}
