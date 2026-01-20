import { myInputComponent } from './my-input.component';
import { myButtonComponent } from './my-button.component';
import { myColorInputComponent } from './my-color-input.component';

export function myFormComponent(): string {
  return `
    <form class="my-form">
      <fieldset>
        <legend>Create Car</legend>
        <div class="form-group">
          ${myInputComponent('Enter car name')}
          ${myColorInputComponent('Enter car color')}
          ${myButtonComponent('Add Car')}
        </div>
      </fieldset>
      <fieldset>
        <legend>Edit Car</legend>
        <div class="form-group">
          ${myInputComponent('Edit car name')}
          ${myColorInputComponent('Edit car color')}
          ${myButtonComponent('Edit Car')}
        </div>
      </fieldset>
      <div class="form-actions">
        ${myButtonComponent('Race')}
        ${myButtonComponent('Reset')}
      </div>
    </form>
  `;
}
