import type { Store } from './state/store/store';
import type { AppState, RouteName } from './state/types';

export class Router {
  private readonly store: Store<AppState>;

  public constructor(store: Store<AppState>) {
    this.store = store;
  }

  public start(): void {
    globalThis.addEventListener('hashchange', () => this.applyHash());
    this.applyHash();
  }

  public next(route: RouteName): void {
    globalThis.location.hash = route === 'garage' ? '/garage' : '/winners';
  }

  private applyHash(): void {
    const hash = globalThis.location.hash;
    const next = this.parseHash(hash);
    this.store.setState({ route: next });
  }

  private parseHash(hash: string): RouteName {
    if (hash.includes('winners')) return 'winners';
    return 'garage';
  }
}
