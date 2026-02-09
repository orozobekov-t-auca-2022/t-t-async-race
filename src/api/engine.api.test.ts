import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startOrStopEngine, switchToDriveMode } from './engine.api';
import { API_BASE_URL } from '../constants';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Engine API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startOrStopEngine', () => {
    it('should start engine', async () => {
      const mockResponse = { velocity: 100, distance: 500000 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await startOrStopEngine(1, 'started');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/engine?id=1&status=started`, {
        method: 'PATCH',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should stop engine', async () => {
      const mockResponse = { velocity: 0, distance: 0 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await startOrStopEngine(1, 'stopped');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/engine?id=1&status=stopped`, {
        method: 'PATCH',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle different car ids', async () => {
      const mockResponse = { velocity: 150, distance: 600000 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await startOrStopEngine(5, 'started');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/engine?id=5&status=started`, {
        method: 'PATCH',
      });
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(startOrStopEngine(1, 'started')).rejects.toThrow(
        'Error started engine for car with id 1: Bad Request',
      );
    });
  });

  describe('switchToDriveMode', () => {
    it('should switch to drive mode successfully', async () => {
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await switchToDriveMode(1);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/engine?id=1&status=drive`, {
        method: 'PATCH',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return engine failure on 500 status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await switchToDriveMode(1);

      expect(result).toBe('engine failure');
    });

    it('should handle different car ids', async () => {
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      await switchToDriveMode(10);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/engine?id=10&status=drive`, {
        method: 'PATCH',
      });
    });

    it('should throw error on non-500 failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(switchToDriveMode(999)).rejects.toThrow(
        'Error switching to drive mode for car with id 999: Not Found',
      );
    });
  });
});
