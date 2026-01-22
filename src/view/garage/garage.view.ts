import { createForm } from '../../components/form.component';
import { showCarView } from '../car/car.view';
import { createElement } from '../../utils/dom';
import styles from './styles.module.css';

export function showGarageView(cars: HTMLElement[]): HTMLElement {
  const container = createElement('div');
  container.className = styles['garage-container'];

  const header = createElement('div');
  header.className = styles['garage-header'];
  
  const title = createElement('h2');
  title.textContent = 'Garage';
  
  const generateButton = createElement('button');
  generateButton.className = 'garage-btn garage-btn--generate';
  generateButton.textContent = 'Generate 100 Cars';
  
  header.append(title, generateButton);

  const formSection = createElement('div');
  formSection.className = styles['garage-form-section'];
  formSection.append(createForm());

  const carsContainer = createElement('div');
  carsContainer.className = styles['cars-container'];
  carsContainer.append(...cars);

  const pagination = createElement('div');
  pagination.className = styles['garage-pagination'];
  
  const previousButton = createElement('button');
  previousButton.className = styles['pagination-btn'];
  previousButton.textContent = 'Prev';
  
  const pageInfo = createElement('span');
  pageInfo.className = styles['pagination-info'];
  pageInfo.textContent = 'Page 1 of 10';
  
  const nextButton = createElement('button');
  nextButton.className = styles['pagination-btn'];
  nextButton.textContent = 'Next';
  
  pagination.append(previousButton, pageInfo, nextButton);

  container.append(header, formSection, carsContainer, pagination);
  
  return container;
}

export class GarageView {
  private readonly container: HTMLElement;

  public constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    const car1 = this.createCarElement('Car 1', '#ff0000');
    const car2 = this.createCarElement('Car 2', '#ff0000');
    
    const garageElement = showGarageView([car1, car2]);
    
    this.container.innerHTML = '';
    this.container.append(garageElement);
  }

  private createCarElement(name: string, color: string): HTMLElement {
    const carWrapper = createElement('div');
    carWrapper.innerHTML = showCarView(name, color);
    return carWrapper;
  }
}