import { Component, OnInit } from '@angular/core';
import { Cliente } from '../clientes/cliente.class';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router'
import swal from 'sweetalert2'
import { NgForm } from '@angular/forms';
import { Region } from '../clientes/region.class';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente();
  regiones:Region[];

  errores:string[];



  constructor(private clienteService: ClienteService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones=>{
      this.regiones=regiones;
          });
  }
  cargarCliente(): void {
    
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
console.log(cliente);
          this.cliente = cliente;
        }
        

        )
      }
      
    });
 
  }

  create(clienteForm:NgForm): void {
    if(clienteForm.invalid){
      return;
    }
    this.clienteService.create(this.cliente).subscribe(
      cliente => {

        this.router.navigate(['clientes']);
        swal.fire('Cliente Creado', `Cliente ${this.cliente.nombre} creado con exito`, 'success');
      },
      err=>{
        this.errores=err.error.errors as string[];
        console.error('Codigo del error desde el backend:'+err.status);
        console.error(err.error.errors);
      }
    );
  }
  update(clienteForm:NgForm):void{
    if(clienteForm.invalid){
      return;
    }
    this.cliente.facturas=null;
    this.clienteService.update(this.cliente).subscribe(cliente=>{
      this.router.navigate(['clientes']);
      swal.fire('Cliente Actualizado',`Cliente ${this.cliente.nombre} actualizado con exito`, 'success');
    },err=>{
      this.errores=err.error.errors as string[];
      console.error('Codigo del error desde el backend:'+err.status);
      console.error(err.error.errors);
    })
    

  }



  compararRegion(o1:Region,o2:Region):boolean{
    if(o1==null&&o2==null){
      return true;
    }
    console.log(o1);
    console.log(o2);
    if(o1==null || o2==null){
      return false;
    }else{
      return o1.id===o2.id;
    }
  /*   return o1===null || o2===null ? false:o1.id===o2.id; */
  }

}
