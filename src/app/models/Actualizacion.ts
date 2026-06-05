export class Actualizacion {
    id?:number;
    idApp?:number;
    resumen?:string;
    mejoras?:string;
    correcciones?:string;
    version?:string;
    link?:string;
    fechaPublicacion?:Date;
    ambiente?:string;
    estado?:string;
    tipo?:string;
    // Campos que devuelve SELECT * de la DB (snake_case)
    requiere_npm_install?: number;
    tamano_bytes?: number;
    // Campos de payload para guardar (camelCase)
    requiereNpmInstall?: boolean;
    tamanoBytes?: number;
    versionesBackendCompatibles?: string[];
}