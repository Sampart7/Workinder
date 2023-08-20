import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  users: any

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

}
