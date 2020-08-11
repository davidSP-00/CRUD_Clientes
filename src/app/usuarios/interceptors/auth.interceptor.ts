import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import {catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor  implements HttpInterceptor{
    constructor(private authService:AuthService,private route:Router){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(req).pipe(
            catchError(e=>{
                if(e.status==401){

                    if(this.authService.isAuthenticated()){
                      this.authService.logout();
                    }
                    this.route.navigate(['login']);
              
                  }
                  if(e.status==403){
                    Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,'warning')
                    this.route.navigate(['clientes']);
                
              
                  }
                  return throwError(e);
            })
        )
    }


    
}



