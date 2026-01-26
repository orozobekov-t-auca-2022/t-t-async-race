import { createInput } from './input.component';
import { createButton } from './button.component';
import { createColorInput } from './color-input.component';
import { createElement } from '../utils/dom';
import styles from './style.module.css';

export function createForm(): HTMLFormElement {
  const form = createElement('form');
  form.className = styles.form;

  const createFieldset = createElement('fieldset');
  const createLegend = createElement('legend');
  createLegend.textContent = 'Create Car';

  const createGroup = createElement('div');
  createGroup.className = styles['form-group'];
  const createNameInput = createInput({ placeholder: 'Enter car name' });
  const createColor = createColorInput({ placeholder: 'Enter car color' });
  const createSubmit = createButton({ text: 'Add Car' });
  createSubmit.dataset.action = 'create';
  createGroup.append(createNameInput, createColor, createSubmit);

  createFieldset.append(createLegend, createGroup);

  const editFieldset = createElement('fieldset');
  const editLegend = createElement('legend');
  editLegend.textContent = 'Edit Car';

  const editGroup = createElement('div');
  editGroup.className = styles['form-group'];
  const editNameInput = createInput({ placeholder: 'Edit car name' });
  const editColor = createColorInput({ placeholder: 'Edit car color' });
  const editSubmit = createButton({ text: 'Edit Car' });
  editSubmit.dataset.action = 'edit';
  editGroup.append(editNameInput, editColor, editSubmit);

  editFieldset.append(editLegend, editGroup);
  editFieldset.disabled = true;

  const formActions = createElement('div');
  formActions.className = styles['form-actions'];
  const raceButton = createButton({ text: 'Race' });
  raceButton.dataset.action = 'race';
  const resetButton = createButton({ text: 'Reset' });
  resetButton.dataset.action = 'reset';
  resetButton.disabled = true;
  resetButton.id = 'reset-button';

  const generateButton = createButton({ text: 'Generate Cars' });
  generateButton.dataset.action = 'generate';

  formActions.append(raceButton, resetButton, generateButton);

  form.append(createFieldset, editFieldset, formActions);

  return form;
}
