import style from './style.module.css';

type ColorInputProps = {
  placeholder?: string;
};

export function createColorInput(props: ColorInputProps = {}): HTMLInputElement {
  const input = document.createElement('input');
  input.className = style.colorInput;
  input.type = 'color';
  input.placeholder = props.placeholder ?? 'Enter text here';
  return input;
}
