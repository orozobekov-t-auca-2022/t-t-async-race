export class App {
  private readonly root: HTMLDivElement;
  private readonly container: HTMLDivElement = document.createElement('div');
  private readonly nav: HTMLDivElement = document.createElement('div');

  public constructor(root: HTMLDivElement) {
    this.root = root;
  }

  public mount(): void {
    this.container.className = 'container';
    this.nav.className = 'nav';
    this.container.append(this.nav);

    this.root.append(this.container);
  }
}
