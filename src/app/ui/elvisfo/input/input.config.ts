import { ConfigOption } from '@ngx-formly/core';

import { FormlyFieldInput } from './input.type';

export function withFormlyFieldInput(): ConfigOption {
  return {
    types: [
      {
        name: 'input',
        component: FormlyFieldInput,
        wrappers: ['form-field'],
      },
      { name: 'string', extends: 'input' },
      {
        name: 'number',
        extends: 'input',
        defaultOptions: {
          props: {
            type: 'number',
          },
        },
      },
      {
        name: 'password',
        extends: 'input',
        defaultOptions: {
          props: {
            type: 'password',
          },
        },
      },
      {
        name: 'integer',
        extends: 'input',
        defaultOptions: {
          props: {
            type: 'number',
          },
        },
      },
    ],
  };
}
