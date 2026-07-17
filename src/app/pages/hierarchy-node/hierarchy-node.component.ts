import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HierarchyTreeNode } from 'src/app/models/HierarchyTreeNode';

@Component({
  selector: 'app-hierarchy-node',
  imports: [CommonModule],
  templateUrl: './hierarchy-node.component.html',
  styleUrl: './hierarchy-node.component.scss',
})
export class HierarchyNodeComponent {
defaultImage = "/assets/images/default-image.jpg";

  @Input() node!: HierarchyTreeNode;

  expanded = false;

  toggle() {

    this.expanded = !this.expanded;
  }

}
