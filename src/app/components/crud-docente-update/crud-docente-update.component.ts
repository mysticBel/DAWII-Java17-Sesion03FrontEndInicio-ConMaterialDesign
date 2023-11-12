import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-docente-update',
  templateUrl: './crud-docente-update.component.html',
  styleUrls: ['./crud-docente-update.component.css']
})
export class CrudDocenteUpdateComponent {


    //Json para registrar o actualizar
    docente: Docente = { 
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

  //Para el ubigeo
  departamentos: string[] = [];;
  provincias: string[] = [];;
  distritos: Ubigeo[] = [];;


    // Para la validacion
    formsActualiza = this.formBuilder.group({
      validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{3,30}')]],
      validaDni: ['', [Validators.required,Validators.pattern('[0-9]{8}')]],
      validaDepartamento: ['', [Validators.min(1)]],
      validaProvincia: ['', [Validators.min(1)]],
      validaDistrito: ['', [Validators.min(1)]],
      validaEstado: ['', [Validators.min(0)]],
    });

  constructor(public dialogRef: MatDialogRef<CrudDocenteUpdateComponent>,
              private formBuilder: FormBuilder,
              private docenteService:DocenteService, 
              private ubigeoService:UbigeoService,
              @Inject(MAT_DIALOG_DATA) public data: any) {

        this.docente = data;            
        this.ubigeoService.listarDepartamento().subscribe(
        response => this.departamentos = response
        );  
        this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
        response =>  this.provincias= response
        );
        this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
        response =>  this.distritos= response
        ); 
     }

    onNoClick(): void {
          this.dialogRef.close();
        }

        cargaProvincia(){
          this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
            response =>  this.provincias= response
          );
        
          this.distritos = [];
          this.docente.ubigeo!.idUbigeo = -1;
          this.docente.ubigeo!.provincia = "-1";
        }
        
        cargaDistrito(){
          this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
              response =>  this.distritos= response
          );
          this.docente.ubigeo!.idUbigeo = -1;
        }
        actualiza(){

              this.docenteService.actualiza(this.docente).subscribe(
                    x => { 
                      Swal.fire('Mensaje', x.mensaje, 'info'); 
                    }   
              );
        }
        
}
