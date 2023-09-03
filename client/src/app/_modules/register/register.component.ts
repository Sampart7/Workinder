import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  model: any = {}

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => { this.cancel() },
      error: errorObject => {
        if (errorObject.error.errors) {
          if (errorObject.error.errors.Username) {
            this.toastr.error(errorObject.error.errors.Username)
          } else if (errorObject.error.errors.Password) {
            this.toastr.error(errorObject.error.errors.Password)
          }
        } else {
          this.toastr.error(errorObject.error) 
        }
      }
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
