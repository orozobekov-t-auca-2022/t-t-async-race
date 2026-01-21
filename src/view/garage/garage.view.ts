import { myFormComponent } from '../../components/my-form.component';
import styles from './styles.module.css';

export function showGarageView(carsHtml: string, total: number, currentPage: number, totalPages: number): string {
  return `
    <div class="${styles['garage-container']}">
      <div class="${styles['garage-header']}">
        <h2>Garage</h2>
        <button id="generate-cars" class="garage-btn garage-btn--generate">Generate 100 Cars</button>
      </div>
      
      <div class="${styles['garage-form-section']}">
        ${myFormComponent()}
      </div>
      
      <div class="${styles['cars-container']}">
        ${carsHtml}
      </div>
      
      <div class="${styles['garage-pagination']}">
        <button id="prev-page" class="${styles['pagination-btn']}">Prev</button>
        <span class="${styles['pagination-info']}">Page ${currentPage} of ${totalPages}</span>
        <button id="next-page" class="${styles['pagination-btn']}">Next</button>
      </div>
      <div class="${styles['garage-total']}">Total cars: ${total}</div>
    </div>
  `;
}
