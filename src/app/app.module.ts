import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { DirectivaComponent } from './components/directiva/directiva.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import {RouterModule,Routes} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';

import { FormComponent } from './components/form/form.component';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es-PE';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './components/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component'
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import {TokenInterceptor} from './usuarios/interceptors/token.interceptor'
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


registerLocaleData(localeES,'es')
const routes:Routes=[

  
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent ,canActivate:[AuthGuard,RoleGuard],data:{role:'ROLE_ADMIN'} },
  { path: 'clientes/form/:id', component: FormComponent,canActivate:[AuthGuard,RoleGuard],data:{role:'ROLE_ADMIN'} },
  { path: 'login', component:LoginComponent },
  {path:'facturas/:id', component:DetalleFacturaComponent,canActivate:[AuthGuard,RoleGuard],data:{role:'ROLE_USER'}},
  {path:'facturas/form/:clienteId', component:FacturasComponent,canActivate:[AuthGuard,RoleGuard],data:{role:'ROLE_ADMIN'}},
  { path: '',pathMatch:'full',redirectTo:'clientes'},
  { path: '**', pathMatch:'full',redirectTo:'clientes' },
  
]
export const MY_FORMATS = {
 
  display: {
    dateInput: 'DD-MM-YY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    {provide:MAT_DATE_FORMATS,useValue:MY_FORMATS},
    {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
