import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public loginFormGroup: FormGroup;
  public registerFormGroup: FormGroup;

  public isRegistering: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
    this.isRegistering = false;
  }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerFormGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      againPassword: ['', Validators.required],
    });
  }

  onLoginSuccess(token: string): void {
    this.router.navigate(['home']);
    console.log("test")
  }

  logForm(): void {
    this.userService.login(this.loginFormGroup.get('email').value, this.loginFormGroup.get('password').value, (token: string) => { this.onLoginSuccess(token) })
  }

  registerForm(): void {
    this.userService.signUpUser(this.registerFormGroup.get('email').value, this.registerFormGroup.get('password').value, (token: string) => { this.onLoginSuccess(token) });
  }

  stateRegister(): void {
    this.isRegistering = true;
  }

  stateLogin(): void {
    this.isRegistering = false;
  }
}
