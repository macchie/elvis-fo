import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableColumnReorderEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MockData } from '../../services/mock-data';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelModule } from 'primeng/panel';
import { TableColumnSpec, TableSpec } from '../../interfaces/table-spec.interface';
import { FormsModule } from '@angular/forms';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ToolbarModule } from 'primeng/toolbar';
import { EntityTableBuilder } from '../entity-table-builder/entity-table-builder';
import { EntityForm } from '../entity-form/entity-form';


interface Item {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-entity-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ButtonGroupModule,
    SplitButtonModule,
    PanelModule,
    DrawerModule,
    FieldsetModule,
    AvatarModule,
    BadgeModule,
    EntityTableBuilder,
    TagModule,
    EntityForm,
    ImageModule,
    ToolbarModule,
  ],
  templateUrl: './entity-table.html',
  styleUrl: './entity-table.css',
})
export class EntityTable {

  constructor(
    public mockDataSvc: MockData,
    private cd: ChangeDetectorRef,
  ) {
  }

  @ViewChild('table') table!: Table;
  @ViewChild('rowDrawer') rowDrawer!: Drawer;
  @ViewChild('editTableDrawer') editTableDrawer!: Drawer;
  @ViewChild('entityTableBuilder', { static: false }) entityTableBuilder!: EntityTableBuilder;
  @ViewChild('entityForm', { static: false }) entityForm!: EntityForm;
  @ViewChild('relationRowForm', { static: false }) relationRowForm!: EntityForm;

  @Input() hostId!: string;
  schemaName!: string;
  tableName!: string;
  tableSpec!: TableSpec;

  items: Item[] = [];
  totalRecords = 0;
  loading = false;
  filterValue: string = '';

  showRowDrawer: boolean = false;
  showEditTableSpecDrawer: boolean = false;
  showRelationRowDrawer: boolean = false;

  _tableActions: any[] = [];

  relationRowHostId?: string;

  ngOnInit(): void {
    if (this.hostId) {
      const _parts = this.hostId.split('.');

      if (_parts.length === 2) {
        this.schemaName = _parts[0];
        this.tableName = _parts[1];
      }

      this.tableSpec = this.mockDataSvc.tableSpecs[`${this.schemaName}.${this.tableName}`];
    }

    this._tableActions = [
      {
        label: 'Export CSV',
        icon: 'pi pi-file-export',
        command: () => {
          this.onExportCSV();
        },
      },
      { separator: true, },
      {
        label: 'Edit Table Layout',
        icon: 'pi pi-pen-to-square',
        command: () => {
          this.onEditSpec();
        },
      },
    ];
  }

  loadItems(event: any): void {
    this.loading = true;

    const offset = event.first ?? 0;
    const limit = event.rows ?? 10;
    const sortField = event.sortField;
    const sortOrder = event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : undefined;
    const filterField = this.filterValue ? 'name' : undefined;
    const filterValue = this.filterValue ? this.filterValue.trim() : undefined;

    console.log('Event:', event);
    console.log('Loading items with params:', this.schemaName, this.tableName, offset, limit, sortField, sortOrder, filterField, filterValue);

    this.mockDataSvc.fetchItems<Item>(this.schemaName, this.tableName, this.tableSpec, offset, limit, sortField, sortOrder, filterField, filterValue)
      .subscribe({
        next: (res: any) => {
          if (!res || !res[0]) {
            return;
          }
          console.log('Fetched:', res[0].result);
          this.items = res[0].result.data;
          this.totalRecords = res[0].result.total;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: err => {
          console.error('Failed to load items', err);
          this.loading = false;
        }
      });
  }

  onFilter(): void {
    // Reset to first page and reload
    this.table.reset();
  }

  onEditSpec() {
    this.showEditTableSpecDrawer = true;
  }

  onRefresh(): void {
    if (!this.table) {
      console.warn('Table reference not available for refresh');
      return;
    }

    // Get the current lazy load state from the table
    const lazyLoadEvent = this.table.createLazyLoadMetadata();

    // Reload items with the current state (pagination, sorting, filters)
    this.loadItems(lazyLoadEvent);
  }

  onViewRow(event: Event, rowData: any) {
    this.entityForm.readonly = true;
    this.entityForm.entityId = rowData[this.mockDataSvc.tableInfo[this.hostId!].primary_key];
    this.entityForm.refreshData();
    this.showRowDrawer = true;
  }

  onCreateRow(event: Event) {
    this.entityForm.entityId = undefined;
    this.entityForm.readonly = false;
    this.entityForm.clearData();
    this.showRowDrawer = true;
  }

  onEditRow(event: Event, rowData: any) {
    this.entityForm.entityId = rowData[this.mockDataSvc.tableInfo[this.hostId!].primary_key];
    this.entityForm.readonly = false;
    this.entityForm.refreshData()
    this.showRowDrawer = true;
  }

  onExportCSV() {
    this.table.exportCSV({ allValues: true, })
  }

  onViewRelation(col: TableColumnSpec, relatedId: any) {
    console.log(col, relatedId);
    this.relationRowForm.hostId = col.relationTo!;
    this.relationRowForm.readonly = true;
    this.relationRowForm.entityId = relatedId;
    this.relationRowForm.refreshFormSpec();
    this.relationRowForm.refreshData();
    this.showRelationRowDrawer = true;
  }

  async onColReorder(event: TableColumnReorderEvent) {
    console.log('Columns reordered:', event);
    const _dragElement = this.tableSpec.columns.splice(event.dragIndex!, 1)[0];
    this.tableSpec.columns.splice(event.dropIndex!, 0, _dragElement);
    console.log('Updated tableSpec:', this.tableSpec);
    await this.mockDataSvc.onSaveTableSpec(this.hostId, this.tableSpec);
    this.cd.detectChanges();
  }

}
