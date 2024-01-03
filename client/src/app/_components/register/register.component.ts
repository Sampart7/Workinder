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
  minDate: Date = new Date();
  validationErrors: string[] | undefined

  constructor(private accountService: AccountService, 
    private toastr: ToastrService, 
    private formBuidler: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
  }

  initializeForm() {
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
      ]],
      agreeToTerms: [false, Validators.requiredTrue],
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
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: error => {
        this.toastr.error(error);
        this.validationErrors = error;
      }
    })
  }
  
  cancel() {
    this.cancelRegister.emit(false);
  }
}
