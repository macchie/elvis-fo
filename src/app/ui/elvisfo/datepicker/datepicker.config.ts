import { ConfigOption } from '@ngx-formly/core';

import { FormlyFieldDatepicker } from './datepicker.type';

export function withFormlyFieldDatepicker(): ConfigOption {
  return {
    types: [
      {
        name: 'datepicker',
        component: FormlyFieldDatepicker,
      },
    ],
  };
}
