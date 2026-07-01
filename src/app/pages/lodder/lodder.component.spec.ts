import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodderComponent } from './lodder.component';

describe('LodderComponent', () => {
  let component: LodderComponent;
  let fixture: ComponentFixture<LodderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LodderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
