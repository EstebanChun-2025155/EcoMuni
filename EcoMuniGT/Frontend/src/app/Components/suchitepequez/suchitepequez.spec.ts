import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Suchitepequez } from './suchitepequez';

describe('Suchitepequez', () => {
  let component: Suchitepequez;
  let fixture: ComponentFixture<Suchitepequez>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Suchitepequez]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Suchitepequez);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
