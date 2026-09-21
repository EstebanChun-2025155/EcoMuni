import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solola } from './solola';

describe('Solola', () => {
  let component: Solola;
  let fixture: ComponentFixture<Solola>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solola]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Solola);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
