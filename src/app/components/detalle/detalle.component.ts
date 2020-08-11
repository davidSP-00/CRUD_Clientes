import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../clientes/cliente.class';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import { NgModel, NgForm } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { DetalleService } from 'src/app/services/detalle.service';
import { AuthService } from 'src/app/services/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente:Cliente=new Cliente();
  fotoNueva:string='Seleccione Foto'
  titulo:string="Detalle del cliente";


  private fotoSeleccionada:File;
  progreso:number=0;

  
  inputFoto:NgForm;
  

  constructor(private service:ClienteService,
    private detalleService:DetalleService,private authService:AuthService,
    private facturaService:FacturaService) { }

  ngOnInit(): void {
  }
  
  hasRole(role:string){
    return this.authService.hasRole(role);
  }

  seleccionarFoto(event,fotoForm:NgForm){
    this.progreso=0;
    this.fotoSeleccionada=event.target.files[0];
    if(!this.fotoSeleccionada){
      this.fotoNueva='Seleccione Foto';
      return;
    }
    console.log(this.fotoSeleccionada)
    if(this.fotoSeleccionada){

      if(this.fotoSeleccionada.type.indexOf('image')<0){


        Swal.fire('Error seleccionar imagen: ','El archivo debe ser del tipo imagen','error');
  this.fotoSeleccionada=null;
  this.fotoNueva='Seleccione Foto';
  fotoForm.reset();
  return;
      }this.fotoNueva=this.fotoSeleccionada.name;
    }
    

  }
  subirFoto(fotoForm:NgForm){
    if(fotoForm.invalid){
      Swal.fire('Error seleccionar imagen: ','Debe seleccionar una foto','error');
      return;
    }
    this.service.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(
      event=>{
       // this.cliente=cliente;
        if(event.type===HttpEventType.UploadProgress){
          this.progreso=Math.round((event.loaded/event.total)*100);
        }else if(event.type===HttpEventType.Response){
          let response:any=event.body;
          this.cliente=response.cliente as Cliente;

          this.detalleService.notificarUpload.emit(this.cliente);


          Swal.fire('La foto se ha subido completamente!',`La foto se ha subido con exito:${this.cliente.foto}`,'success');
          fotoForm.reset();
          this.fotoNueva='Seleccione Foto';
        }
       
      }
    );
  }
  get cerrar(){

    return this.detalleService.modal;
  }
  cerrarModal(){
    this.detalleService.cerrarModal( );
      this.fotoSeleccionada=null;
      this.progreso=0;
   
  }
  delete(factura:Factura){
    Swal.fire({
      title: 'Estas seguro',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
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
        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(fact => fact != factura);

            Swal.fire('Factura Eliminada', `Factura ${factura.descripcion} eliminada con exito`, 'success')
          })
      }
    })

  }
}
