import style from './style.module.css';

export function myButtonComponent(name: string): string {
  return `
    <button class="${style.myBtn}" type="submit">${name}</button>
  `;
}
