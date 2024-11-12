import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-build-strategy-page',
  templateUrl: './build-strategy-page.component.html',
  styleUrls: ['./build-strategy-page.component.css']
})
export class BuildStrategyPageComponent {
  user$ = this.auth.user$;

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {}
}