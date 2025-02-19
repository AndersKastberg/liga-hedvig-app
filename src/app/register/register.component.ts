import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';


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

    constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) { }

    register() {
        this.http.post(environment.apiUrl+'register', { name: this.name, username: this.username, password: this.password }) // Include name
          .subscribe(response => {
            this.toastr.success('Registration successful! You can now log in.');
            this.router.navigate(['/login']);
          }, error => {
            this.toastr.error('Registration failed');
          });
      }
}
