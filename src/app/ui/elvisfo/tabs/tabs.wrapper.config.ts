import { ConfigOption } from '@ngx-formly/core';

import { FormlyTabsWrapper } from './tabs.wrapper';

export function withFormlyTabsWrapper(): ConfigOption {
  return {
    wrappers: [
      { name: 'tabs', component: FormlyTabsWrapper },
    ],
  };
}
