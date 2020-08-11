import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class TokenInterceptor  implements HttpInterceptor{
    constructor(private authService:AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token=this.authService.token;
        if(token!=null){
            const authReq=req.clone({
                headers:req.headers.set('Authorization','Bearer '+token)
            });
            console.log('Token Interceptor'+'Bearer '+token)
            return next.handle(authReq);
        }
        return next.handle(req);
    }


    
}



