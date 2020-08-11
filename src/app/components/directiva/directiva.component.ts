import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {
  listaCurso:string[]=['Typescript','Java','David','Sullcaray'];

  habilitar:boolean=true;

  constructor() { }

  ngOnInit(): void {
  }
  setHabilitar(){
    this.habilitar=!this.habilitar;
  }

}
