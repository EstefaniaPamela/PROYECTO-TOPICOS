import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { User } from '../shared/user.interface';
import { from, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth'
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public user$: Observable<User>;
  usuario: string;
  email: string;

  subscribe:any;
  constructor(private authservice: AuthService, 
    private afAuth:AngularFireAuth, 
    public platform: Platform) {
      this.subscribe = this.platform.backButton.subscribeWithPriority(666666,()=>
      {
        if(this.constructor.name =="HomePage"){
          navigator["app"].exitApp();
        }
      })
    }

  ngOnInit(){
    //this.authservice.obtenerDatosUsuario().subscribe(user$ => console.log(user$));
    this.authservice.obtenerDatosUsuario().subscribe(user$ => {
      //this.usuario = user$.displayName;
      if((this.usuario = user$.displayName)===null){
        this.usuario = 'N/A';
        console.log('es nulo');
      }
      this.email = user$.email;
    });
  }

  /*async logout(): Promise<void>{
    console.log('ingresa al metodo');
    this.backButtonSubscription.unsubscribe();
    try{
      await this.afAuth.signOut();
    }catch(error){
      console.log('Error->',error);
    }
  }*/
}
