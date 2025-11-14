import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MockData, TableColumnInfo } from '../../services/mock-data';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelModule } from 'primeng/panel';
import { TableColumnSpec, TableSpec } from '../../interfaces/table-spec.interface';
import { APIService, PagedResult } from '../../services/api-service';
import { FormsModule } from '@angular/forms';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { OrderListModule } from 'primeng/orderlist';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


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
    TagModule,
    MultiSelectModule,
    ButtonModule,
    ButtonGroupModule,
    SplitButtonModule,
    PanelModule,
    DrawerModule,
    FieldsetModule,
    AvatarModule,
    AccordionModule,
    BadgeModule,
    OrderListModule,
    FloatLabelModule,
    SelectModule,
    InputTextModule,
    ToggleSwitchModule,
    SelectButtonModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './entity-table.html',
  styleUrl: './entity-table.css',
})
export class EntityTable {

  constructor(
    public mockDataSvc: MockData,
    private apiService: APIService,
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {
  }

  @ViewChild('table') table!: Table;
  @ViewChild('editTableDrawer') editFieldDrawer!: Drawer;

  @Input() hostId!: string;
  schemaName!: string;
  tableName!: string;
  tableSpec!: TableSpec;

  items: Item[] = [];
  totalRecords = 0;
  loading = false;
  filterValue: string = '';

  showDrawer: boolean = false;

  _columnTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Image', value: 'image' },
    { label: 'Relation', value: 'relation' },
    { label: 'Barcode', value: 'barcode' },
    { label: 'Custom', value: 'custom' },
  ];

  _colors = [
    'primary',
    'contrast',
    'success',
    'info',
    'warn',
    'danger',
  ];

  _formatting = [
    { value: 'text-bold', icon: 'pi pi-circle-on' },
    { value: 'text-italic', icon: 'pi pi-align-center' },
    { value: 'text-underline', icon: 'pi pi-minus' },
  ];

  ngOnInit(): void {
    if (this.hostId) {
      const _parts = this.hostId.split('.');

      if (_parts.length === 2) {
        this.schemaName = _parts[0];
        this.tableName = _parts[1];
      }

      this.tableSpec = this.mockDataSvc.tableSpecs[`${this.schemaName}.${this.tableName}`];
    }
  }

  loadItems(event: any): void {
    this.loading = true;

    const offset = event.first ?? 0;
    const limit = event.rows ?? 10;
    const sortField = event.sortField;
    const sortOrder = event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : undefined;
    const filterField = this.filterValue ? 'name' : undefined;
    const filterValue = this.filterValue ? this.filterValue.trim() : undefined;

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
    this.showDrawer = true;
  }

  onSaveSpec() {
    console.log('Table Spec to Save:', this.tableSpec);
    this.mockDataSvc.onSaveTableSpec(this.hostId!, this.tableSpec);
  }

  onRemoveColumn(col: TableColumnSpec, event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Column?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Column deleted!' });

        const idx = this.tableSpec.columns.findIndex(c => c.field === col.field);
        if (idx !== -1) {
          this.tableSpec.columns.splice(idx, 1);
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected.' });
      },
    });
  }

}
