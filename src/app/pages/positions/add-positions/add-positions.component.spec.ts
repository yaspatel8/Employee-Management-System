import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPositionsComponent } from './add-positions.component';

describe('AddPositionsComponent', () => {
  let component: AddPositionsComponent;
  let fixture: ComponentFixture<AddPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPositionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
