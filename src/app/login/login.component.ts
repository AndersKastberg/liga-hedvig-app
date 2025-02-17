


import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule  } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.http.post<{ token: string }>('http://localhost:3000/login', { username: this.username, password: this.password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/data']);
      }, error => {
        alert('Login failed');
      });
  }
}
