import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../../models/Cliente';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PagoCliente } from '../../../models/PagoCliente';
import { FiltroPagosCli } from '../../../models/filtros/FiltroPagosCli';
import { PagosClienteService } from '../../../services/pagos-cliente.service';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FORMS_IMPORTS } from '../../../imports/forms.import';
import { GlobalesService } from '../../../services/globales.service';
import { AddmodClientes } from '../addmod-clientes/addmod-clientes';

@Component({
  selector: 'app-detalle-clientes',
  standalone: true,
  imports: [
    ...FORMS_IMPORTS,
    Tooltip,
    ConfirmPopupModule,
    DividerModule,
    TableModule,
    Dialog,
    AddmodClientes
  ],
  providers: [ConfirmationService],
  templateUrl: './detalle-clientes.html',
  styleUrl: './detalle-clientes.scss'
})
export class DetalleClientes {
  @ViewChild('montoInput') montoInput!: ElementRef<HTMLInputElement>;

  DNICliente:string = "";
  cliente:Cliente = new Cliente();
  pagos:PagoCliente[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  filtroActual!: FiltroPagosCli;

  mostrarmodalAddMod: boolean = false;
  mostrarModalPago: boolean = false;
  formPago:FormGroup;
  decimal_mask: any;

  constructor(
    private rutaActiva: ActivatedRoute,
    private Notificaciones: NotificacionesService,
    private Globales:GlobalesService,
    private clientesService: ClientesService,
    private pagosClienteService: PagosClienteService,
    private confirmationService: ConfirmationService,
  ){
    this.formPago = new FormGroup({
      monto: new FormControl('', [Validators.required]),
      obs: new FormControl(''),
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.formPago.get(campo);
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

      //Obtenemos el id de la caja desde la url
      this.DNICliente = this.rutaActiva.snapshot.params['dni'];
      if(this.DNICliente && this.DNICliente != ""){
        this.ObtenerCliente();
        this.BuscarPagos();
      }
    });
  }

  RecargarDatos(valor:boolean){
    if(valor)
      this.ObtenerCliente();
    
    this.mostrarmodalAddMod = false;
  }

  ObtenerCliente(){
    this.clientesService.ObtenerCliente(this.DNICliente)
    .subscribe(response => {
      this.cliente = response;
    });
  }

  BuscarPagos(event?: TableLazyLoadEvent) {
    if(this.DNICliente == "") return;

    this.loading = true;

    const pageIndex = (event?.first ?? 0) / (event?.rows ?? 10); // página actual
    const pageSize = event?.rows ?? 10;

    this.filtroActual = new FiltroPagosCli({
        pagina: pageIndex + 1,   // tu backend usa base 1
        tamanioPagina: pageSize,
        DNICliente: this.DNICliente
    });

    this.pagosClienteService.ObtenerPagos(this.filtroActual).subscribe(response => {
      this.pagos = response.registros;
      this.totalRecords = response.total;
      this.loading = false;
    });
  }

  ConfirmarCambioEstado(event: Event, idApp:number, habilitado:boolean) {
    this.confirmationService.confirm({
      target: event.target as EventTarget, 
      message: '¿Actualizar el estado de la terminal?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      rejectButtonProps: {
          severity: 'secondary',
          outlined: true
      },
      accept: () => {
        this.clientesService.ActualizarEstadoTerminal(this.cliente.DNI!, idApp, !habilitado)
        .subscribe(response => {
          if(response == "OK"){

            this.Notificaciones.Success("Estado de la terminal actualizado correctamente");
            let app = this.cliente.apps.find(a => a.app?.id == idApp);
            if(app) app.habilitado = !app?.habilitado;

          }else{
            this.Notificaciones.Error("Ocurrió un error al actualizar el estado de la terminal");
          }
        });
      }
    });
  }

  ConfirmarEliminar(event: Event, terminal:string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget, 
      message: '¿Eliminar esta terminal?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      rejectButtonProps: {
          severity: 'secondary',
          outlined: true
      },
      accept: () => {
        this.clientesService.EliminarTerminal(terminal)
        .subscribe(response => {
          if(response == "OK"){

            this.Notificaciones.Success("Terminal eliminada correctamente");
            this.cliente.apps = this.cliente.apps.filter(a => a.terminal != terminal);
          }else{
            this.Notificaciones.Error("Ocurrió un error al intentar eliminar la terminal");
          }
        });
      }
    });
  }

  AgregarPago(){
    this.formPago.reset();
    this.mostrarModalPago = true;
  }

  EliminarPago(event: Event, idPago:number){
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
        this.pagosClienteService.Eliminar(idPago)
        .subscribe(response => {
          if(response == "OK"){

            this.Notificaciones.Success("Pago borrado correctamente");

            //Quitamos del array
            const indice = this.pagos.findIndex(p => p.id == idPago);
            if(indice != -1) this.pagos.splice(indice, 1);

          }else{
            this.Notificaciones.Error("Ocurrió un error al actualizar borrar el pago");
          }
        });
      }
    });
  }

  GuardarPago(){
    if(this.formPago.invalid) return;
   
    let nuevoPago = new PagoCliente();
    nuevoPago.monto = this.Globales.EstandarizarDecimal(this.formPago.value.monto);
    nuevoPago.obs = this.formPago.value.obs;
    nuevoPago.idCliente = this.cliente.id;

    this.pagosClienteService.Agregar(nuevoPago)
    .subscribe(response => {
      if(response == "OK"){
        this.Notificaciones.Success("Pago agregado correctamente");
        this.mostrarModalPago = false;
        this.BuscarPagos();
      }else{
        this.Notificaciones.Warn(response);
      }
    });
  }
}
