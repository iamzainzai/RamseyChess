import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit {
  isSmallScreen: boolean = false;
  menuOpen: boolean = false;
  userData: User | null | undefined = null;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.auth.user$.subscribe(profile => {
      this.userData = profile;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
    if (!this.isSmallScreen) {
      this.menuOpen = false; // Reset menuOpen on larger screens
    }
  }

  
  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
