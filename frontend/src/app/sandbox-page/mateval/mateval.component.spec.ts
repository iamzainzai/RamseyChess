import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatevalComponent } from './mateval.component';

describe('MatevalComponent', () => {
  let component: MatevalComponent;
  let fixture: ComponentFixture<MatevalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatevalComponent]
    });
    fixture = TestBed.createComponent(MatevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
