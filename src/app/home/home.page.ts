import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { User } from '../shared/user.interface';
import { from, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth'
import {Platform} from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public user$: Observable<User>;
  usuario: string;
  email: string;

  
  // Readable Address
  address: string;

  // Location coordinates
  latitude: number;
  longitude: number;
  accuracy: number;

  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  subscribe:any;
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private authservice: AuthService, 
    private afAuth:AngularFireAuth, 
    public platform: Platform
  ) 
  {
    this.subscribe = this.platform.backButton.subscribeWithPriority(666666,()=>
      {
        if(this.constructor.name =="HomePage"){
          navigator["app"].exitApp();
        }
      })
  }


  //Get current coordinates of device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;

      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);

    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.address = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }
  ngOnInit(){
    //this.authservice.obtenerDatosUsuario().subscribe(user$ => console.log(user$));
    this.authservice.obtenerDatosUsuario().subscribe(user$ => {
      //this.usuario = user$.displayName;
      if((this.usuario = user$.displayName)===null){
        this.usuario = 'N/A';
        console.log('es nulo');
      }
      this.usuario = user$.displayName;
      this.email = user$.email;
    });
}}
