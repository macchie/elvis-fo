import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldHasMany } from './has-many.type';


export function withFormlyFieldHasMany(): ConfigOption {
  return {
    types: [
      {
        name: 'has-many',
        component: FormlyFieldHasMany,
      },
    ],
  };
}
