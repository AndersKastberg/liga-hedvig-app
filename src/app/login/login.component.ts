


import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule  } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule,RouterModule ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) { }

  login() {
    this.http.post<{ token: string }>(environment.apiUrl+'login', { username: this.username, password: this.password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/data']);
      }, error => {
        this.toastr.error('Login failed');
      });
  }
}
