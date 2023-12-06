import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  signupForm: FormGroup;
  isLoading: boolean;
  error: string;


  constructor(private userService: UserService,private router: Router) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl(
        null,
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(24),
        this.regexValidator(/^[a-zA-Z0-9]+$/)]
      ),
      password: new FormControl(
        null,
        [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(36),
        this.regexValidator(/[!@#$%^&*(),.?":{}|<>]/)]
      )
    })

  }

  onLogin() {
    if (!this.signupForm.valid) {
      this.signupForm.get('username').markAsTouched();
      this.signupForm.get('password').markAsTouched();
      return;
    }

    this.isLoading = true;
    
    const username:string = this.signupForm.get('username')?.value;
    const password:string = this.signupForm.get('password')?.value;

    this.userService.login(username,password)
    .subscribe({
      error: (e) => {
        this.error = e.error.message;
        this.isLoading = false
      },
      complete: () => {
        this.router.navigate(['/Minigames']);
        this.isLoading = false;
        this.error = '';

      }
    });

    this.signupForm.reset();
  }
  onRegister() {
    if (!this.signupForm.valid) {
      this.signupForm.get('username').markAsTouched;
      this.signupForm.get('password').markAsTouched;
      return;
    }

    this.isLoading = true;

    const username:string = this.signupForm.get('username')?.value;
    const password:string = this.signupForm.get('password')?.value;

    this.userService.register(username,password)
    .subscribe({
      error: (e) => {
        this.error = e.error.message;
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false;
        this.error = '';
      }
    });

  }

  regexValidator(regex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = regex.test(control.value);
      return forbidden ? null : { regex: { value: control.value } };
    };
  }

}
