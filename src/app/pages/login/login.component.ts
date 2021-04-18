import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme = false;
  
  // en el constructir se inyecta los servicios
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

    if (localStorage.getItem('email',)) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
    
  }
  login(form: NgForm) {
  
  
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    //peticion al servicio
    this.auth.Login(this.usuario).subscribe(resp => {
      console.log(resp);
      Swal.close();
      if (this.recordarme) {
        localStorage.setItem('email', this.usuario.email);
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.error.message,
  
      
        
      });

    });


  }
}
