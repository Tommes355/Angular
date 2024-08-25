import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.email, this.password)
      .then(result => {
        console.log('Registrierung erfolgreich!', result);
      })
      .catch(error => {
        console.error('Fehler bei der Registrierung', error);
      });
  }
}
