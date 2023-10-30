import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/member.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  register = false
  user: User | null = null;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser.pipe(take(1)).subscribe({
      next: user => this.user = user
    });
  }

  registerToggle() {
    this.register = !this.register
  }

  cancelRegisterToggle(event: boolean) {
    this.register = event
  }
}
