import style from './style.module.css';

export function myInputComponent(placeholder: string = 'Enter text here', id: string = ''): string {
  return `
    <input class="${style.myInput}" type="text" placeholder="${placeholder}" id="${id}" />
  `;
}
