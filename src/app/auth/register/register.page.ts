import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamRocketService } from '../../services/team-rocket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  public registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private teamRocketService: TeamRocketService) {

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  logForm() {
    console.log(this.teamRocketService.getAPIUrl());
  }
}
