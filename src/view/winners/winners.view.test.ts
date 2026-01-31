import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WinnersView } from './winners.view';
import { WINNERS_PER_PAGE } from '../../constants';
import * as winnerApi from '../../api/winner.api';
import * as garageApi from '../../api/garage.api';

vi.mock('../../api/winner.api', () => ({
  getAllWinners: vi.fn(),
}));

vi.mock('../../api/garage.api', () => ({
  getCarById: vi.fn(),
}));

describe('Winners View', () => {
  let container: HTMLElement;
  let winnersView: WinnersView;

  beforeEach(() => {
    container = document.createElement('div');
    winnersView = new WinnersView(container);

    vi.mocked(winnerApi.getAllWinners).mockResolvedValue({
      winners: [
        { id: 1, wins: 5, time: 10.5 },
        { id: 2, wins: 3, time: 12.3 },
      ],
      total: 2,
    });

    vi.mocked(garageApi.getCarById).mockImplementation(async (id: number) => ({
      id,
      name: `Car ${id}`,
      color: '#ff0000',
    }));
  });

  describe('initialization', () => {
    it('should create instance', () => {
      expect(winnersView).toBeInstanceOf(WinnersView);
    });

    it('should accept container element', () => {
      const newContainer = document.createElement('div');
      const view = new WinnersView(newContainer);

      expect(view).toBeTruthy();
    });
  });

  describe('render method', () => {
    it('should render winners view', async () => {
      await winnersView.render(1);

      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should call getAllWinners API', async () => {
      await winnersView.render(1);

      expect(winnerApi.getAllWinners).toHaveBeenCalled();
    });

    it('should call getCarById for each winner', async () => {
      await winnersView.render(1);

      expect(garageApi.getCarById).toHaveBeenCalledTimes(2);
      expect(garageApi.getCarById).toHaveBeenCalledWith(1);
      expect(garageApi.getCarById).toHaveBeenCalledWith(2);
    });

    it('should handle different pages', async () => {
      await winnersView.render(2);

      expect(winnerApi.getAllWinners).toHaveBeenCalledWith(2, WINNERS_PER_PAGE, 'wins', 'DESC');
    });

    it('should handle custom sort field', async () => {
      await winnersView.render(1, 'time');

      expect(winnerApi.getAllWinners).toHaveBeenCalledWith(1, WINNERS_PER_PAGE, 'time', 'DESC');
    });

    it('should handle custom sort order', async () => {
      await winnersView.render(1, undefined, 'ASC');

      expect(winnerApi.getAllWinners).toHaveBeenCalledWith(1, WINNERS_PER_PAGE, 'wins', 'ASC');
    });

    it('should handle both sort and order', async () => {
      await winnersView.render(1, 'wins', 'DESC');

      expect(winnerApi.getAllWinners).toHaveBeenCalledWith(1, WINNERS_PER_PAGE, 'wins', 'DESC');
    });

    it('should display total winners count', async () => {
      await winnersView.render(1);

      expect(container.textContent).toContain('2');
    });

    it('should handle API errors', async () => {
      vi.mocked(winnerApi.getAllWinners).mockRejectedValue(new Error('API Error'));

      await winnersView.render(1);

      expect(container.textContent).toContain('Error');
    });

    it('should handle car fetch errors', async () => {
      vi.mocked(garageApi.getCarById).mockRejectedValue(new Error('Car not found'));

      await winnersView.render(1);

      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should clear previous content before rendering', async () => {
      container.innerHTML = '<div>Old content</div>';

      await winnersView.render(1);

      expect(container.textContent).not.toContain('Old content');
    });

    it('should update content on re-render', async () => {
      await winnersView.render(1);
      const firstRenderContent = container.innerHTML;

      vi.mocked(winnerApi.getAllWinners).mockResolvedValue({
        winners: [{ id: 3, wins: 10, time: 8.5 }],
        total: 1,
      });

      await winnersView.render(1);
      const secondRenderContent = container.innerHTML;

      expect(firstRenderContent).not.toBe(secondRenderContent);
    });
  });

  describe('sorting', () => {
    it('should sort by wins', async () => {
      await winnersView.render(1, 'wins');

      expect(winnerApi.getAllWinners).toHaveBeenCalledWith(1, WINNERS_PER_PAGE, 'wins', 'DESC');
    });

    it('should sort by time', async () => {
      await winnersView.render(1, 'time');

      expect(winnerApi.getAllWinners).toHaveBeenCalledWith(1, WINNERS_PER_PAGE, 'time', 'DESC');
    });

    it('should maintain sort state across renders', async () => {
      await winnersView.render(1, 'time', 'ASC');
      await winnersView.render(2);

      expect(winnerApi.getAllWinners).toHaveBeenLastCalledWith(2, WINNERS_PER_PAGE, 'time', 'ASC');
    });
  });

  describe('getWinners method', () => {
    it('should return winners list', async () => {
      await winnersView.render(1);
      
      const winners = winnersView.getWinners();
      
      expect(winners.length).toBe(2);
      expect(winners[0]).toHaveProperty('car');
      expect(winners[0].car.name).toBe('Car 1');
    });

    it('should return empty array before render', () => {
      const winners = winnersView.getWinners();
      
      expect(winners).toEqual([]);
    });
  });
});
