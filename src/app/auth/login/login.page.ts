import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public loginFormGroup: FormGroup;
  public registerFormGroup: FormGroup;

  public isRegistering: boolean;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.isRegistering = false;
  }

  ngOnInit() {
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

  logForm() {
    // TODO: Login user

    
  }

  registerForm() {
    // TODO: Register user
    this.userService.signUpUser();
  }

  stateRegister() {
    this.isRegistering = true;
  }

  stateLogin() {
    this.isRegistering = false;
  }
}
