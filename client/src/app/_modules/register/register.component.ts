import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  @Output() cancelRegister = new EventEmitter();
  model: any = {}
  registerForm: FormGroup = new FormGroup({});

  constructor(private accountService: AccountService, 
    private toastr: ToastrService, 
    private formBuidler: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuidler.group({
      gender: ["male"],
      knownAs: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      username:["", [
        Validators.required, 
        Validators.pattern("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" + 
        "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,3})$")
      ]],
      password: ["", [
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(24), 
        Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/)
      ]],
      confirmPassword: ["", [
        Validators.required,
        this.matchValues("password")
      ]]
    });
    this.registerForm.controls["password"].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === control.parent?.get(matchTo)?.value) return null;
      else return { notMatching: true };
    };
  }

  register() {
    console.log(this.registerForm?.value);
    // this.accountService.register(this.model).subscribe({
    //   next: () => { this.cancel() },
    //   error: errorObject => {
    //     if (errorObject.error.errors) {
    //       if (errorObject.error.errors.Username) {
    //         this.toastr.error(errorObject.error.errors.Username)
    //       } else if (errorObject.error.errors.Password) {
    //         this.toastr.error(errorObject.error.errors.Password)
    //       }
    //     } else {
    //       this.toastr.error(errorObject.error) 
    //     }
    //   }
    // })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
