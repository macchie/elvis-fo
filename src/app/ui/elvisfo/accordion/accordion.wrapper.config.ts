import { ConfigOption } from '@ngx-formly/core';

import { FormlyAccordionWrapper } from './accordion.wrapper';

export function withFormlyAccordionWrapper(): ConfigOption {
  return {
    wrappers: [
      {
        name: 'accordion',
        component: FormlyAccordionWrapper,
      },
    ],
  };
}
