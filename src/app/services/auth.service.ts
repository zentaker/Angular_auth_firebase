import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/Operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyCbmqYmt_lihYvv6yWCAIgCSH2Z2O9POYk';
  userToken: string;



  //crear nuevos usuarios
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]


  //la autenticacion 
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  //el constructor se crea ni bien ingresas  
  constructor(private http: HttpClient) {

    //justo cuando ingresas sabes si hay un token
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token')

   }
  
  Login(usuario: UsuarioModel) {
    
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apikey}`,
      authData

    ).pipe(
      //servir como intermediario, si viene el token
      map(resp => {
        //filtrar la informacion 
        this.guardarToken(resp['idToken']);
        return resp
      })
    )

  }

  nuevoUsuario(usuario: UsuarioModel) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signUp?key=${this.apikey}`,
      authData

    ).pipe(
      //servir como intermediario, si viene el token
      map(resp => {
        //filtrar la informacion 
        this.guardarToken(resp['idToken']);
        return resp
      })
    )

  }

  private guardarToken(idToken: string) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString())

  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
      
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }
  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
   
  
  }
}
