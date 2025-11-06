import { withFormlyFieldBelongsTo } from "./belongs-to/belongs-to.config";
import { withFormlyFieldCheckbox } from "./checkbox/checkbox.config";
import { withFormlyFieldDatepicker } from "./datepicker/datepicker.config";
import { withFormlyFormField } from "./form-field/form-field.config";
import { withFormlyFieldInput } from "./input/input.config";
import { withFormlyFieldSelect } from "./select/select.config";
import { withFormlyFieldSpacer } from "./spacer/spacer.config";

export function withFormlyElvisFO() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldDatepicker(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
    withFormlyFieldBelongsTo(),
    withFormlyFieldSpacer(),
    // withFormlyFieldTextArea(),
    // withFormlyFieldRadio(),
  ];
}
