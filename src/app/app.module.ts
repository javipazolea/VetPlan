import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { MenuComponent } from './components/menu/menu.component';
import { MascotasComponent } from './pages/mascotas/mascotas.component';
import { CitasService } from './services/citas.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResetPasswordPage } from './pages/reset-password/reset-password.page';

@NgModule({
  declarations: [AppComponent,  MenuComponent, MascotasComponent,
],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,IonicModule,ReactiveFormsModule,  // Agrega ReactiveFormsModule
    FormsModule     
  ],
  providers: [CitasService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
