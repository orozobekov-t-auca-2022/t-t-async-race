import { describe, it, expect, vi } from 'vitest';
import { createStore } from './store';

describe('Store', () => {
  it('should initialize with initial state', () => {
    const store = createStore({ count: 0, name: 'Test' });
    
    expect(store.getState()).toEqual({ count: 0, name: 'Test' });
  });

  it('should update state with setState', () => {
    const store = createStore({ count: 0, name: 'Test' });
    
    store.setState({ count: 5 });
    
    expect(store.getState()).toEqual({ count: 5, name: 'Test' });
  });

  it('should merge partial state updates', () => {
    const store = createStore({ count: 0, name: 'Test', active: false });
    
    store.setState({ active: true });
    
    expect(store.getState()).toEqual({ count: 0, name: 'Test', active: true });
  });

  it('should notify subscribers on state change', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    
    store.subscribe(listener);
    store.setState({ count: 1 });
    
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should notify multiple subscribers', () => {
    const store = createStore({ count: 0 });
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    
    store.subscribe(listener1);
    store.subscribe(listener2);
    store.setState({ count: 1 });
    
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe correctly', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setState({ count: 1 });
    
    expect(listener).not.toHaveBeenCalled();
  });

  it('should handle multiple state updates', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    
    store.subscribe(listener);
    store.setState({ count: 1 });
    store.setState({ count: 2 });
    store.setState({ count: 3 });
    
    expect(listener).toHaveBeenCalledTimes(3);
    expect(store.getState().count).toBe(3);
  });
});