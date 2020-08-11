import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {

modal:boolean=false;
private _notificarUpload=new EventEmitter<any>();

  constructor() { }
  abrirModal(){
this.modal=true;
  }

  cerrarModal(){
this.modal=false;
  }
  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  }
}
