import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.class';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import {tap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DetalleService } from 'src/app/services/detalle.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[]=[];
  paginador:any;
  clienteSeleccionado:Cliente;

  constructor(private _cs: ClienteService,private activatedRoute:ActivatedRoute,
    private detalleService:DetalleService,private authService:AuthService) {
    
   }
    hasRole(role:string){
     return this.authService.hasRole(role);
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
let page:number=+params.get('page');
if(!page){
  page=0;
}

      this._cs.getClientes(page).pipe(
        tap(response=>{
          console.log(response);
          
        })
      ).subscribe(response=>{

        this.clientes=(response.content as Cliente[]);
        this.paginador=response;
      }
      );

    });
    this.detalleService.notificarUpload.subscribe(
      (cliente:Cliente)=>{
        this.clientes.map(clienteOriginal=>{
          if(cliente.id==clienteOriginal.id){
            clienteOriginal.foto=cliente.foto;
          }
          return clienteOriginal;
        })
      }
    )
      
   
    
  }

  delete(cliente: Cliente) {
    Swal.fire({
      title: 'Estas seguro',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo',
      cancelButtonText: 'No,cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      reverseButtons: true,
      buttonsStyling: false,

    }).then(result => {
      if (result.value) {
        this._cs.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli != cliente);

            Swal.fire('Eliminado', `Cliente ${cliente.nombre} ha sido eliminado`, 'success')
          })
      }
    })

  }
  abrirModal(cliente:Cliente){
    this.clienteSeleccionado=cliente;
    this.detalleService.abrirModal();

  }

}
