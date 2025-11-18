import { ConfigOption } from '@ngx-formly/core';

import { FormlyCardWrapper } from './card-wrapper.wrapper';

export function withFormlyCardWrapper(): ConfigOption {
  return {
    wrappers: [
      {
        name: 'form-field',
        component: FormlyCardWrapper,
      },
    ],
  };
}
