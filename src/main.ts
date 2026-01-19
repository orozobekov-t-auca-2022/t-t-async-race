import './styles.css';
import { App } from './app/app';

const appRoot = document.querySelector('#app');

if (appRoot instanceof HTMLDivElement) {
  const app = new App(appRoot);
  app.mount();
}
