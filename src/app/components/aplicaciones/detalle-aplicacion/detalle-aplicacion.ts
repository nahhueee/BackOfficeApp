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
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TerminalFlota } from '../../../models/TerminalFlota';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-aplicacion',
  standalone: true,
  imports: [
    ...FORMS_IMPORTS,
    CommonModule,
    Dialog,
    Button,
    DividerModule,
    TableModule,
    ConfirmPopup,
    ToggleSwitchModule,
    SelectButtonModule,
    SelectModule,
    TagModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './detalle-aplicacion.html',
  styleUrl: './detalle-aplicacion.scss'
})
export class DetalleAplicacion {
  app: App = new App();
  idApp: number = 0;
  mostrarmodalAddMod: boolean = false;
  decimal_mask: any;

  // Actualizaciones
  filtroActual: FiltroActualizacion = new FiltroActualizacion();
  actualizaciones: Actualizacion[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  modificandoActualizacion: boolean = false;
  actualizacionSeleccionada: Actualizacion = new Actualizacion();
  formActualizacion: FormGroup;

  opcionesDestino = [
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend',  value: 'backend'  }
  ];
  opcionesEstado = [
    { label: '✏️ Borrador',      value: 'borrador'      },
    { label: '🐦 Canary',        value: 'canary'        },
    { label: '🚀 Producción',    value: 'produccion'    },
    { label: '❌ Deshabilitada', value: 'deshabilitada' }
  ];
  opcionesAmbiente = [
    { label: 'Test', value: 'test' },
    { label: 'Prod', value: 'prod' }
  ];

  // Flota
  flota: TerminalFlota[] = [];
  loadingFlota: boolean = false;
  rollbackEnProceso: string | null = null;  // terminal UUID en proceso de rollback

  constructor(
    private rutaActiva: ActivatedRoute,
    private aplicacionesService: AplicacionesService,
    private actualizacionesService: ActualizacionesService,
    private Notificaciones: NotificacionesService,
    private confirmationService: ConfirmationService,
  ) {
    this.formActualizacion = new FormGroup({
      resumen:      new FormControl('', [Validators.required]),
      mejoras:      new FormControl(''),
      correcciones: new FormControl(''),
      version:      new FormControl('', [Validators.required]),
      link:         new FormControl('', [Validators.required]),
      ambiente:     new FormControl(''),
      estado:       new FormControl('', [Validators.required]),
      destino:      new FormControl('', [Validators.required]),
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.formActualizacion.get(campo);
    return !!(control && control.invalid && control.dirty);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.idApp = this.rutaActiva.snapshot.params['idApp'];
      if (this.idApp != 0) {
        this.ObtenerApp();
        this.BuscarActualizaciones();
        this.CargarFlota();
      }
    });
  }

  ObtenerApp() {
    this.aplicacionesService.ObtenerApp(this.idApp).subscribe(response => {
      this.app = response;
    });
  }

  // ─── Actualizaciones ─────────────────────────────────────────────────────

  BuscarActualizaciones(event?: TableLazyLoadEvent) {
    if (this.idApp == 0) return;
    this.loading = true;

    const pageIndex = (event?.first ?? 0) / (event?.rows ?? 10);
    const pageSize  = event?.rows ?? 10;

    this.filtroActual = new FiltroActualizacion({
      pagina:        pageIndex + 1,
      tamanioPagina: pageSize,
      idApp:         this.idApp
    });

    this.actualizacionesService.ObtenerActalizaciones(this.filtroActual).subscribe(response => {
      this.actualizaciones = response.registros;
      this.totalRecords    = response.total;
      this.loading         = false;
    });
  }

  AgregarActualizacion() {
    this.modificandoActualizacion = false;
    this.formActualizacion.reset();
    this.actualizacionSeleccionada = new Actualizacion();
    this.formActualizacion.patchValue({ ambiente: 'test', destino: 'backend', estado: 'borrador' });
    this.mostrarmodalAddMod = true;
  }

  EditarActualizacion(idActualizacion: number) {
    this.modificandoActualizacion = true;
    this.actualizacionSeleccionada = this.actualizaciones.find(a => a.id == idActualizacion)!;
    this.formActualizacion.reset();
    this.formActualizacion.patchValue({
      resumen:      this.actualizacionSeleccionada.resumen,
      mejoras:      this.actualizacionSeleccionada.mejoras,
      correcciones: this.actualizacionSeleccionada.correcciones,
      version:      this.actualizacionSeleccionada.version,
      link:         this.actualizacionSeleccionada.link,
      destino:      this.actualizacionSeleccionada.tipo,
      estado:       this.actualizacionSeleccionada.estado,
      ambiente:     this.actualizacionSeleccionada.ambiente,
    });
    this.mostrarmodalAddMod = true;
  }

  EliminarActualizacion(event: Event, idActualizacion: number) {
    this.confirmationService.confirm({
      target:  event.target as EventTarget,
      message: '¿Borrar el registro?',
      icon:    'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.actualizacionesService.Eliminar(idActualizacion).subscribe(response => {
          if (response == 'OK') {
            this.Notificaciones.Success('Actualización borrada correctamente');
            const i = this.actualizaciones.findIndex(p => p.id == idActualizacion);
            if (i !== -1) this.actualizaciones.splice(i, 1);
          } else {
            this.Notificaciones.Error('Ocurrió un error al borrar la actualización');
          }
        });
      }
    });
  }

  GuardarActualizacion() {
    this.markFormTouched(this.formActualizacion);
    if (this.formActualizacion.invalid) return;

    const nueva       = new Actualizacion();
    nueva.id           = this.actualizacionSeleccionada.id;
    nueva.idApp        = this.idApp;
    nueva.resumen      = this.formActualizacion.value.resumen;
    nueva.mejoras      = this.formActualizacion.value.mejoras;
    nueva.correcciones = this.formActualizacion.value.correcciones;
    nueva.version      = this.formActualizacion.value.version;
    nueva.estado       = this.formActualizacion.value.estado;
    nueva.link         = this.formActualizacion.value.link;
    nueva.ambiente     = this.formActualizacion.value.ambiente ?? 'prod';
    nueva.tipo         = this.formActualizacion.value.destino;
    nueva.fechaPublicacion = new Date();

    const obs = this.modificandoActualizacion
      ? this.actualizacionesService.Modificar(nueva)
      : this.actualizacionesService.Agregar(nueva);

    obs.subscribe(response => {
      if (response == 'OK') {
        this.Notificaciones.Success(this.modificandoActualizacion ? 'Actualización editada' : 'Actualización creada');
        this.mostrarmodalAddMod = false;
        this.BuscarActualizaciones();
      } else {
        this.Notificaciones.Warn(response);
      }
    });
  }

  markFormTouched(control: AbstractControl) {
    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach(c => this.markFormTouched(c));
    } else {
      control.markAsTouched();
      control.markAsDirty();
    }
  }

  GetEstadoSeverity(estado: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' {
    switch (estado?.toLowerCase()) {
      case 'produccion':    return 'success';
      case 'canary':        return 'warn';
      case 'borrador':      return 'secondary';
      case 'deshabilitada': return 'danger';
      default:              return 'info';
    }
  }

  // ─── Flota ───────────────────────────────────────────────────────────────

  CargarFlota() {
    if (this.idApp == 0) return;
    this.loadingFlota = true;

    this.aplicacionesService.ObtenerFlota(this.idApp).subscribe({
      next: (rows: any[]) => {
        this.flota        = rows.map(r => new TerminalFlota(r));
        this.loadingFlota = false;
      },
      error: () => { this.loadingFlota = false; }
    });
  }

  GetHeartbeatSeverity(fecha: Date | null | undefined): 'success' | 'warn' | 'danger' | 'secondary' {
    if (!fecha) return 'secondary';
    const minutos = (Date.now() - new Date(fecha).getTime()) / 60000;
    if (minutos < 15) return 'success';
    if (minutos < 60) return 'warn';
    return 'danger';
  }

  GetHeartbeatLabel(fecha: Date | null | undefined): string {
    if (!fecha) return 'Sin datos';
    const minutos = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
    if (minutos < 1)  return 'Ahora';
    if (minutos < 60) return `Hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24)   return `Hace ${horas}h`;
    return `Hace ${Math.floor(horas / 24)}d`;
  }

  FormatearTiempoActivo(segundos: number | null | undefined): string {
    if (segundos == null) return '—';
    if (segundos < 60)    return `${segundos}s`;
    const m = Math.floor(segundos / 60);
    if (m < 60)           return `${m}m`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    if (h < 24)           return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh > 0 ? `${d}d ${rh}h` : `${d}d`;
  }

  GetEventoSeverity(tipo: string | undefined): 'success' | 'danger' | 'warn' | 'secondary' {
    switch (tipo) {
      case 'aplicacion_exitosa': return 'success';
      case 'rollback_exitoso':   return 'warn';
      case 'aplicacion_fallida':
      case 'rollback_fallido':   return 'danger';
      default:                   return 'secondary';
    }
  }

  GetEventoLabel(tipo: string | undefined): string {
    switch (tipo) {
      case 'aplicacion_exitosa': return 'Actualizado';
      case 'aplicacion_fallida': return 'Falló update';
      case 'rollback_exitoso':   return 'Revertido';
      case 'rollback_fallido':   return 'Falló rollback';
      default:                   return tipo ?? '—';
    }
  }

  GetBackupEstado(t: TerminalFlota): 'sin_backup' | 'desactualizado' | 'generacion_fallida' | 'corrupto' | 'pendiente' | 'ok' {
    if (!t.ultimoBackup || (t.totalBackups ?? 0) === 0) return 'sin_backup';
    const dias = (Date.now() - new Date(t.ultimoBackup).getTime()) / (1000 * 60 * 60 * 24);
    if (dias > 7)                                    return 'desactualizado';
    if (t.ultimoBackupOk === false)                  return 'generacion_fallida';
    if (t.backupValidacionEstado === 'corrupto')     return 'corrupto';
    if (t.backupValidacionEstado === 'pendiente')    return 'pendiente';
    return 'ok';
  }

  GetBackupSeverity(t: TerminalFlota): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    switch (this.GetBackupEstado(t)) {
      case 'ok':                 return 'success';
      case 'pendiente':          return 'info';
      case 'desactualizado':     return 'warn';
      case 'generacion_fallida': return 'danger';
      case 'corrupto':           return 'danger';
      case 'sin_backup':         return 'secondary';
    }
  }

  GetBackupLabel(t: TerminalFlota): string {
    switch (this.GetBackupEstado(t)) {
      case 'ok':                 return `${t.totalBackups}/3`;
      case 'pendiente':          return 'Validando';
      case 'desactualizado':     return 'Desactualizado';
      case 'generacion_fallida': return 'Error generación';
      case 'corrupto':           return 'Corrupto';
      case 'sin_backup':         return 'Sin backup';
    }
  }

  GetBackupTooltip(t: TerminalFlota): string {
    const estado = this.GetBackupEstado(t);
    if (estado === 'sin_backup') return 'No se recibieron backups';
    if (estado === 'corrupto' && t.backupValidacionDetalle) return t.backupValidacionDetalle;
    if (t.ultimoBackup) {
      const d = new Date(t.ultimoBackup);
      return `Último: ${d.toLocaleDateString('es-AR')}`;
    }
    return '';
  }

  GetTerminalCorta(terminal: string | undefined): string {
    if (!terminal) return '—';
    return terminal.length > 8 ? terminal.slice(0, 8) + '…' : terminal;
  }

  OrdenarRollback(event: Event, t: TerminalFlota) {
    if (!t.terminal || !t.versionBack) return;

    this.confirmationService.confirm({
      target:  event.target as EventTarget,
      message: `¿Revertir "${t.cliente}" al backup anterior? (versión actual: ${t.versionBack})`,
      icon:    'pi pi-exclamation-triangle',
      acceptLabel:       'Revertir',
      rejectLabel:       'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.rollbackEnProceso = t.terminal!;
        this.aplicacionesService.OrdenarRollback(t.terminal!, this.idApp, t.versionBack!).subscribe({
          next: () => {
            this.Notificaciones.Success(`Rollback ordenado. La terminal revertirá en el próximo reinicio.`);
            this.rollbackEnProceso = null;
          },
          error: () => {
            this.Notificaciones.Error('No se pudo ordenar el rollback.');
            this.rollbackEnProceso = null;
          }
        });
      }
    });
  }
}
