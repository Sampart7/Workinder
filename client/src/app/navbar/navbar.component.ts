import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  model: any = {}

  constructor(public accountService: AccountService) { }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => { console.log(response) },
      error: error => { console.log(error) }
    })
  }

  logout(){
    this.accountService.Logout()
  }
}
