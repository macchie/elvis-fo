import { Component, ChangeDetectionStrategy, Type, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '../form-field/form-field.wrapper';

interface BelongsToProps extends FormlyFieldProps {
  fromEntity?: string;
  toEntity?: string;
  fromField?: string;
  toField?: string;
}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<BelongsToProps> {
  type: 'input' | Type<FormlyFieldBelongsTo>;
}

@Component({
  selector: 'formly-field-elvisfo-belongs-to',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './belongs-to.type.scss',
  template: `
    <input
      type="hidden"
      [formControl]="formControl"
      [formlyAttributes]="field"
    />

    <p-buttongroup class="belongs-to flex flex-col basis-full" [style]="{ width: '100% !important' }">
      <p-button (click)="onPreview()" [disabled]="!formControl.value" icon="pi pi-eye" variant="outlined" severity="info"/>
      <p-button (click)="onSelect(); op.toggle($event)" class="fluid grow" [label]="formControl.value || 'Select'" variant="outlined" severity="secondary" />
      <p-button (click)="onClear()" [disabled]="!formControl.value" icon="pi pi-times" variant="outlined" severity="danger" />
    </p-buttongroup>

    <p-popover #op>
      <div class="flex flex-col gap-4 w-[25rem]">
        <!-- <div>
            <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Share this document</span>
            <p-inputgroup>
                <input pInputText value="https://primeng.org/12323ff26t2g243g423g234gg52hy25XADXAG3" readonly class="w-[25rem]" />
                <p-inputgroup-addon>
                    <i class="pi pi-copy"></i>
                </p-inputgroup-addon>
            </p-inputgroup>
        </div>
        <div>
            <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Invite Member</span>
            <div class="flex">
                <p-inputgroup>
                    <input pInputText disabled />
                    <button pButton label="Invite" icon="pi pi-users"></button>
                </p-inputgroup>
            </div>
        </div> -->
        <div>
          <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Team Members</span>
          <ul class="list-none p-0 m-0 flex flex-col gap-4">
            @for(member of members; track member) {
              <li class="flex items-center gap-2">
                <img [src]="'https://primefaces.org/cdn/primeng/images/demo/avatar/' + member.image" style="width: 32px" />
                <div>
                  <span class="font-medium">{{ member.name }}</span>
                  <div class="text-sm text-muted-color">{{ member.email }}</div>
                </div>
                <!-- <div class="flex items-center gap-2 text-muted-color ml-auto text-sm">
                  <span>{{ member.role }}</span>
                  <i class="pi pi-angle-down"></i>
                </div> -->
              </li>
            }
          </ul>
        </div>
    </div>
  </p-popover>

    <!-- <small *ngIf="_helpText" [innerHTML]="_helpText"></small> -->
  `,
})
export class FormlyFieldBelongsTo extends FieldType<FieldTypeConfig<BelongsToProps>> implements OnInit {

  public _displayValue?: string;
  public _helpText?: string;

  constructor( ) {
    super();
  }

  members = [
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
  ];

  ngOnInit() {
    if (this.props.fromEntity && this.props.toEntity && this.props.fromField && this.props.toField) {
      this._helpText = `<b>JOIN</b> ${this.props.toEntity} <b>ON</b> (from.${this.props.fromField} = to.${this.props.toField})`;
    } else {
      this._helpText = 'No related entity configured!';
    } 
  }
  
  onPreview() {
    if (this.formControl.value) {
      alert(`${this.props.fromEntity} JOIN ${this.props.toEntity} ON (${this.props.fromEntity}.${this.props.fromField} = ${this.props.toEntity}.${this.props.toField})`)
    } else {
      alert('No item selected to preview.');
    }
  }

  onSelect() {
    this.formControl.setValue(Math.floor(Math.random() * 1000).toString());
  }

  onClear() {
    this.formControl.setValue(null);
  }
}
