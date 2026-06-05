import { TerminalFlota } from '../models/TerminalFlota';

// Umbral de backup desactualizado (§17.5 architecture.md).
// Mantener sincronizado con la lógica de validación del backend.
export const DIAS_BACKUP_DESACTUALIZADO = 7;

export type HeartbeatSeverity = 'success' | 'warn' | 'danger' | 'secondary';
export type BackupEstado      = 'sin_backup' | 'desactualizado' | 'generacion_fallida' | 'corrupto' | 'pendiente' | 'ok';
export type BackupSeverity    = 'success' | 'warn' | 'danger' | 'info' | 'secondary';
type EventoSeverity           = 'success' | 'danger' | 'warn' | 'secondary' | 'info';

// ─── Por terminal ─────────────────────────────────────────────────────────────

export function GetHeartbeatSeverity(fecha: Date | null | undefined): HeartbeatSeverity {
  if (!fecha) return 'secondary';
  const minutos = (Date.now() - new Date(fecha).getTime()) / 60000;
  if (minutos < 15) return 'success';
  if (minutos < 60) return 'warn';
  return 'danger';
}

export function GetHeartbeatLabel(fecha: Date | null | undefined): string {
  if (!fecha) return 'Sin datos';
  const minutos = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
  if (minutos < 1)  return 'Ahora';
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24)   return `Hace ${horas}h`;
  return `Hace ${Math.floor(horas / 24)}d`;
}

export function FormatearTiempoActivo(segundos: number | null | undefined): string {
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

export function GetEventoSeverity(tipo: string | undefined): EventoSeverity {
  switch (tipo) {
    case 'aplicacion_exitosa': return 'success';
    case 'rollback_exitoso':   return 'warn';
    case 'aplicacion_fallida':
    case 'rollback_fallido':   return 'danger';
    default:                   return 'secondary';
  }
}

export function GetEventoLabel(tipo: string | undefined): string {
  switch (tipo) {
    case 'aplicacion_exitosa': return 'Actualizado';
    case 'aplicacion_fallida': return 'Falló update';
    case 'rollback_exitoso':   return 'Revertido';
    case 'rollback_fallido':   return 'Falló rollback';
    default:                   return tipo ?? '—';
  }
}

// Eventos del updater de FRONTEND (tipo prefijado 'front_').
export function GetEventoFrontSeverity(tipo: string | undefined): EventoSeverity {
  switch (tipo) {
    case 'front_ok':         return 'success';
    case 'front_instalando': return 'info';
    case 'front_timeout':    return 'warn';
    case 'front_error':      return 'danger';
    default:                 return 'secondary';
  }
}

export function GetEventoFrontLabel(tipo: string | undefined): string {
  switch (tipo) {
    case 'front_ok':         return 'Front OK';
    case 'front_instalando': return 'Instalando';
    case 'front_timeout':    return 'Timeout front';
    case 'front_error':      return 'Falló front';
    default:                 return tipo ?? '—';
  }
}

export function GetBackupEstado(t: TerminalFlota): BackupEstado {
  if (!t.ultimoBackup || (t.totalBackups ?? 0) === 0) return 'sin_backup';
  const dias = (Date.now() - new Date(t.ultimoBackup).getTime()) / (1000 * 60 * 60 * 24);
  if (dias > DIAS_BACKUP_DESACTUALIZADO)           return 'desactualizado';
  if (t.ultimoBackupOk === false)                  return 'generacion_fallida';
  if (t.backupValidacionEstado === 'corrupto')     return 'corrupto';
  if (t.backupValidacionEstado === 'pendiente')    return 'pendiente';
  return 'ok';
}

export function GetBackupSeverity(t: TerminalFlota): BackupSeverity {
  return GetBackupSeverityFromEstado(GetBackupEstado(t));
}

export function GetBackupLabel(t: TerminalFlota): string {
  switch (GetBackupEstado(t)) {
    case 'ok':                 return `${t.totalBackups}/3`;
    case 'pendiente':          return 'Validando';
    case 'desactualizado':     return 'Desactualizado';
    case 'generacion_fallida': return 'Error generación';
    case 'corrupto':           return 'Corrupto';
    case 'sin_backup':         return 'Sin backup';
  }
}

export function GetBackupTooltip(t: TerminalFlota): string {
  const estado = GetBackupEstado(t);
  if (estado === 'sin_backup') return 'No se recibieron backups';
  if (estado === 'corrupto' && t.backupValidacionDetalle) return t.backupValidacionDetalle;
  if (t.ultimoBackup) {
    const d = new Date(t.ultimoBackup);
    return `Último: ${d.toLocaleDateString('es-AR')}`;
  }
  return '';
}

export function GetTerminalCorta(terminal: string | undefined): string {
  if (!terminal) return '—';
  return terminal.length > 8 ? terminal.slice(0, 8) + '…' : terminal;
}

// ─── Por estado consolidado (instalación) ────────────────────────────────────

export function GetBackupSeverityFromEstado(estado: BackupEstado): BackupSeverity {
  switch (estado) {
    case 'ok':                 return 'success';
    case 'pendiente':          return 'info';
    case 'desactualizado':     return 'warn';
    case 'generacion_fallida': return 'danger';
    case 'corrupto':           return 'danger';
    case 'sin_backup':         return 'secondary';
  }
}

export function GetBackupLabelFromEstado(estado: BackupEstado): string {
  switch (estado) {
    case 'ok':                 return 'OK';
    case 'pendiente':          return 'Validando';
    case 'desactualizado':     return 'Desactualizado';
    case 'generacion_fallida': return 'Error generación';
    case 'corrupto':           return 'Corrupto';
    case 'sin_backup':         return 'Sin backup';
  }
}

export function GetInstalacionHeartbeatLabel(sev: HeartbeatSeverity): string {
  switch (sev) {
    case 'success':   return 'Online';
    case 'warn':      return 'Lenta';
    case 'danger':    return 'Sin contacto';
    case 'secondary': return 'Sin datos';
  }
}

// ─── Agrupamiento por instalación (DNI) ──────────────────────────────────────

// Orden de severidad para determinar el peor estado consolidado.
const HEARTBEAT_ORDEN: Record<HeartbeatSeverity, number> = { secondary: 0, success: 1, warn: 2, danger: 3 };
const BACKUP_ORDEN: Record<BackupEstado, number>          = { ok: 0, pendiente: 1, sin_backup: 2, desactualizado: 3, generacion_fallida: 4, corrupto: 4 };

export interface InstalacionFlota {
  DNI:              number;
  nombre:           string;
  terminales:       TerminalFlota[];
  // Consolidados: peor estado entre todas las terminales de la instalación
  heartbeatSeverity: HeartbeatSeverity;
  backupEstado:      BackupEstado;
  totalErrores:      number;
  // Versión del backend: primera que aparezca (sin flag de servidora en DB aún)
  versionBack:       string | null;
  // Habilitado si al menos una terminal lo está
  habilitado:        boolean;
}

export function agruparPorInstalacion(flota: TerminalFlota[]): InstalacionFlota[] {
  const mapa = new Map<number, TerminalFlota[]>();

  for (const t of flota) {
    const dni = t.DNI!;
    if (!mapa.has(dni)) mapa.set(dni, []);
    mapa.get(dni)!.push(t);
  }

  const instalaciones: InstalacionFlota[] = [];

  for (const [dni, terminales] of mapa) {
    const heartbeatSeverity = terminales.reduce<HeartbeatSeverity>((peor, t) => {
      const sev = GetHeartbeatSeverity(t.ultimoHeartbeat);
      return HEARTBEAT_ORDEN[sev] > HEARTBEAT_ORDEN[peor] ? sev : peor;
    }, 'secondary');

    const backupEstado = terminales.reduce<BackupEstado>((peor, t) => {
      const est = GetBackupEstado(t);
      return BACKUP_ORDEN[est] > BACKUP_ORDEN[peor] ? est : peor;
    }, 'ok');

    const totalErrores = terminales.reduce((sum, t) => sum + (t.totalErrores ?? 0), 0);
    const versionBack  = terminales.find(t => t.versionBack)?.versionBack ?? null;
    const habilitado   = terminales.some(t => t.habilitado === true);
    const nombre       = terminales[0].cliente ?? `DNI ${dni}`;

    instalaciones.push({ DNI: dni, nombre, terminales, heartbeatSeverity, backupEstado, totalErrores, versionBack, habilitado });
  }

  // Mantener el orden original del backend (por c.nombre), igual que ObtenerFlota.
  instalaciones.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  return instalaciones;
}
