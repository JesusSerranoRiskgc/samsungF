import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() menuItems: any[] = [];

  constructor() {}

  ngOnInit(): void {
  }

  toggle(item: any, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    item.isOpen = !item.isOpen;
  }

  trackByLabel(index: number, item: any): string {
    return item.label || index;
  }
}
