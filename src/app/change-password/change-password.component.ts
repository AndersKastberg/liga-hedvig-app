import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { decodeToken } from '../../utils/jwt.utils';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],   
  standalone: true,
  imports: [FormsModule]
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  userId: string | undefined;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      this.userId = decodedToken.id; // Assuming the user ID is stored in the token under the "id" field
    }

  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.toastr.error('New passwords do not match');
      return;
    }

    this.http.post('http://localhost:3000/change-password', {
      userId: this.userId,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe(response => {
      this.toastr.success('Password changed successfully!');
      this.router.navigate(['/']);
    }, error => {
      this.toastr.error('Failed to change password: ' + error.message);
    });
  }
  

}
