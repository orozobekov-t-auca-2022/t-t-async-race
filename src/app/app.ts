import { createElement } from '../utils/dom';
import { createStore } from '../state/store/store';
import { initialState } from '../state/types';
import { Router } from '../router';

export class App {
  private readonly store = createStore(initialState);
  private readonly router = new Router(this.store);

  private readonly root: HTMLDivElement;
  private readonly container: HTMLDivElement = createElement('div');
  private readonly nav: HTMLDivElement = createElement('div');

  private readonly garageBtn: HTMLButtonElement = createElement('button');
  private readonly winnersBtn: HTMLButtonElement = createElement('button');

  public constructor(root: HTMLDivElement) {
    this.root = root;
  }

  public mount(): void {
    this.container.className = 'container';
    this.nav.className = 'nav';

    this.garageBtn.className = 'nav__btn';
    this.garageBtn.textContent = 'Garage';
    this.garageBtn.addEventListener('click', () => this.router.next('garage'));

    this.winnersBtn.className = 'nav__btn';
    this.winnersBtn.textContent = 'Winners';
    this.winnersBtn.addEventListener('click', () => this.router.next('winners'));

    this.container.append(this.nav);
    this.nav.append(this.garageBtn, this.winnersBtn);

    this.root.append(this.container);
    this.router.start();
  }
}
