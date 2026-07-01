import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWithDepartmentComponent } from './employee-with-department.component';

describe('EmployeeWithDepartmentComponent', () => {
  let component: EmployeeWithDepartmentComponent;
  let fixture: ComponentFixture<EmployeeWithDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeWithDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeWithDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
