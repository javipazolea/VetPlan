import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VetHomePage } from './vet-home.page';

describe('VetHomePage', () => {
  let component: VetHomePage;
  let fixture: ComponentFixture<VetHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VetHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
