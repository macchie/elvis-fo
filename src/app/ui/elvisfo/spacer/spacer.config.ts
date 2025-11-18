import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldSpacer } from './spacer.type';


export function withFormlyFieldSpacer(): ConfigOption {
  return {
    types: [
      {
        name: 'panel',
        component: FormlyFieldSpacer,
      },
    ],
  };
}
