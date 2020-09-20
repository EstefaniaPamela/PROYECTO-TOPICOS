import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authSvc:AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onRegister(email, password){
    try{
      const user= await this.authSvc.register(email.value, password.value);
      if (user) {
        console.log('User->',user);
        window.confirm('Usuario creado con éxito!!');
        this.router.navigate(['\login']);
      }

    }catch(error){console.log('Error',error)}
  }

}