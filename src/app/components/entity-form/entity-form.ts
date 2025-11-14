import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyField, FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MockData } from '../../services/mock-data';
import { ButtonModule } from 'primeng/button';
import { EntityFormBuilder } from '../entity-form-builder/entity-form-builder';
import { FormSpec } from '../../interfaces/form-spec.interface';

@Component({
  selector: 'app-entity-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyForm,
    ButtonModule,
    EntityFormBuilder
  ],
  templateUrl: './entity-form.html',
  styleUrl: './entity-form.css',
})
export class EntityForm implements OnInit {

  form!: FormGroup;
  model: any;

  @Input() hostId!: string;
  @Input() entityId!: string | number | undefined;
  @Input() readonly!: boolean;
  schemaName!: string;
  tableName!: string;
  formSpec!: FormSpec;

  @ViewChild('formlyForm', { static: false }) 
  formlyFormComponent!: FormlyForm;

  showFormEditor: boolean = false;

  constructor(
    private mockDataSvc: MockData,
    private cd: ChangeDetectorRef,
  ) {

  }

  async ngOnInit() {
    this.form = new FormGroup({});

    if (this.hostId) {
      const _parts = this.hostId.split('.');

      if (_parts.length === 2) {
        this.schemaName = _parts[0];
        this.tableName = _parts[1];
      }

      this.formSpec = this.mockDataSvc.formSpecs[this.hostId];

      if (this.entityId !== undefined) {
        this.model = await this.mockDataSvc.getEntity(this.hostId, this.entityId);
      }

      if (this.readonly) {
        this.form.disable();
      } else {
        this.form.enable();
      }

      this.cd.detectChanges();
    }
  }

  async clearData() {
    this.model = {};
    this.cd.detectChanges();
  }

  async refreshData() {
    if (this.hostId && this.entityId !== undefined) {
      if (this.readonly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
      this.model = await this.mockDataSvc.getEntity(this.hostId, this.entityId);
      this.cd.detectChanges();
    }
  }

  async refreshFormSpec() {
    if (this.readonly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.formSpec = this.mockDataSvc.formSpecs[this.hostId];
    this.cd.detectChanges();
  }

  onEditForm() {
    console.log('Form Spec:', this.formSpec);
    this.showFormEditor = !this.showFormEditor;
    if (!this.showFormEditor) {
      this.refreshFormSpec();
    }
  }
  
}
