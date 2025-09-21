import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { App } from '../../../models/App';
import { AplicacionesService } from '../../../services/aplicaciones.service';
import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { FORMS_IMPORTS } from '../../../imports/forms.import';
import { Dialog } from 'primeng/dialog';
import { Actualizacion } from '../../../models/Actualizacion';
import { FiltroActualizacion } from '../../../models/Filtros';
import { ActualizacionesService } from '../../../services/actualizaciones.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'app-detalle-aplicacion',
  standalone: true,
  imports: [
    ...FORMS_IMPORTS,
    Dialog,
    Button,
    DividerModule,
    TableModule,
    ConfirmPopup
  ],
  providers: [ConfirmationService],
  templateUrl: './detalle-aplicacion.html',
  styleUrl: './detalle-aplicacion.scss'
})
export class DetalleAplicacion {
  app:App
  idApp:number = 0;
  mostrarmodalAddMod: boolean = false;
  decimal_mask:any;

  filtroActual:FiltroActualizacion = new FiltroActualizacion();
  pagos:Actualizacion[] = [];

  actualizaciones:Actualizacion[] = [];
  totalRecords:number = 0;
  loading:boolean = false;

  formActualizacion:FormGroup;

  constructor(
    private rutaActiva: ActivatedRoute,
    private aplicacionesService: AplicacionesService,
    private actualizacionesService: ActualizacionesService,
    private Notificaciones: NotificacionesService,
    private confirmationService: ConfirmationService,
  ) {
    this.formActualizacion = new FormGroup({
      resumen: new FormControl('', [Validators.required]),
      mejoras: new FormControl(''),
      correcciones: new FormControl(''),
      avances: new FormControl(''),
      version: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.formActualizacion.get(campo);
    return !!(control && control.invalid && control.dirty);
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.decimal_mask = {
        mask: Number,
        scale: 2,
        thousandsSeparator: '.',
        radix: ',',
        normalizeZeros: true,
        padFractionalZeros: true,
        lazy: false,
        signed: true
      }

      //Obtenemos el id de la app desde la url
      this.idApp = this.rutaActiva.snapshot.params['idApp'];
      if(this.idApp != 0){
        this.ObtenerApp();
      }
    });
  }

  ObtenerApp(){
    this.aplicacionesService.ObtenerApp(this.idApp).subscribe(response => {
      console.log(response)
      this.app = response;
    });
  }

  BuscarActualizaciones(event?: TableLazyLoadEvent) {
    if(this.idApp == 0) return;

    this.loading = true;

    const pageIndex = (event?.first ?? 0) / (event?.rows ?? 10);
    const pageSize = event?.rows ?? 10;

    this.filtroActual = new FiltroActualizacion({
        pagina: pageIndex + 1,  
        tamanioPagina: pageSize,
        idApp: this.idApp
    });

    this.actualizacionesService.ObtenerActalizaciones(this.filtroActual).subscribe(response => {
      this.pagos = response.registros;
      this.totalRecords = response.total;
      this.loading = false;
    });
  }

  AgregarActualizacion(){
    this.mostrarmodalAddMod = true;
  }

  EliminarActualizacion(event: Event, idActualizacion:number){
    this.confirmationService.confirm({
      target: event.target as EventTarget, 
      message: '¿Borrar el registro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      rejectButtonProps: {
          severity: 'secondary',
          outlined: true
      },
      accept: () => {
        this.actualizacionesService.Eliminar(idActualizacion)
        .subscribe(response => {
          if(response == "OK"){

            this.Notificaciones.Success("Pago borrado correctamente");

            //Quitamos del array
            const indice = this.actualizaciones.findIndex(p => p.id == idActualizacion);
            if(indice != -1) this.actualizaciones.splice(indice, 1);

          }else{
            this.Notificaciones.Error("Ocurrió un error al actualizar borrar el pago");
          }
        });
      }
    });
  }

  GuardarActualizacion(){
    if(this.formActualizacion.invalid) return;
    
    let nuevaActualizacion = new Actualizacion();
    nuevaActualizacion.resumen = this.formActualizacion.value.resumen;
    nuevaActualizacion.mejoras = this.formActualizacion.value.mejoras;
    nuevaActualizacion.correcciones = this.formActualizacion.value.correcciones;
    nuevaActualizacion.avances = this.formActualizacion.value.avances;
    nuevaActualizacion.version = this.formActualizacion.value.version;
    nuevaActualizacion.estado = this.formActualizacion.value.estado;

    this.actualizacionesService.Agregar(nuevaActualizacion)
    .subscribe(response => {
      if(response == "OK"){
        this.Notificaciones.Success("Actualización creada correctamente");
        this.mostrarmodalAddMod = false;
        this.BuscarActualizaciones();
      }else{
        this.Notificaciones.Warn(response);
      }
    });
  }
}
