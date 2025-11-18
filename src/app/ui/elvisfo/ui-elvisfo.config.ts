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
import { withFormlyTabsWrapper } from "./tabs/tabs.wrapper.config";

export function withFormlyElvisFO() {
  return [
    withFormlyPanelWrapper(),
    withFormlyCardWrapper(),
    withFormlyAccordionWrapper(),
    withFormlyTabsWrapper(),
    withFormlyFieldInput(),
    withFormlyFieldDatepicker(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
    withFormlyFieldSpacer(),
    withFormlyFieldBelongsTo(),
    withFormlyFieldHasMany(),
  ];
}
