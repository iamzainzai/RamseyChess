import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent {
  constructor(public auth: AuthService) {}

  // Method to log in the user
  login(): void {
    this.auth.loginWithRedirect();
  }

  // Method to log out the user
  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
