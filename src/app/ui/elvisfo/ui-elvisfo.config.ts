import { withFormlyAccordionTabWrapper } from "./accordion-tab/accordion-tab.wrapper.config";
import { withFormlyAccordionWrapper } from "./accordion/accordion.wrapper.config";
import { withFormlyFieldBelongsTo } from "./belongs-to/belongs-to.config";
import { withFormlyCardWrapper } from "./card-wrapper/card-wrapper.config";
import { withFormlyFieldCheckbox } from "./checkbox/checkbox.config";
import { withFormlyFieldDatepicker } from "./datepicker/datepicker.config";
import { withFormlyFieldHasMany } from "./has-many/has-many.config";
import { withFormlyFieldInput } from "./input/input.config";
import { withFormlyPanelWrapper } from "./panel-wrapper/panel-wrapper.config";
import { withFormlyFieldSelect } from "./select/select.config";
import { withFormlyFieldSpacer } from "./spacer/spacer.config";

export function withFormlyElvisFO() {
  return [
    withFormlyPanelWrapper(),
    withFormlyCardWrapper(),
    withFormlyAccordionWrapper(),
    withFormlyAccordionTabWrapper(),
    withFormlyFieldInput(),
    withFormlyFieldDatepicker(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
    withFormlyFieldSpacer(),
    withFormlyFieldBelongsTo(),
    withFormlyFieldHasMany(),
    // withFormlyFieldTextArea(),
    // withFormlyFieldRadio(),
  ];
}
