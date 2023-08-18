import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './modules/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Workinder';
  users: any;

  constructor(private http: HttpClient, private accountService: AccountService) {}

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }

  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe({
        next: (result:any) => {this.users = result},
        error: (error:any) => {console.log(error)}
    })
  }

  setCurrentUser() {
    const localUser = localStorage.getItem("user")

    if(!localUser) return;
    const user: User = JSON.parse(localUser);
    this.accountService.setCurrentUser(user);
  }
}