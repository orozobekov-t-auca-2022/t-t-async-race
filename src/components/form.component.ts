import { createInput } from './input.component';
import { createButton } from './button.component';
import { createColorInput } from './color-input.component';
import { createElement } from '../utils/dom';

export function createForm(): HTMLFormElement {
  const form = createElement('form');
  form.className = 'my-form';

  const createFieldset = createElement('fieldset');
  const createLegend = createElement('legend');
  createLegend.textContent = 'Create Car';
  
  const createGroup = createElement('div');
  createGroup.className = 'form-group';
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
  editGroup.className = 'form-group';
  const editNameInput = createInput({ placeholder: 'Edit car name' });
  const editColor = createColorInput({ placeholder: 'Edit car color' });
  const editSubmit = createButton({ text: 'Edit Car' });
  editSubmit.dataset.action = 'edit';
  editGroup.append(editNameInput, editColor, editSubmit);
  
  editFieldset.append(editLegend, editGroup);

  const formActions = createElement('div');
  formActions.className = 'form-actions';
  formActions.append(
    createButton({ text: 'Race' }),
    createButton({ text: 'Reset' })
  );

  form.append(createFieldset, editFieldset, formActions);
  
  return form;
}