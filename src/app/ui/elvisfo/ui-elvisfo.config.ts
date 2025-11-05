import { withFormlyFieldBelongsTo } from "./belongs-to/belongs-to.config";
import { withFormlyFieldDatepicker } from "./datepicker/datepicker.config";
import { withFormlyFormField } from "./form-field/form-field.config";
import { withFormlyFieldInput } from "./input/input.config";
import { withFormlyFieldSpacer } from "./spacer/spacer.config";

export function withFormlyElvisFO() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldDatepicker(),
    withFormlyFieldBelongsTo(),
    withFormlyFieldSpacer(),
    // withFormlyFieldTextArea(),
    // withFormlyFieldRadio(),
    // withFormlyFieldCheckbox(),
    // withFormlyFieldSelect(),
  ];
}
