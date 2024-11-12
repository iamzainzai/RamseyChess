import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyOverviewComponent } from './strategy-overview.component';

describe('StrategyOverviewComponent', () => {
  let component: StrategyOverviewComponent;
  let fixture: ComponentFixture<StrategyOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrategyOverviewComponent]
    });
    fixture = TestBed.createComponent(StrategyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
