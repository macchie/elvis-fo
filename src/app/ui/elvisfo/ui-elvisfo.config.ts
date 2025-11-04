import { withFormlyFieldBelongsTo } from "./belongs-to/belongs-to.config";
import { withFormlyFormField } from "./form-field/form-field.config";
import { withFormlyFieldInput } from "./input/input.config";

export function withFormlyElvisFO() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldBelongsTo(),
    // withFormlyFieldTextArea(),
    // withFormlyFieldRadio(),
    // withFormlyFieldCheckbox(),
    // withFormlyFieldSelect(),
  ];
}
