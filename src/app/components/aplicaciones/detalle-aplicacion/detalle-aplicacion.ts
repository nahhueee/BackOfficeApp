import { Component, OnInit } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TerminalFlota } from '../../../models/TerminalFlota';
import { CommonModule } from '@angular/common';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { ErroresService } from '../../../services/errores.service';
import { ErrorAgregado, ErrorDetalle } from '../../../models/ErrorAgregado';
import { getSeveridadTag, getSeveridadLabel } from '../../../models/errores.const';
import {
  GetHeartbeatSeverity, GetHeartbeatLabel,
  FormatearTiempoActivo,
  GetEventoSeverity, GetEventoLabel,
  GetEventoFrontSeverity, GetEventoFrontLabel,
  GetBackupEstado, GetBackupSeverity, GetBackupLabel, GetBackupTooltip,
  GetTerminalCorta,
  GetBackupSeverityFromEstado, GetBackupLabelFromEstado, GetInstalacionHeartbeatLabel,
  agruparPorInstalacion,
  type InstalacionFlota,
} from '../../../services/flota.util';

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
    SelectModule,
    TagModule,
    TooltipModule,
    Tabs, TabList, Tab, TabPanels, TabPanel,
  ],
  providers: [ConfirmationService, ErroresService],
  templateUrl: './detalle-aplicacion.html',
  styleUrl: './detalle-aplicacion.scss'
})
export class DetalleAplicacion implements OnInit {
  app: App = new App();
  idApp: number = 0;
  mostrarmodalAddMod: boolean = false;

  // Actualizaciones
  filtroActual: FiltroActualizacion = new FiltroActualizacion();
  actualizaciones: Actualizacion[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  modificandoActualizacion: boolean = false;
  actualizacionSeleccionada: Actualizacion = new Actualizacion();
  formActualizacion: FormGroup;

  opcionesEstado = [
    { label: '✏️ Borrador',      value: 'borrador'      },
    { label: '🐦 Canary',        value: 'canary'        },
    { label: '🚀 Producción',    value: 'produccion'    },
    { label: '❌ Deshabilitada', value: 'deshabilitada' }
  ];

  // Versiones backend para el selector de compatibilidad de frontend
  versionesBackendDisponibles: { version: string, estado: string }[] = [];
  versionesBackendSeleccionadas: string[] = [];
  loadingVersionesBackend: boolean = false;

  // Flota — datos crudos del backend
  flota: TerminalFlota[] = [];
  loadingFlota: boolean = false;
  rollbackEnProceso: string | null = null;
  rollbackFrontEnProceso: string | null = null;

  // Diálogo de rollback de front (requiere versión destino + URL del ZIP)
  rollbackFrontDialogVisible = false;
  rollbackFrontTerminal: TerminalFlota | null = null;
  rollbackFrontVersion = '';
  rollbackFrontZipUrl  = '';

  // Flota — agrupada y filtrada (lo que muestra la tabla)
  instalaciones:          InstalacionFlota[] = [];
  instalacionesFiltradas: InstalacionFlota[] = [];
  expandedRows: { [dni: number]: boolean } = {};

  // Filtros de flota
  filtroBusqueda:  string = '';
  filtroHeartbeat: string = 'todos';
  filtroBackup:    string = 'todos';
  filtroErrores:   string = 'todos';
  filtroVersion:   string = 'todos';
  filtroEstado:    string = 'todas';

  opcionesHeartbeatFlota = [
    { label: 'Heartbeat',    value: 'todos'     },
    { label: 'Online',       value: 'ok'        },
    { label: 'Sin contacto', value: 'problemas' },
  ];
  opcionesBackupFlota = [
    { label: 'Backup',          value: 'todos'     },
    { label: 'OK',              value: 'ok'        },
    { label: 'Con problemas',   value: 'problemas' },
  ];
  opcionesErroresFlota = [
    { label: 'Errores',     value: 'todos'      },
    { label: 'Con errores', value: 'con_errores' },
  ];
  opcionesVersionFlota = [
    { label: 'Versión',        value: 'todos'        },
    { label: 'Al día',         value: 'al_dia'       },
    { label: 'Desactualizada', value: 'desactualizada' },
  ];
  opcionesEstadoFlota = [
    { label: 'Estado',    value: 'todas'     },
    { label: 'Activas',   value: 'activas'   },
    { label: 'Bloqueadas', value: 'bloqueadas' },
  ];

  // Funciones de dominio de flota (del util, expuestas para el template)
  GetHeartbeatSeverity          = GetHeartbeatSeverity;
  GetHeartbeatLabel             = GetHeartbeatLabel;
  FormatearTiempoActivo         = FormatearTiempoActivo;
  GetEventoSeverity             = GetEventoSeverity;
  GetEventoLabel                = GetEventoLabel;
  GetEventoFrontSeverity        = GetEventoFrontSeverity;
  GetEventoFrontLabel           = GetEventoFrontLabel;
  GetBackupEstado               = GetBackupEstado;
  GetBackupSeverity             = GetBackupSeverity;
  GetBackupLabel                = GetBackupLabel;
  GetBackupTooltip              = GetBackupTooltip;
  GetTerminalCorta              = GetTerminalCorta;
  GetBackupSeverityFromEstado   = GetBackupSeverityFromEstado;
  GetBackupLabelFromEstado      = GetBackupLabelFromEstado;
  GetInstalacionHeartbeatLabel  = GetInstalacionHeartbeatLabel;

  // Errores recurrentes
  errores:           ErrorAgregado[] = [];
  loadingErrores:    boolean = false;
  detalleErrores:    ErrorDetalle[] = [];
  loadingDetalle:    boolean = false;
  errorSeleccionado: ErrorAgregado | null = null;
  mostrarDetalle:    boolean = false;

  getSeveridadTag   = getSeveridadTag;
  getSeveridadLabel = getSeveridadLabel;

  constructor(
    private rutaActiva: ActivatedRoute,
    private aplicacionesService: AplicacionesService,
    private actualizacionesService: ActualizacionesService,
    private erroresService: ErroresService,
    private Notificaciones: NotificacionesService,
    private confirmationService: ConfirmationService,
  ) {
    this.formActualizacion = new FormGroup({
      resumen:           new FormControl('', [Validators.required]),
      mejoras:           new FormControl(''),
      correcciones:      new FormControl(''),
      version:           new FormControl('', [Validators.required]),
      link:              new FormControl('', [Validators.required]),
      estado:            new FormControl('', [Validators.required]),
      destino:           new FormControl('', [Validators.required]),
      requiereNpmInstall: new FormControl(false),
      tamanoBytes:       new FormControl<number | null>(null),
    });

    // Cuando el tipo cambia a 'frontend', cargar versiones backend disponibles
    this.formActualizacion.get('destino')?.valueChanges.subscribe((tipo: string) => {
      if (tipo === 'frontend' && this.idApp) {
        this.CargarVersionesBackend();
      }
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.formActualizacion.get(campo);
    return !!(control && control.invalid && control.dirty);
  }

  ngOnInit() {
    this.idApp = this.rutaActiva.snapshot.params['idApp'];
    if (this.idApp != 0) {
      this.ObtenerApp();
      this.BuscarActualizaciones();
      this.CargarFlota();
      this.CargarErrores();
    }
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
    this.versionesBackendSeleccionadas = [];
    this.versionesBackendDisponibles = [];
    this.formActualizacion.patchValue({ destino: 'backend', estado: 'borrador', requiereNpmInstall: false });
    this.mostrarmodalAddMod = true;
  }

  EditarActualizacion(idActualizacion: number) {
    this.modificandoActualizacion = true;
    this.actualizacionSeleccionada = this.actualizaciones.find(a => a.id == idActualizacion)!;
    const act = this.actualizacionSeleccionada;

    this.formActualizacion.reset();
    this.versionesBackendSeleccionadas = [];
    this.versionesBackendDisponibles = [];

    this.formActualizacion.patchValue({
      resumen:            act.resumen,
      mejoras:            act.mejoras,
      correcciones:       act.correcciones,
      version:            act.version,
      link:               act.link,
      destino:            act.tipo,
      estado:             act.estado,
      requiereNpmInstall: (act.requiere_npm_install ?? 0) === 1,
      tamanoBytes:        act.tamano_bytes ?? null,
    });

    // Si es frontend, cargar compatibilidades previas (versiones ya se cargan via valueChanges)
    if (act.tipo === 'frontend' && act.version) {
      this.actualizacionesService.ObtenerCompatibilidades(this.idApp, act.version)
        .subscribe(versiones => { this.versionesBackendSeleccionadas = versiones ?? []; });
    }

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
    nueva.tipo         = this.formActualizacion.value.destino;
    nueva.fechaPublicacion = new Date();

    if (nueva.tipo === 'backend') {
      nueva.requiereNpmInstall = this.formActualizacion.value.requiereNpmInstall ?? false;
      nueva.tamanoBytes        = this.formActualizacion.value.tamanoBytes ?? null;
    } else {
      nueva.versionesBackendCompatibles = this.versionesBackendSeleccionadas;
    }

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

  // ─── Selector de tipo y compatibilidades ─────────────────────────────────

  setTipo(tipo: string) {
    this.formActualizacion.patchValue({ destino: tipo });
  }

  CargarVersionesBackend() {
    this.loadingVersionesBackend = true;
    this.actualizacionesService.ObtenerVersionesBackend(this.idApp).subscribe({
      next: (versiones) => {
        this.versionesBackendDisponibles = versiones ?? [];
        this.loadingVersionesBackend = false;
      },
      error: () => { this.loadingVersionesBackend = false; }
    });
  }

  esVersionSeleccionada(version: string): boolean {
    return this.versionesBackendSeleccionadas.includes(version);
  }

  toggleVersionBackend(version: string) {
    const idx = this.versionesBackendSeleccionadas.indexOf(version);
    if (idx >= 0) {
      this.versionesBackendSeleccionadas = this.versionesBackendSeleccionadas.filter(v => v !== version);
    } else {
      this.versionesBackendSeleccionadas = [...this.versionesBackendSeleccionadas, version];
    }
  }

  get tamanoEnMB(): string | null {
    const bytes = this.formActualizacion.get('tamanoBytes')?.value;
    if (!bytes || bytes <= 0) return null;
    if (bytes >= 1_048_576) return `≈ ${(bytes / 1_048_576).toFixed(1)} MB`;
    if (bytes >= 1024) return `≈ ${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} bytes`;
  }

  // ─── Flota ───────────────────────────────────────────────────────────────

  CargarFlota() {
    if (this.idApp == 0) return;
    this.loadingFlota = true;

    this.aplicacionesService.ObtenerFlota(this.idApp).subscribe({
      next: (rows: any[]) => {
        this.flota        = rows.map(r => new TerminalFlota(r));
        this.instalaciones = agruparPorInstalacion(this.flota);
        this.aplicarFiltros();
        this.loadingFlota = false;
      },
      error: () => { this.loadingFlota = false; }
    });
  }

  aplicarFiltros() {
    let resultado = this.instalaciones;

    if (this.filtroBusqueda.trim()) {
      const term = this.filtroBusqueda.toLowerCase();
      resultado = resultado.filter(i => i.nombre.toLowerCase().includes(term));
    }

    if (this.filtroHeartbeat !== 'todos') {
      resultado = resultado.filter(i => {
        const ok = i.heartbeatSeverity !== 'danger';
        return this.filtroHeartbeat === 'ok' ? ok : !ok;
      });
    }

    if (this.filtroBackup !== 'todos') {
      resultado = resultado.filter(i => {
        const ok = ['ok', 'pendiente'].includes(i.backupEstado);
        return this.filtroBackup === 'ok' ? ok : !ok;
      });
    }

    if (this.filtroErrores === 'con_errores') {
      resultado = resultado.filter(i => i.totalErrores > 0);
    }

    if (this.filtroVersion !== 'todos' && this.app.versionBackend) {
      resultado = resultado.filter(i => {
        const alDia = i.versionBack === this.app.versionBackend;
        return this.filtroVersion === 'al_dia' ? alDia : !alDia;
      });
    }

    if (this.filtroEstado === 'activas') {
      resultado = resultado.filter(i => i.habilitado);
    } else if (this.filtroEstado === 'bloqueadas') {
      resultado = resultado.filter(i => !i.habilitado);
    }

    this.instalacionesFiltradas = resultado;
  }

  toggleRow(inst: InstalacionFlota) {
    this.expandedRows = {
      ...this.expandedRows,
      [inst.DNI]: !this.expandedRows[inst.DNI]
    };
  }

  limpiarFiltros() {
    this.filtroBusqueda  = '';
    this.filtroHeartbeat = 'todos';
    this.filtroBackup    = 'todos';
    this.filtroErrores   = 'todos';
    this.filtroVersion   = 'todos';
    this.filtroEstado    = 'todas';
    this.aplicarFiltros();
  }

  get hayFiltrosActivos(): boolean {
    return this.filtroBusqueda.trim() !== ''
      || this.filtroHeartbeat !== 'todos'
      || this.filtroBackup    !== 'todos'
      || this.filtroErrores   !== 'todos'
      || this.filtroVersion   !== 'todos'
      || this.filtroEstado    !== 'todas';
  }

  // ─── KPIs (por instalación, no por terminal) ──────────────────────────────

  get kpiTotal(): number {
    return this.app.clientes ?? 0;
  }

  get kpiActivas(): number {
    return this.instalaciones.filter(i => i.habilitado && i.heartbeatSeverity !== 'danger').length;
  }

  get kpiAlDia(): number {
    if (!this.app.versionBackend) return 0;
    return this.instalaciones.filter(i => i.versionBack === this.app.versionBackend).length;
  }

  get kpiAlertas(): number {
    return this.instalaciones.filter(i =>
      i.heartbeatSeverity === 'danger' ||
      !['ok', 'pendiente'].includes(i.backupEstado) ||
      i.totalErrores > 0
    ).length;
  }

  get kpiBackupsOk(): number {
    return this.instalaciones.filter(i => i.backupEstado === 'ok').length;
  }

  // ─── Errores recurrentes ─────────────────────────────────────────────────

  CargarErrores() {
    if (this.idApp == 0) return;
    this.loadingErrores = true;
    this.erroresService.ObtenerErroresAgregados(this.idApp).subscribe({
      next: (rows) => {
        this.errores       = rows;
        this.loadingErrores = false;
      },
      error: () => { this.loadingErrores = false; }
    });
  }

  VerDetalleError(error: ErrorAgregado) {
    this.errorSeleccionado = error;
    this.mostrarDetalle    = true;
    this.loadingDetalle    = true;
    this.detalleErrores    = [];

    this.erroresService.ObtenerDetalleError(this.idApp, error.codigo).subscribe({
      next: (rows) => {
        this.detalleErrores  = rows;
        this.loadingDetalle  = false;
      },
      error: () => { this.loadingDetalle = false; }
    });
  }

  FormatearFecha(fecha: Date | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-AR');
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

  // Rollback de FRONTEND: necesita versión destino + URL del ZIP del installer,
  // por eso abre un diálogo en lugar de un confirm directo.
  AbrirRollbackFront(t: TerminalFlota) {
    this.rollbackFrontTerminal = t;
    this.rollbackFrontVersion  = '';
    this.rollbackFrontZipUrl   = '';
    this.rollbackFrontDialogVisible = true;
  }

  ConfirmarRollbackFront() {
    const t = this.rollbackFrontTerminal;
    if (!t?.terminal) return;
    const version = this.rollbackFrontVersion.trim();
    const zipUrl  = this.rollbackFrontZipUrl.trim();
    if (!version || !zipUrl) {
      this.Notificaciones.Warn('Versión destino y URL del ZIP son requeridas.');
      return;
    }

    this.rollbackFrontEnProceso = t.terminal;
    this.aplicacionesService.OrdenarRollbackFront(t.terminal, this.idApp, version, zipUrl).subscribe({
      next: () => {
        this.Notificaciones.Success('Rollback de front ordenado. La terminal lo aplicará en el próximo heartbeat.');
        this.rollbackFrontEnProceso = null;
        this.rollbackFrontDialogVisible = false;
      },
      error: () => {
        this.Notificaciones.Error('No se pudo ordenar el rollback de front.');
        this.rollbackFrontEnProceso = null;
      }
    });
  }
}
