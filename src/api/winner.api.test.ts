import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllWinners, getWinnerById, createWinner, deleteWinner, updateWinner } from './winner.api';
import type { Winner } from '../models/winner.model';
import { API_BASE_URL } from '../constants';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Winner API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllWinners', () => {
    it('should fetch all winners with pagination and sorting', async () => {
      const mockWinners: Winner[] = [
        { id: 1, wins: 5, time: 10.5 },
        { id: 2, wins: 3, time: 12.3 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinners,
        headers: new Headers({ 'x-total-count': '2' }),
      });

      const result = await getAllWinners(1, 10, 'wins', 'DESC');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/winners?_page=1&_limit=10&_sort=wins&_order=DESC`,
      );
      expect(result).toEqual({ winners: mockWinners, total: 2 });
    });

    it('should sort by time ascending', async () => {
      const mockWinners: Winner[] = [{ id: 1, wins: 1, time: 8.5 }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinners,
        headers: new Headers({ 'x-total-count': '1' }),
      });

      await getAllWinners(1, 10, 'time', 'ASC');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/winners?_page=1&_limit=10&_sort=time&_order=ASC`,
      );
    });

    it('should sort by id', async () => {
      const mockWinners: Winner[] = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinners,
        headers: new Headers({ 'x-total-count': '0' }),
      });

      await getAllWinners(2, 5, 'id', 'ASC');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/winners?_page=2&_limit=5&_sort=id&_order=ASC`);
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers({ 'x-total-count': '0' }),
      });

      const result = await getAllWinners(1, 10, 'wins', 'DESC');

      expect(result).toEqual({ winners: [], total: 0 });
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(getAllWinners(1, 10, 'wins', 'DESC')).rejects.toThrow(
        'Error fetching winners: Internal Server Error',
      );
    });

    it('should handle missing total count header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const result = await getAllWinners(1, 10, 'wins', 'DESC');

      expect(result.total).toBe(0);
    });
  });

  describe('getWinnerById', () => {
    it('should fetch winner by id', async () => {
      const mockWinner = { id: 1, wins: 5, time: 10.5 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinner,
      });

      const result = await getWinnerById(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/winners/1`);
      expect(result).toEqual(mockWinner);
    });

    it('should throw error when winner not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getWinnerById(999)).rejects.toThrow('Error fetching winner with id 999: Not Found');
    });
  });

  describe('createWinner', () => {
    it('should create a new winner', async () => {
      const mockWinner = { id: 1, wins: 1, time: 10.5 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinner,
      });

      const result = await createWinner(1, 10.5);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/winners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 1, wins: 1, time: 10.5 }),
      });
      expect(result).toEqual(mockWinner);
    });

    it('should throw error on failed creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(createWinner(1, 10.5)).rejects.toThrow('Error creating winner: Bad Request');
    });
  });

  describe('deleteWinner', () => {
    it('should delete a winner', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await deleteWinner(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/winners/1`, {
        method: 'DELETE',
      });
    });

    it('should throw error on failed deletion', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(deleteWinner(999)).rejects.toThrow('Error deleting winner with id 999: Not Found');
    });
  });

  describe('updateWinner', () => {
    it('should update a winner', async () => {
      const mockWinner = { id: 1, wins: 10, time: 8.5 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWinner,
      });

      const result = await updateWinner(1, 10, 8.5);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/winners/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wins: 10, time: 8.5 }),
      });
      expect(result).toEqual(mockWinner);
    });

    it('should throw error on failed update', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(updateWinner(999, 5, 10)).rejects.toThrow('Error updating winner with id 999: Not Found');
    });
  });
});
