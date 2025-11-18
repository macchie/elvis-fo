import { ConfigOption } from '@ngx-formly/core';

import { FormlyPanelWrapper } from './panel-wrapper.wrapper';

export function withFormlyPanelWrapper(): ConfigOption {
  return {
    wrappers: [
      {
        name: 'panel',
        component: FormlyPanelWrapper,
      },
    ],
  };
}
