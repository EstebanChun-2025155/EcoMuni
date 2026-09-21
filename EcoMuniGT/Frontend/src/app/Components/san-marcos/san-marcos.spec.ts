import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanMarcos } from './san-marcos';

describe('SanMarcos', () => {
  let component: SanMarcos;
  let fixture: ComponentFixture<SanMarcos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanMarcos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanMarcos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
