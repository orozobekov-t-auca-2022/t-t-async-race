import { myInputComponent } from './my-input.component';
import { myButtonComponent } from './my-button.component';
import { myColorInputComponent } from './my-color-input.component';

export function myFormComponent(): string {
  return `
    <div class="my-form">
      <fieldset>
        <legend>Create Car</legend>
        <form class="form-group" id="create-car-form">
          ${myInputComponent('Enter car name', 'car-name')}
          ${myColorInputComponent('Enter car color', 'car-color')}
          ${myButtonComponent('Add Car')}
        </form>
      </fieldset>
      <fieldset>
        <legend>Edit Car</legend>
        <form class="form-group" id="edit-car-form">
          ${myInputComponent('Edit car name', 'edit-car-name')}
          ${myColorInputComponent('Edit car color', 'edit-car-color')}
          ${myButtonComponent('Edit Car')}
        </form>
      </fieldset>
      <div class="form-actions">
        ${myButtonComponent('Race')}
        ${myButtonComponent('Reset')}
      </div>
    </div>
  `;
}
