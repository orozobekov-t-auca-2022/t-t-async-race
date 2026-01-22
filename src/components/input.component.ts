import style from './style.module.css';

type InputProps = {
  placeholder?: string;
};

export function createInput(props: InputProps = {}): HTMLInputElement {
  const input = document.createElement('input');
  input.className = style.input;
  input.type = 'text';
  input.placeholder = props.placeholder ?? 'Enter text here';
  return input;
}
