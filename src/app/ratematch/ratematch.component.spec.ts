import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatematchComponent } from './ratematch.component';

describe('RatematchComponent', () => {
  let component: RatematchComponent;
  let fixture: ComponentFixture<RatematchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatematchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatematchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
