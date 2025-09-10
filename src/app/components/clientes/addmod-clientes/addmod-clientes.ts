import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Cliente } from '../../../models/Cliente';
import { InputTextModule } from 'primeng/inputtext';
import { ClientesService } from '../../../services/clientes.service';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-addmod-clientes',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    InputTextModule, 
    FloatLabel,
  ],
  templateUrl: './addmod-clientes.html',
  styleUrl: './addmod-clientes.scss'
})
export class AddmodClientes {
  @Output() cerrar = new EventEmitter<boolean>(); //True: si hay que actualizar, False: si no hay que actualizar
  @Input() set cliente(value: Cliente | undefined) { //Cliente a editar
    if (value){
      this.formulario.patchValue(value); //Si se envía un valor para editar completamos el fornulario
      this.clienteSeleccionado = value;
    } 
    else this.formulario.reset(); //Si no hay valores reiniciamos el formulario
  }

  clienteSeleccionado:Cliente | undefined;
  formulario:FormGroup;

  constructor(
    private Notificaciones: NotificacionesService,
    private clientesService: ClientesService
  ) {
    this.formulario = new FormGroup({
      DNI: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      descripcion: new FormControl(''),
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && control.dirty);
  }

  Guardar(){
    if(this.formulario.invalid) return;

    let nuevoCliente = new Cliente();
    nuevoCliente.DNI = this.formulario.value.DNI;
    nuevoCliente.nombre = this.formulario.value.nombre;
    nuevoCliente.email = this.formulario.value.email;
    nuevoCliente.descripcion = this.formulario.value.descripcion;
    
    if(!this.clienteSeleccionado){
      this.Agregar(nuevoCliente);      
    }else{
      nuevoCliente.id = this.clienteSeleccionado?.id!;
      console.log(nuevoCliente);
      this.Modificar(nuevoCliente);
    }
  }

  Agregar(cliente:Cliente){
    this.clientesService.Agregar(cliente)
      .subscribe(response => {
        if(response=='OK'){
          this.Notificaciones.Success("Cliente creado correctamente");
          this.CerrarModal(true);
        }else{
          this.Notificaciones.Warn(response);
        }
      });
  }

  Modificar(cliente:Cliente){
    this.clientesService.Modificar(cliente)
      .subscribe(response => {
        if(response=='OK'){
          this.Notificaciones.Success("Cliente modificado correctamente");
          this.CerrarModal(true);
        }else{
          this.Notificaciones.Warn(response);
        }
      });
  }

  CerrarModal(actualizar:boolean) {
    this.cerrar.emit(actualizar);
  }
}
