import style from './style.module.css';

type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: Event) => void;
};

export function createButton(props: ButtonProps): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = style.button;
  button.type = props.type ?? 'button';
  button.textContent = props.text;
  if (props.disabled) {
    button.disabled = true;
  }
  if (props.onClick) {
    button.addEventListener('click', props.onClick);
  }
  return button;
}
