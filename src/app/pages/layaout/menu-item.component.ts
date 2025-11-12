import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  template: `
   <li class="nav-item">
      <ng-container *ngIf="!item.children; else nestedMenu">
        <a class="nav-link text-white" [routerLink]="item.link" routerLinkActive="active">
          <i class="{{ item.icon }}"></i> {{ item.label }}
        </a>
      </ng-container>
      <ng-template #nestedMenu>
        <a class="nav-link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
          <i class="{{ item.icon }}"></i> {{ item.label }}
        </a>
        <ul class="dropdown-menu">
          <ng-container *ngFor="let child of item.children">
            <app-menu-item [item]="child"></app-menu-item>
          </ng-container>
        </ul>
      </ng-template>
    </li>
  `,
})
export class MenuItemComponent {
  @Input() item: any; // Input para recibir cada ítem del menú
}