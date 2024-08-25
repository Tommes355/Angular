import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  // Registrierung mit E-Mail und Passwort
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Anmeldung mit E-Mail und Passwort
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Benutzer abmelden
  logout() {
    return this.afAuth.signOut();
  }

  // Benutzerstatus beobachten
  getUser() {
    return this.afAuth.authState;
  }
}
