import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();

  constructor(private accountService: AccountService, 
    private toastr: ToastrService, 
    private formBuidler: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuidler.group({
      gender: ["male"],
      knownAs: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      email:["", [
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

    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === control.parent?.get(matchTo)?.value) return null;
      else return { notMatching: true };
    };
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls["dateOfBirth"].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};

    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: error => {
        this.toastr.error(error) 
      }
    })
  }

      // error: errorObject => {
      //   if (errorObject.error.errors) {
      //     if (errorObject.error.errors.Email) {
      //       this.toastr.error(errorObject.error.errors.Email)
      //     } else if (errorObject.error.errors.Password) {
      //       this.toastr.error(errorObject.error.errors.Password)
      //     }
      //   } else {
      //     this.toastr.error(errorObject.error) 
      //   }
      // }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    let theDob = new Date(dob)
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
  }
}
