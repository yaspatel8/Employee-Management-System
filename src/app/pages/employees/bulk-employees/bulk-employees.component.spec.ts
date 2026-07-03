import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmployeesComponent } from './bulk-employees.component';

describe('BulkEmployeesComponent', () => {
  let component: BulkEmployeesComponent;
  let fixture: ComponentFixture<BulkEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
