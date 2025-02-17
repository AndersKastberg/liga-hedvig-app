import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [HttpClientModule, FormsModule, RouterModule]
})
export class RegisterComponent {
    name: string = '';
    username: string = '';
    password: string = '';

    constructor(private http: HttpClient, private router: Router) { }

    register() {
        this.http.post('http://localhost:3000/register', { name: this.name, username: this.username, password: this.password }) // Include name
          .subscribe(response => {
            alert('Registration successful! You can now log in.');
            this.router.navigate(['/login']);
          }, error => {
            alert('Registration failed');
          });
      }
}
