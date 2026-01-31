import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllCars, getCarById, createCar, deleteCar, updateCar } from './garage.api';
import { API_BASE_URL } from '../constants';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Garage API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCars', () => {
    it('should fetch all cars with default pagination', async () => {
      const mockCars = [
        { id: 1, name: 'Tesla', color: '#ff0000' },
        { id: 2, name: 'BMW', color: '#0000ff' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCars,
        headers: new Headers({ 'x-total-count': '2' }),
      });

      const result = await getAllCars();

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/garage?_page=1&_limit=7`);
      expect(result).toEqual({ cars: mockCars, total: 2 });
    });

    it('should fetch cars with custom pagination', async () => {
      const mockCars = [{ id: 1, name: 'Tesla', color: '#ff0000' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCars,
        headers: new Headers({ 'x-total-count': '10' }),
      });

      const result = await getAllCars(2, 5);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/garage?_page=2&_limit=5`);
      expect(result).toEqual({ cars: mockCars, total: 10 });
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers({ 'x-total-count': '0' }),
      });

      const result = await getAllCars();

      expect(result).toEqual({ cars: [], total: 0 });
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(getAllCars()).rejects.toThrow('Error fetching cars: Internal Server Error');
    });

    it('should handle missing total count header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const result = await getAllCars();

      expect(result.total).toBe(0);
    });
  });

  describe('getCarById', () => {
    it('should fetch car by id', async () => {
      const mockCar = { id: 1, name: 'Tesla', color: '#ff0000' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCar,
      });

      const result = await getCarById(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/garage/1`);
      expect(result).toEqual(mockCar);
    });

    it('should throw error when car not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getCarById(999)).rejects.toThrow('Error fetching car with id 999: Not Found');
    });
  });

  describe('createCar', () => {
    it('should create a new car', async () => {
      const mockCar = { id: 1, name: 'Tesla', color: '#ff0000' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCar,
      });

      const result = await createCar('Tesla', '#ff0000');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/garage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Tesla', color: '#ff0000' }),
      });
      expect(result).toEqual(mockCar);
    });

    it('should throw error on failed creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(createCar('Tesla', '#ff0000')).rejects.toThrow('Error creating car: Bad Request');
    });
  });

  describe('deleteCar', () => {
    it('should delete a car', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await deleteCar(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/garage/1`, {
        method: 'DELETE',
      });
    });

    it('should throw error on failed deletion', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(deleteCar(999)).rejects.toThrow('Error deleting car with id 999: Not Found');
    });
  });

  describe('updateCar', () => {
    it('should update a car', async () => {
      const mockCar = { id: 1, name: 'Updated Tesla', color: '#00ff00' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCar,
      });

      const result = await updateCar(1, 'Updated Tesla', '#00ff00');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/garage/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Updated Tesla', color: '#00ff00' }),
      });
      expect(result).toEqual(mockCar);
    });

    it('should throw error on failed update', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(updateCar(999, 'Tesla', '#ff0000')).rejects.toThrow(
        'Error updating car with id 999: Not Found',
      );
    });
  });
});
