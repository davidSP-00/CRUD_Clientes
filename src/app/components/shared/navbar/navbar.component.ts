import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/usuarios/usuario';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
 

  constructor(private authService:AuthService,private router:Router) {
   }

   get usuario(){
     return this.authService.usuario.username;
   }
  ngOnInit(): void {
  }
  get isAuthenticated(){
    return this.authService.isAuthenticated();
  }

  logout(){
    let username=this.authService.usuario.username;
    this.authService.logout();
    
    Swal.fire('Logout',`Hola ${username}, has cerrado sesion con exito!`,
    'success' );
    this.router.navigate(['login']);

  }
}
