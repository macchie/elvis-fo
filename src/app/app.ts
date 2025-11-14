import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MockData } from './services/mock-data';
import { CommonModule } from '@angular/common';
import { EntityFormBuilder } from './components/entity-form-builder/entity-form-builder';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { EntityTable } from './components/entity-table/entity-table';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ScrollPanelModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    PanelMenuModule,
    DividerModule,
    AccordionModule,
    TabsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    MultiSelectModule,
    EntityTable,
    SelectModule,
    PanelModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('elvis-fo');
  items: MenuItem[] = [] ;

  @ViewChild('formBuilder', { static: false }) 
  formBuilderComponent!: EntityFormBuilder;

  _selectedTable!: string;

  constructor(
    public mockDataSvc: MockData
  ) {
  }
  
  async ngOnInit() {
    this.items = [
      {
        key: '0',
        label: 'Store Admin',
        icon: 'pi pi-shop',
        items: [
          {
            key: '0_1',
            label: 'Store Dashboard',
            items: [
              { key: '0_1_0', label: 'Member' },
              { key: '0_1_1', label: 'Group' }
            ]
          },
          { key: '0_2', label: 'End of Day' },
          { key: '0_3', label: 'Balance Check' },
          { key: '0_4', label: 'Reports' },
          { key: '0_5', label: 'Import Status' },
        ]
      },
      {
        key: '1',
        label: 'System Parameters',
        icon: 'pi pi-cog',
        items: [
          { key: '1_0', label: 'Tenders' },
          { key: '1_1', label: 'Retail Types' },
          { key: '1_2', label: 'Barcode Patterns' }
        ]
      },
      {
        key: '2',
        label: 'Users and Profiles',
        icon: 'pi pi-users',
        items: [
          { key: '2_2', label: 'Cashier Profiles' },
          { key: '2_0', label: 'Cashiers' },
          { key: '2_3', label: 'BackOffice Profiles' },
          { key: '2_1', label: 'BackOffice Users' },
        ]
      }
    ];
  }
  
  toggleAll() {
    const expanded = !this.areAllItemsExpanded();
    this.items = this.toggleAllRecursive(this.items, expanded);
  }

  // private
  
  private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
    return items.map((menuItem) => {
      menuItem.expanded = expanded;
      if (menuItem.items) {
        menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
      }
      return menuItem;
    });
  }
  
  private areAllItemsExpanded(): boolean {
    return this.items.every((menuItem) => menuItem.expanded);
  }
}
