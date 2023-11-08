import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  model: any = {}

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => { 
        this.router.navigateByUrl("/members") 
        this.model = {}
      },
      error: errorObject => this.toastr.error(errorObject.error)
    })
  }

  logout(){
    this.accountService.Logout()
    this.router.navigateByUrl("/")
  }
}
