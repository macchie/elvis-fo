import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldBelongsTo } from './belongs-to.type';


export function withFormlyFieldBelongsTo(): ConfigOption {
  return {
    types: [
      {
        name: 'belongs-to',
        component: FormlyFieldBelongsTo,
      },
    ],
  };
}
