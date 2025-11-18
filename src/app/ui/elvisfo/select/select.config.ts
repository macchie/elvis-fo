import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldSelect } from './select.type';

export function withFormlyFieldSelect(): ConfigOption {
  return {
    types: [
      {
        name: 'select',
        component: FormlyFieldSelect,
      },
      { name: 'enum', extends: 'select' },
    ],
  };
}
