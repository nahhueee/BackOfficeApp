export type Severidad = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA' | 'IGNORAR_REMOTO';

export enum CodigoError {
  VALIDACION                = 'VALIDACION',
  TERMINAL_NO_ENCONTRADA    = 'TERMINAL_NO_ENCONTRADA',
  AUTH_NO_HABILITADO        = 'AUTH_NO_HABILITADO',
  CERTIFICADOS              = 'CERTIFICADOS',
  AFIP_TIMEOUT              = 'AFIP_TIMEOUT',
  AFIP_NO_DISPONIBLE        = 'AFIP_NO_DISPONIBLE',
  AFIP_ERROR                = 'AFIP_ERROR',
  AFIP_RECHAZO              = 'AFIP_RECHAZO',
  QR_ERROR                  = 'QR_ERROR',
  ADMIN_SERVER_ERROR        = 'ADMIN_SERVER_ERROR',
  APPCLIENTE_CREACION_ERROR = 'APPCLIENTE_CREACION_ERROR',
  NOT_FOUND                 = 'NOT_FOUND',
  INTERNAL_ERROR            = 'INTERNAL_ERROR',
  HEARTBEAT_FALLIDO         = 'HEARTBEAT_FALLIDO',
  BACKUP_GENERACION_ERROR   = 'BACKUP_GENERACION_ERROR',
  BACKUP_UPLOAD_ERROR       = 'BACKUP_UPLOAD_ERROR',
  ERROR_BATCH_ENVIO_FALLIDO = 'ERROR_BATCH_ENVIO_FALLIDO',
  ERROR_BATCH_OVERFLOW      = 'ERROR_BATCH_OVERFLOW',
  DB_CONNECTION_ERROR       = 'DB_CONNECTION_ERROR',
  CRON_INIT_ERROR           = 'CRON_INIT_ERROR',
  UPDATER_APPLY_ERROR       = 'UPDATER_APPLY_ERROR',
  ROLLBACK_FALLIDO          = 'ROLLBACK_FALLIDO',
  MIGRATION_ERROR           = 'MIGRATION_ERROR',
}

export const SEVERIDAD: Record<string, Severidad> = {
  [CodigoError.VALIDACION]:                'BAJA',
  [CodigoError.TERMINAL_NO_ENCONTRADA]:    'BAJA',
  [CodigoError.AUTH_NO_HABILITADO]:        'BAJA',
  [CodigoError.CERTIFICADOS]:              'ALTA',
  [CodigoError.AFIP_TIMEOUT]:              'ALTA',
  [CodigoError.AFIP_NO_DISPONIBLE]:        'ALTA',
  [CodigoError.AFIP_ERROR]:                'ALTA',
  [CodigoError.AFIP_RECHAZO]:              'MEDIA',
  [CodigoError.QR_ERROR]:                  'BAJA',
  [CodigoError.ADMIN_SERVER_ERROR]:        'MEDIA',
  [CodigoError.APPCLIENTE_CREACION_ERROR]: 'MEDIA',
  [CodigoError.NOT_FOUND]:                 'BAJA',
  [CodigoError.INTERNAL_ERROR]:            'ALTA',
  [CodigoError.HEARTBEAT_FALLIDO]:         'IGNORAR_REMOTO',
  [CodigoError.BACKUP_GENERACION_ERROR]:   'CRITICA',
  [CodigoError.BACKUP_UPLOAD_ERROR]:       'ALTA',
  [CodigoError.ERROR_BATCH_ENVIO_FALLIDO]: 'IGNORAR_REMOTO',
  [CodigoError.ERROR_BATCH_OVERFLOW]:      'IGNORAR_REMOTO',
  [CodigoError.DB_CONNECTION_ERROR]:       'CRITICA',
  [CodigoError.CRON_INIT_ERROR]:           'ALTA',
  [CodigoError.UPDATER_APPLY_ERROR]:       'CRITICA',
  [CodigoError.ROLLBACK_FALLIDO]:          'CRITICA',
  [CodigoError.MIGRATION_ERROR]:           'CRITICA',
};

// Default conservador: si el codigo no esta en el mapa, no se envia.
export function getSeveridad(codigo: string): Severidad {
  return SEVERIDAD[codigo] ?? 'IGNORAR_REMOTO';
}

export function getSeveridadTag(codigo: string): 'danger' | 'warn' | 'info' | 'secondary' {
  const s = getSeveridad(codigo);
  switch (s) {
    case 'CRITICA':        return 'danger';
    case 'ALTA':           return 'warn';
    case 'MEDIA':          return 'info';
    case 'BAJA':           return 'secondary';
    case 'IGNORAR_REMOTO': return 'secondary';
  }
}

export function getSeveridadLabel(codigo: string): string {
  return getSeveridad(codigo);
}
