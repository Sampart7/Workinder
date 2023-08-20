import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: any
  register = false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe({
        next: (result:any) => { this.users = result },
        error: (error:any) => { console.log(error) }
    })
  }

  registerToggle() {
    this.register = !this.register
  }

  cancelRegisterToggle(event: boolean) {
    this.register = event
  }
}
