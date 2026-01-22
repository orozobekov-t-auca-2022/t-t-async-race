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
  createGroup.append(
    createInput({ placeholder: 'Enter car name' }),
    createColorInput({ placeholder: 'Enter car color' }),
    createButton({ text: 'Add Car' })
  );
  
  createFieldset.append(createLegend, createGroup);

  const editFieldset = createElement('fieldset');
  const editLegend = createElement('legend');
  editLegend.textContent = 'Edit Car';
  
  const editGroup = createElement('div');
  editGroup.className = 'form-group';
  editGroup.append(
    createInput({ placeholder: 'Edit car name' }),
    createColorInput({ placeholder: 'Edit car color' }),
    createButton({ text: 'Edit Car' })
  );
  
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