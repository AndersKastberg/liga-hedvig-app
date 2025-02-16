import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './app/auth.guard';
import { AuthInterceptor } from './app/auth.interceptor';
import { DataComponent } from './app/data/data.component';
import { LoginComponent } from './app/login/login.component';
import { DataService } from './app/data/data.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterComponent } from './app/register/register.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'data', component: DataComponent, canActivate: [AuthGuard] } // Protect the data route
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule, BrowserAnimationsModule, MatTableModule, HttpClientModule, RouterModule.forRoot(routes), MatCheckboxModule,
     ToastrModule.forRoot(), JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['http://localhost:3000/login', 'http://localhost:3000/register']
      }
    })),
    DataService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
})
.catch(err => console.error(err));
