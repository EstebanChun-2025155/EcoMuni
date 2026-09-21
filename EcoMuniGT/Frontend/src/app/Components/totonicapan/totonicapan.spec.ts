import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Totonicapan } from './totonicapan';

describe('Totonicapan', () => {
  let component: Totonicapan;
  let fixture: ComponentFixture<Totonicapan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Totonicapan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Totonicapan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
