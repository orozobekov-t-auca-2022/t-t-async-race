import style from './style.module.css';

export function myColorInputComponent(placeholder: string = 'Enter text here', id: string = ''): string {
  return `
    <input class="${style.myColorInput}" type="color" placeholder="${placeholder}" id="${id}" />
  `;
}
