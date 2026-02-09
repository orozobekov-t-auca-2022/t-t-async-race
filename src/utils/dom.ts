export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] {
  return document.createElement(tag);
}

export function setText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

export function clear(element: HTMLElement): void {
  element.firstChild?.remove();
}
