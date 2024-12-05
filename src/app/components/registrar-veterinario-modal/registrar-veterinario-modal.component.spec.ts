import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistrarVeterinarioModalComponent } from './registrar-veterinario-modal.component';

describe('RegistrarVeterinarioModalComponent', () => {
  let component: RegistrarVeterinarioModalComponent;
  let fixture: ComponentFixture<RegistrarVeterinarioModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarVeterinarioModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarVeterinarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
