import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//PrimeNG módulos más usados para formularios
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';

//Otros
import { IMaskModule } from 'angular-imask';
import { DecimalFormatPipe } from '../pipes/decimal-format';

export const FORMS_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  //Otros
  IMaskModule,
  DecimalFormatPipe,
  
  //PrimeNG
  InputTextModule,
  FloatLabel,
  CheckboxModule,
  RadioButtonModule,
  ToggleButtonModule,
  ButtonModule,
  AutoFocusModule
];
