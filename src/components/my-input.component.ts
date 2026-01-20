import style from './style.module.css';

export function myInputComponent(placeholder: string = 'Enter text here'): string {
  return `
    <input class="${style.myInput}" type="text" placeholder="${placeholder}" />
  `;
}
