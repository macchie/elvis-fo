import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormlyFieldBelongsTo } from './belongs-to.type';
import { withFormlyFieldBelongsTo } from './belongs-to.config';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { PopoverModule } from 'primeng/popover';

@NgModule({
  declarations: [
    FormlyFieldBelongsTo
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forChild(withFormlyFieldBelongsTo()),
    ButtonModule,
    ButtonGroup,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    PopoverModule
  ],
})
export class FormlyInputModule {}
