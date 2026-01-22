import { createForm } from '../../components/form.component';
import { createCarView } from '../car/car.view';
import { createElement } from '../../utils/dom';
import styles from './styles.module.css';
import type { Car } from '../../models/car.model';
import { getAllCars } from '../../api/garage.api';
import { CARS_PER_PAGE } from '../../constants';

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
  private cars: Car[] = [];

  public constructor(container: HTMLElement) {
    this.container = container;
  }

  public async render(page: number = 1): Promise<void> {    
    try {
      const { cars, total } = await getAllCars(page, CARS_PER_PAGE);
      this.cars = cars;

      const totalPages = Math.max(1, Math.ceil(total / CARS_PER_PAGE));
      const garageElement = this.createGarageElement(cars, total, page, totalPages);
      
      this.container.innerHTML = '';
      this.container.append(garageElement);
    } catch (error) {
      console.error('Failed to render garage:', error);
      this.container.innerHTML = '<div>Error loading garage</div>';
    }
  }

  private createGarageElement(cars: Car[], total: number, currentPage: number, totalPages: number): HTMLElement {
    const container = createElement('div');
    container.className = styles['garage-container'];

    const header = createElement('div');
    header.className = styles['garage-header'];
    
    const title = createElement('h2');
    title.textContent = `Garage (${total})`;
    
    const generateButton = createElement('button');
    generateButton.className = 'garage-btn garage-btn--generate';
    generateButton.textContent = 'Generate 100 Cars';
    generateButton.dataset.action = 'generate';
    
    header.append(title, generateButton);

    const formSection = createElement('div');
    formSection.className = styles['garage-form-section'];
    formSection.append(createForm());

    const pageTitle = createElement('h3');
    pageTitle.textContent = `Page #${currentPage}`;
    pageTitle.className = styles['page-title'];

    const carsContainer = createElement('div');
    carsContainer.className = styles['cars-container'];
    
    const carElements = cars.map(car => createCarView(car));
    carsContainer.append(...carElements);

    const pagination = createElement('div');
    pagination.className = styles['garage-pagination'];
    
    const previousButton = createElement('button');
    previousButton.className = `${styles['pagination-btn']} pagination-prev`;
    previousButton.textContent = 'Prev';
    previousButton.dataset.action = 'prev';
    previousButton.disabled = currentPage === 1;
    
    const pageInfo = createElement('span');
    pageInfo.className = styles['pagination-info'];
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    const nextButton = createElement('button');
    nextButton.className = `${styles['pagination-btn']} pagination-next`;
    nextButton.textContent = 'Next';
    nextButton.dataset.action = 'next';
    nextButton.disabled = currentPage === totalPages;
    
    pagination.append(previousButton, pageInfo, nextButton);

    container.append(header, formSection, pageTitle, carsContainer, pagination);
    
    return container;
  }

  public getCars(): Car[] {
    return this.cars;
  }
}