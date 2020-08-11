import { Injectable ,} from '@angular/core';
import {DatePipe} from '@angular/common'
import { Cliente } from '../components/clientes/cliente.class';
import {Observable, throwError} from 'rxjs';
import { map, catchError ,tap} from 'rxjs/operators';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from '../components/clientes/region.class';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint ='http://localhost:8080/api/clientes'
  //private httpHeaders=new HttpHeaders({'Content-Type':'application/json'})
  

  constructor(private http:HttpClient,private route:Router) { }
  
 /*  private agregarAuthorizationHeader(){
    let token=this.authService.token;

    if(token!=null){
      return this.httpHeaders.append('Authorization','Bearer '+token);
    }
    return this.httpHeaders;

  } */

/*   private isNoAutorizado(e):boolean{
    if(e.status==401){

      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.route.navigate(['login']);
      return true;

    }
    if(e.status==403){
      Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,'warning')
      this.route.navigate(['clientes']);
      return true;

    }
    return false;
  }
 */
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }
  getClientes(page:number):Observable<any>{

  
   // return of(CLIENTES);}
    return this.http.get(this.urlEndPoint+"/page/"+page).pipe(
      tap((response:any)=>{
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre);
        })
      }),
      map((response:any)=>{
        (response.content as Cliente[]).map(cliente=>{
          cliente.nombre=cliente.nombre.toUpperCase();
          let datePipe=new DatePipe('es');
          cliente.createAt=datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy')
          /* formatDate(cliente.createAt,'dd-MM-yyyy','en-US'); */
          return cliente;
        });
        return response;

      }),tap((response)=>{
        response.content.forEach(cliente=>{
          console.log(cliente.nombre);
        })
      }),
    );
  }


  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente).pipe(
      map((response:any)=>response.cliente as Cliente),
      catchError(e=>{
        if(e.status==400){
          return throwError(e);
          

        }

if(e.error.mensaje){
        console.error(e.error.mensaje);}
        return throwError(e);
      })
    );
  }


  getCliente(id):Observable<Cliente>{

    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        if(e.status!=401 && e.error.mensaje){
          this.route.navigate(['clientes']);
          console.error(e.error.mensaje);
        }
        
        console.error(e.error.mensaje);
      return throwError(e);
      })
    );
  }
  update(cliente:Cliente):Observable<Cliente>{
    return this.http.put(this.urlEndPoint,cliente).pipe(
      map((response:any)=>response.cliente as Cliente),
      catchError(e=>{
        if(e.status==400){
          return throwError(e);
          

        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);}
        return throwError(e);
      })
    );
  }
  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        if(e.status==400){
          return throwError(e);

        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);}
        return throwError(e);
      })
    );
  }

  subirFoto(archivo :File,id):Observable<HttpEvent<{}>>{

    let formData=new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });



    return this.http.request(req);


  }
}
