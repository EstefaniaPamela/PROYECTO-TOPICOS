import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { User } from '../shared/user.interface';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {  of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;
  public isLogged: any =false;

  constructor(private afAuth:AngularFireAuth, private afs: AngularFirestore,
    public platform: Platform){
    afAuth.authState.subscribe(user =>(this.isLogged = user));
    this.user$ = this.afAuth.authState.pipe(
      switchMap ((user)=>{
       if (user){
         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
       } 
       return of(null);
      })
    );
   }
  
 
   obtenerDatosUsuario (){
    return this.afAuth.authState;
  }

  async resetPassword(email: string): Promise<void>{
    try{
      return this.afAuth.sendPasswordResetEmail(email);
    }catch (error) {
      console.log('Error->', error);
    }
  }
  
  async loginGoogle(): Promise<User>{
    if(this.platform.is('android')){
      //alert('es android');
      try{
        const { user }= await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        this.updateUserData(user);
        return user;
      }catch (error) {
        console.log('Error->', error);
        alert("Error Ingrese un correo válido y una clave de almenos 6 caracteres");
      }
    }else if(this.platform.is('desktop')){
      //alert('es desktop');
      try{
        const { user }= await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        this.updateUserData(user);
        return user;
      }catch (error) {
        console.log('Error->', error);
        alert("Error Ingrese un correo válido y una clave de almenos 6 caracteres");
      }
    }else{
      try{
      const { user }= await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      this.updateUserData(user);
      return user;
    }catch (error) {
      console.log('Error->', error);
      alert("Error Ingrese un correo válido y una clave de almenos 6 caracteres");
    }
    }
    
  }
  
  async register(email: string, password: string): Promise<User>{
    try{
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email,password);
      await this.sendVerificationEmail();
      return user;
    }catch(error){
      console.log('Error->',error);
      alert("Error Ingrese un correo válido y una clave de almenos 6 caracteres");
    }
  }
  
  async login(email: string, password: string): Promise<User>{
    try{
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    } catch (error) {
      console.log('Error->', error);
      alert("Error Ingrese un correo válido y una clave de almenos 6 caracteres");
    }

  }

  async sendVerificationEmail(): Promise<void>{
    try{
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error){
      console.log('Error->', error);
    }
  }

  async logout(): Promise<void>{
    try{
      await this.afAuth.signOut();
    }catch(error){
      console.log('Error->',error);
    }
  }

  async updateUserData (user: User){
    const userRef: AngularFirestoreDocument<User> =this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email : user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };

    return userRef.set(data, {merge: true});

  }
  
}