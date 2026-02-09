import { createElement } from '../../utils/dom';
import { getAllWinners } from '../../api/winner.api';
import { getCarById } from '../../api/garage.api';
import type { Winner } from '../../models/winner.model';
import type { Car } from '../../models/car.model';
import { createButton } from '../../components/button.component';
import { WINNERS_PER_PAGE } from '../../constants';
import { createCarSVG } from '../car/car.view';
import styles from './styles.module.css';

type SortField = 'wins' | 'time';
type SortOrder = 'ASC' | 'DESC';

type WinnerWithCar = Winner & {
  car: Car;
};

export class WinnersView {
  private readonly container: HTMLElement;
  private winners: WinnerWithCar[] = [];
  private total: number = 0;
  private currentSort: SortField = 'wins';
  private currentOrder: SortOrder = 'DESC';

  public constructor(container: HTMLElement) {
    this.container = container;
  }

  public async render(page: number = 1, sort?: SortField, order?: SortOrder): Promise<void> {
    if (sort) this.currentSort = sort;
    if (order) this.currentOrder = order;

    try {
      const { winners, total } = await getAllWinners(page, WINNERS_PER_PAGE, this.currentSort, this.currentOrder);
      this.total = total;

      const winnersByCars = await Promise.all(
        winners.map(async (winner) => {
          try {
            const car = await getCarById(winner.id);
            return { ...winner, car };
          } catch (error) {
            console.error(`Failed to fetch car ${winner.id}:`, error);
            return null;
          }
        }),
      );

      this.winners = winnersByCars.filter((w) => w !== null);

      const totalPages = Math.max(1, Math.ceil(total / WINNERS_PER_PAGE));
      const winnersElement = this.createWinnersElement(page, totalPages);

      this.container.innerHTML = '';
      this.container.append(winnersElement);
    } catch (error) {
      console.error('Failed to render winners:', error);
      this.container.innerHTML = '<div>Error loading winners</div>';
    }
  }

  private createWinnersElement(currentPage: number, totalPages: number): HTMLElement {
    const container = createElement('div');
    container.className = styles['winners-container'];

    const header = createElement('div');
    header.className = styles['winners-header'];

    const title = createElement('h2');
    title.textContent = `Winners (${this.total})`;

    header.append(title);

    const pageTitle = createElement('h3');
    pageTitle.textContent = `Page #${currentPage}`;
    pageTitle.className = styles['page-title'];

    const table = this.createWinnersTable();

    const pagination = this.createPagination(currentPage, totalPages);

    container.append(header, pageTitle, table, pagination);

    return container;
  }

  private createWinnersTable(): HTMLElement {
    const tableWrapper = createElement('div');
    tableWrapper.className = styles['table-wrapper'];

    const table = createElement('table');
    table.className = styles['winners-table'];

    const thead = createElement('thead');
    const headerRow = createElement('tr');

    const numberHeader = createElement('th');
    numberHeader.className = styles['number-column'];
    numberHeader.textContent = 'Number';

    const carHeader = createElement('th');
    carHeader.textContent = 'Car';

    const nameHeader = createElement('th');
    nameHeader.textContent = 'Name';

    const winsHeader = createElement('th');
    winsHeader.className = styles['sortable'];
    winsHeader.dataset.sort = 'wins';
    const winsContent = createElement('div');
    winsContent.className = styles['sort-header'];
    const winsText = createElement('span');
    winsText.textContent = 'Wins';
    const winsArrow = createElement('span');
    winsArrow.className = styles['sort-arrow'];

    if (this.currentSort === 'wins') {
      winsArrow.textContent = this.currentOrder === 'ASC' ? '▲' : '▼';
      winsArrow.classList.add(styles['active']);
    }
    winsContent.append(winsText, winsArrow);
    winsHeader.append(winsContent);

    const timeHeader = createElement('th');
    timeHeader.className = styles['sortable'];
    timeHeader.dataset.sort = 'time';
    const timeContent = createElement('div');
    timeContent.className = styles['sort-header'];
    const timeText = createElement('span');
    timeText.textContent = 'Best Time (seconds)';
    const timeArrow = createElement('span');
    timeArrow.className = styles['sort-arrow'];
    if (this.currentSort === 'time') {
      timeArrow.textContent = this.currentOrder === 'ASC' ? '▲' : '▼';
      timeArrow.classList.add(styles['active']);
    }
    timeContent.append(timeText, timeArrow);
    timeHeader.append(timeContent);

    headerRow.append(numberHeader, carHeader, nameHeader, winsHeader, timeHeader);
    thead.append(headerRow);

    const tbody = createElement('tbody');

    this.winners.forEach((winner, index) => {
      const row = createElement('tr');

      const numberCell = createElement('td');
      numberCell.textContent = String(index + 1);

      const carCell = createElement('td');
      const carImage = createCarSVG(winner.car.color);
      carImage.classList.add(styles['car-image']);
      carCell.append(carImage);

      const nameCell = createElement('td');
      nameCell.textContent = winner.car.name;

      const winsCell = createElement('td');
      winsCell.textContent = String(winner.wins);

      const timeCell = createElement('td');
      timeCell.textContent = winner.time.toFixed(2);

      row.append(numberCell, carCell, nameCell, winsCell, timeCell);
      tbody.append(row);
    });

    table.append(thead, tbody);
    tableWrapper.append(table);

    return tableWrapper;
  }

  private createPagination(currentPage: number, totalPages: number): HTMLElement {
    const pagination = createElement('div');
    pagination.className = styles['winners-pagination'];

    const previousButton = createButton({ type: 'button', text: 'Prev' });
    previousButton.className = `${styles['button']} pagination-prev-winners`;
    previousButton.dataset.action = 'prev-winners';
    previousButton.disabled = currentPage === 1;

    const pageInfo = createElement('span');
    pageInfo.className = styles['pagination-info'];
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    const nextButton = createButton({ type: 'button', text: 'Next' });
    nextButton.className = `${styles['button']} pagination-next-winners`;
    nextButton.dataset.action = 'next-winners';
    nextButton.disabled = currentPage === totalPages;

    pagination.append(previousButton, pageInfo, nextButton);

    return pagination;
  }

  public getWinners(): WinnerWithCar[] {
    return this.winners;
  }
}
