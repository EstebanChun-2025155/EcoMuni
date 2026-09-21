import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zacapa } from './zacapa';

describe('Zacapa', () => {
  let component: Zacapa;
  let fixture: ComponentFixture<Zacapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zacapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zacapa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
