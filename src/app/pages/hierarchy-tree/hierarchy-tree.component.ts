import { Component } from '@angular/core';
import { ProfileService } from '../../Services/profile.service';
import { HierarchyTree } from '../../models/HierarchyTree';
import { CommonModule } from '@angular/common';
import { HierarchyTreeNode } from '../../models/HierarchyTreeNode';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NestedTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-hierarchy-tree',
  imports: [CommonModule,MatTreeModule,MatIconModule,MatButtonModule],
  templateUrl: './hierarchy-tree.component.html',
  styleUrl: './hierarchy-tree.component.scss',
})
export class HierarchyTreeComponent {

  constructor(private profileService: ProfileService) { }

  hierarchyTree: HierarchyTree[] = [];
  treeData: HierarchyTreeNode[] = [];

  ngOnInit() {
    this.loadTree();
  }

  treeControl = new NestedTreeControl<HierarchyTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<HierarchyTreeNode>();

  hasChild = (_: number, node: HierarchyTreeNode) => !!node.children && node.children.length > 0;

  buildTree(data: HierarchyTree[]): HierarchyTreeNode[] {
    const map = new Map<number, HierarchyTreeNode>();
    const roots: HierarchyTreeNode[] = [];
    // Step 1 - Create map
    data.forEach(emp => {
      map.set(emp.employeePositionId, {
        ...emp,
        children: []
      });
    });
    // Step 2 - Assign children
    data.forEach(emp => {
      const node = map.get(emp.employeePositionId)!;
      if (emp.reportsToEmployeePositionId == null) {
        roots.push(node);
      } else {
        const parent = map.get(emp.reportsToEmployeePositionId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });
    return roots;
  }

  loadTree(departmentId: number = 0) {
    this.profileService.getHierarchyTree(departmentId).subscribe({
      next: (treeRes: any) => {
        if (treeRes.success && treeRes.data) {
          this.treeData = this.buildTree(treeRes.data);
          this.dataSource.data = this.treeData;
          console.log('Hierarchy tree fetched successfully:', this.treeData);
        }
        else {
          console.error('Failed to fetch hierarchy tree:', treeRes.message);
        }
      },
      error: (err) => {
        console.error('Error fetching hierarchy tree:', err);
      }
    });
  }

}
