import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-docente-add',
  templateUrl: './crud-docente-add.component.html',
  styleUrls: ['./crud-docente-add.component.css']
})
export class CrudDocenteAddComponent {

   // Para Ubigeo
    departamentos : string[] = [];
    provincias : string[] = [];
    distritos : Ubigeo[] = [];

  // JSON para registrar
  // todos los valores del formulario van a llegar aqui
  // y se relacionan en el html con la propiedad Ng Model :)
  docente : Docente ={
      idDocente :0,
      nombre : "",
      dni : "",
      estado : 1,
      ubigeo : {
        idUbigeo : -1,
        departamento: "-1",
        provincia: "-1",
        distrito: "-1",
      },
  };

  // Para la validacion del registro
  formsRegistra = this.formBuilder.group({
        validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]],
        validaDni: ['', [Validators.required,Validators.pattern('[0-9]{8}')]],
        validaDepartamento: ['', [Validators.min(1)]],
        validaProvincia: ['', [Validators.min(1)]],
        validaDistrito: ['', [Validators.min(1)]]
  });

  // Creamos el constructor para Inicializar el UbigeoService
  constructor(public dialogRef: MatDialogRef<CrudDocenteAddComponent>,
              private ubigeoService: UbigeoService,
              private docenteService:DocenteService, 
              private formBuilder: FormBuilder,
              ){
    this.ubigeoService.listarDepartamento().subscribe(
            x => this.departamentos = x
    )
  };

  //Para cerrar el dialog
  onNoClick(): void {
    this.dialogRef.close();
}

  cargaProvincia(){

    this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
      response =>  this.provincias= response
    )
    this.distritos = [];
    this.docente.ubigeo!.idUbigeo = -1;
    this.docente.ubigeo!.provincia = "-1";
  }

  cargaDistrito(){
    this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
      response =>  this.distritos = response
    );
    this.docente.ubigeo!.idUbigeo = -1;
}

//
registra(){
  console.log(">>> registra  >> ");
  console.log(">>> idDocente >> " + this.docente.idDocente);
  console.log(">>> nombre >>  " + this.docente.nombre);
  console.log(">>> dni >>  " + this.docente.dni);
  console.log(">>> estado >>  " + this.docente.estado);
  console.log(">>> idUbigeo >>  " + this.docente.ubigeo?.idUbigeo);
  console.log(">>> departamento >>  " + this.docente.ubigeo?.departamento);
  console.log(">>> provincia >>  " + this.docente.ubigeo?.provincia);
  console.log(">>> distrito >>  " + this.docente.ubigeo?.distrito);

      
            // pasamos todo el objeto docente 
            this.docenteService.inserta(this.docente).subscribe(
                  x => { 
                            // una vez que inserto, muestro el mensaje
                            Swal.fire('Mensaje', x.mensaje, 'info'); 
                            // luego borramos todo el  json, es decir, inicializamos las variables
                            this.docente = { 
                              idDocente:0,
                              nombre:"",
                              dni:"",
                              estado:1,
                              ubigeo:{
                                idUbigeo: -1,
                                departamento:"-1",
                                provincia:"-1",
                                distrito:"-1",
                              }
                            };
                        }   
            );
      
}

}
