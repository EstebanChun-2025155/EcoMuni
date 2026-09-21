import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SantaRosa } from './santa-rosa';

describe('SantaRosa', () => {
  let component: SantaRosa;
  let fixture: ComponentFixture<SantaRosa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SantaRosa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SantaRosa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
