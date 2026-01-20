import { myFormComponent } from '../../components/my-form.component';
import { showCarView } from '../car/car.view';
import styles from './styles.module.css';

export function showGarageView(carsHtml: string): string {
  return `
    <div class="${styles['garage-container']}">
      <div class="${styles['garage-header']}">
        <h2>Garage</h2>
        <button class="garage-btn garage-btn--generate">Generate 100 Cars</button>
      </div>
      
      <div class="${styles['garage-form-section']}">
        ${myFormComponent()}
      </div>
      
      <div class="${styles['cars-container']}">
        ${carsHtml}
      </div>
      
      <div class="${styles['garage-pagination']}">
        <button class="${styles['pagination-btn']}">Prev</button>
        <span class="${styles['pagination-info']}">Page 1 of 10</span>
        <button class="${styles['pagination-btn']}">Next</button>
      </div>
    </div>
  `;
}
