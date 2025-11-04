import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldBelongsTo } from './belongs-to.type';


export function withFormlyFieldBelongsTo(): ConfigOption {
  return {
    types: [
      {
        name: 'belongs-to',
        component: FormlyFieldBelongsTo,
        wrappers: ['form-field'],
      },
      // { name: 'string', extends: 'input' },
      // {
      //   name: 'number',
      //   extends: 'input',
      //   defaultOptions: {
      //     props: {
      //       type: 'number',
      //     },
      //   },
      // },
      // {
      //   name: 'integer',
      //   extends: 'input',
      //   defaultOptions: {
      //     props: {
      //       type: 'number',
      //     },
      //   },
      // },
    ],
  };
}
