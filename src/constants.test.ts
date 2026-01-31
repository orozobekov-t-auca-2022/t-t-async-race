import { describe, it, expect } from 'vitest';
import { API_BASE_URL, CARS_PER_PAGE, WINNERS_PER_PAGE } from './constants';

describe('Constants', () => {
  describe('API_BASE_URL', () => {
    it('should be defined', () => {
      expect(API_BASE_URL).toBeDefined();
    });

    it('should be a valid URL format', () => {
      expect(API_BASE_URL).toMatch(/^http/);
      expect(API_BASE_URL).toBe('http://127.0.0.1:3000');
    });
  });

  describe('CARS_PER_PAGE', () => {
    it('should be defined', () => {
      expect(CARS_PER_PAGE).toBeDefined();
    });

    it('should be a number', () => {
      expect(typeof CARS_PER_PAGE).toBe('number');
    });

    it('should have correct value', () => {
      expect(CARS_PER_PAGE).toBe(7);
    });

    it('should be greater than zero', () => {
      expect(CARS_PER_PAGE).toBeGreaterThan(0);
    });
  });

  describe('WINNERS_PER_PAGE', () => {
    it('should be defined', () => {
      expect(WINNERS_PER_PAGE).toBeDefined();
    });

    it('should be a number', () => {
      expect(typeof WINNERS_PER_PAGE).toBe('number');
    });

    it('should have correct value', () => {
      expect(WINNERS_PER_PAGE).toBe(10);
    });

    it('should be greater than zero', () => {
      expect(WINNERS_PER_PAGE).toBeGreaterThan(0);
    });
  });

  describe('relationships', () => {
    it('winners per page should be greater than cars per page', () => {
      expect(WINNERS_PER_PAGE).toBeGreaterThan(CARS_PER_PAGE);
    });
  });
});
