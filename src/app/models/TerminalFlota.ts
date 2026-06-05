export class TerminalFlota {
    terminal?:             string;
    habilitado?:           boolean;
    ultimoHeartbeat?:      Date | null;
    cliente?:              string;
    DNI?:                  number;
    versionBack?:          string;
    versionFront?:         string;
    dbStatus?:             string;
    tiempoActivo?:         number;
    erroresRecientes?:     number;
    terminalesLanActivas?: number;
    totalErrores?:         number;
    // Último evento de update de cada capa (back y front son streams independientes).
    ultimoEventoBack?:     { tipo: string; version: string | null; fecha: Date | null } | null;
    ultimoEventoFront?:    { tipo: string; version: string | null; error: string | null; maquina: string | null; fecha: Date | null } | null;
    esCanary?:                   boolean;
    confirmacionFrontPendiente?: boolean;
    totalBackups?:              number;
    ultimoBackup?:              Date | null;
    ultimoBackupFecha?:         Date | null;
    ultimoBackupOk?:            boolean | null;
    backupValidacionEstado?:    string | null;
    backupValidacionDetalle?:   string | null;

    constructor(data?: any) {
        if (data) {
            this.terminal             = data.terminal;
            this.habilitado           = data.habilitado === 1 || data.habilitado === true;
            this.ultimoHeartbeat      = data.ultimo_heartbeat ? new Date(data.ultimo_heartbeat) : null;
            this.cliente              = data.cliente;
            this.DNI                  = data.DNI;
            this.versionBack          = data.version_back;
            this.versionFront         = data.version_front;
            this.dbStatus             = data.db_status;
            this.tiempoActivo         = data.tiempo_activo;
            this.erroresRecientes     = data.errores_recientes;
            this.terminalesLanActivas = data.terminales_lan_activas;
            this.totalErrores         = data.total_errores;
            this.ultimoEventoBack     = data.evento_back_tipo ? {
                tipo:    data.evento_back_tipo,
                version: data.evento_back_version ?? null,
                fecha:   data.evento_back_fecha ? new Date(data.evento_back_fecha) : null,
            } : null;
            this.ultimoEventoFront    = data.evento_front_tipo ? {
                tipo:    data.evento_front_tipo,
                version: data.evento_front_version ?? null,
                error:   data.evento_front_error ?? null,
                maquina: data.evento_front_maquina ?? null,
                fecha:   data.evento_front_fecha ? new Date(data.evento_front_fecha) : null,
            } : null;
            this.esCanary                  = data.es_canary === 1 || data.es_canary === true;
            this.confirmacionFrontPendiente = data.confirmacion_front_pendiente === 1 || data.confirmacion_front_pendiente === true;
            this.totalBackups            = data.total_backups ?? 0;
            this.ultimoBackup            = data.ultimo_backup ? new Date(data.ultimo_backup) : null;
            this.ultimoBackupFecha       = data.ultimo_backup_fecha ? new Date(data.ultimo_backup_fecha) : null;
            this.ultimoBackupOk          = data.ultimo_backup_ok !== null && data.ultimo_backup_ok !== undefined
                                           ? data.ultimo_backup_ok === 1 || data.ultimo_backup_ok === true
                                           : null;
            this.backupValidacionEstado  = data.backup_validacion_estado  ?? null;
            this.backupValidacionDetalle = data.backup_validacion_detalle ?? null;
        }
    }
}
