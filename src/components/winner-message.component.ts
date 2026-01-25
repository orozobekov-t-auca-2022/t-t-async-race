import styles from './style.module.css';

export default function showWinnerMessage(carName: string, time: number): void {
  const container = document.createElement('div');
  const message = document.createElement('h2');
  container.className = styles['winner-message'];
  message.className = styles['winner-message__text'];
  message.textContent = `Car ${carName} wins! Time: ${time.toFixed(2)} seconds`;

  container.append(message);
  document.body.append(container);

  setTimeout(() => {
    container.remove();
  }, 3000);
}
