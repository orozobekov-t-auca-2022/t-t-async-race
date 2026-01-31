import { describe, it, expect, beforeEach } from 'vitest';
import { Router } from './router';
import { createStore } from './state/store/store';
import { initialState } from './state/types';

describe('Router', () => {
  let router: Router;
  let state = initialState;

  beforeEach(() => {
    state = { ...initialState, route: 'garage' };
    const store = createStore(state);
    router = new Router(store);
    globalThis.location.hash = '';
  });

  describe('initialization', () => {
    it('should create router instance', () => {
      expect(router).toBeTruthy();
      expect(router).toBeInstanceOf(Router);
    });
  });

  describe('next method', () => {
    it('should navigate to garage route', () => {
      router.next('garage');

      expect(globalThis.location.hash).toBe('#/garage');
    });

    it('should navigate to winners route', () => {
      router.next('winners');

      expect(globalThis.location.hash).toBe('#/winners');
    });

    it('should change hash when navigating', () => {
      const hashBefore = globalThis.location.hash;
      router.next('garage');
      const hashAfter = globalThis.location.hash;

      expect(hashBefore).not.toBe(hashAfter);
    });
  });

  describe('hash parsing', () => {
    it('should parse garage hash correctly', () => {
      globalThis.location.hash = '#/garage';
      const store = createStore(state);
      const testRouter = new Router(store);
      testRouter.start();

      expect(store.getState().route).toBe('garage');
    });

    it('should parse winners hash correctly', () => {
      globalThis.location.hash = '#/winners';
      const store = createStore(state);
      const testRouter = new Router(store);
      testRouter.start();

      expect(store.getState().route).toBe('winners');
    });

    it('should default to garage for empty hash', () => {
      globalThis.location.hash = '';
      const store = createStore(state);
      const testRouter = new Router(store);
      testRouter.start();

      expect(store.getState().route).toBe('garage');
    });

    it('should default to garage for invalid hash', () => {
      globalThis.location.hash = '#/invalid';
      const store = createStore(state);
      const testRouter = new Router(store);
      testRouter.start();

      expect(store.getState().route).toBe('garage');
    });
  });
});
