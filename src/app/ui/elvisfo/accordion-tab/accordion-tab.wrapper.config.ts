import { ConfigOption } from '@ngx-formly/core';

import { FormlyAccordionTabWrapper } from './accordion-tab.wrapper';

export function withFormlyAccordionTabWrapper(): ConfigOption {
  return {
    wrappers: [
      {
        name: 'accordion-tab',
        component: FormlyAccordionTabWrapper,
      },
    ],
  };
}
