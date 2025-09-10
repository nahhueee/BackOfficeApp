import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { RadioButtonModule } from 'primeng/radiobutton';
import {MatIconModule} from '@angular/material/icon';
import { TooltipModule } from 'primeng/tooltip';
import { updatePreset } from '@primeuix/themes';
import { IndigoPreset } from '../../themes/indigo';
import { BluePreset } from '../../themes/blue';
import { GreenPreset } from '../../themes/green';
import { PinkPreset } from '../../themes/pink';
import { TealPreset } from '../../themes/teal';
import { VioletPreset } from '../../themes/violet';
import { YellowPreset } from '../../themes/yellow';
import { Router } from '@angular/router';

interface Color{
  color:string,
  hexa:string
}

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [
    ButtonModule,
    PopoverModule,
    RadioButtonModule,
    MatIconModule,
    TooltipModule
  ],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.scss'
})
export class Navegacion implements OnInit {
  @ViewChild('op') op!: Popover;
  esDark: boolean = false;
  colorSeleccionado: string = "yellow";
  colores: Color[] = [
    {color: "yellow", hexa: "rgb(255, 235, 59)"},
    {color: "blue", hexa: "rgb(33, 150, 243)"},
    {color: "green", hexa: "rgb(76, 175, 80)"},
    {color: "indigo", hexa: "rgb(63, 81, 181)"},
    {color: "pink", hexa: "#d81b60"},
    {color: "teal", hexa: "rgb(0, 150, 136)"},
    {color: "violet", hexa: "rgb(156, 39, 176)"},
  ]

  private router = inject(Router);


  ngOnInit(){
    this.esDark = localStorage.getItem('theme') === 'dark';
    const color = localStorage.getItem('color');

    if(color)
      this.CambiarColor(color);

    if(this.esDark)
      this.AplicarTema();
  }

  Navegar(ruta:string){
    this.router.navigateByUrl(ruta);
  }

  toggle(event: any) {
    this.op.toggle(event);
  }

  CambiarModo() {
    this.AplicarTema();
    localStorage.setItem('theme', this.esDark ? 'light' : 'dark');  
    this.esDark = !this.esDark;
  }

  CambiarColor(color:string){
    this.colorSeleccionado = color;
    localStorage.setItem('color', color);
    switch (color) {
        case 'indigo':
          updatePreset(IndigoPreset);
          break;
        case 'blue':
          updatePreset(BluePreset);
          break;
        case 'green':
          updatePreset(GreenPreset);
          break;
        case 'pink':
          updatePreset(PinkPreset);
          break;
        case 'teal':
          updatePreset(TealPreset);
          break;
        case 'violet':
          updatePreset(VioletPreset);
          break;
        case 'yellow':
          updatePreset(YellowPreset);
          break
    }
  }

  AplicarTema(){
    const element = document.querySelector('html');
    element!.classList.toggle('dark-mode');
    
    // También aplica la clase al body para mayor especificidad
    document.body.classList.toggle('dark-mode');
  }
}
