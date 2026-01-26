import './styles.css';
import { App } from './app/app';

const appRoot = document.createElement('div');
appRoot.id = 'app';
document.body.append(appRoot);

const app = new App(appRoot);
app.mount();
