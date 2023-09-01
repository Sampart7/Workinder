import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users: any;
  
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser()
  }

  setCurrentUser() {
    const localUser = localStorage.getItem("user");

    if(!localUser) return

    const user: User = JSON.parse(localUser)
    this.accountService.setCurrentUser(user)
  }
}