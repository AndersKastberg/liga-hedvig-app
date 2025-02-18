import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';
import { DataComponent } from './data/data.component';
import { DataService } from './data/data.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
import { ChangePasswordComponent } from './change-password/change-password.component'

export function tokenGetter() {
  return localStorage.getItem('token');
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent },

  { path: 'data', component: DataComponent, canActivate: [AuthGuard] } // Protect the data route
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    ChangePasswordComponent,
    DataComponent,
    FormsModule,
    LoginComponent,
    RegisterComponent,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatCheckboxModule,
    ToastrModule.forRoot(
      {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,
      }

    ),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['http://localhost:3000/login', 'http://localhost:3000/register']
      }
    }),

    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    DataService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],

})
export class AppModule { }
