import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // dalaLocal en public porque se utiliza en el ngFor del html
  constructor(public dataLocal: DataLocalService) {}

  enviarCorreo() {
    console.log('Enviando Correo...');
    this.dataLocal.enviarCorreo();
  }

  abrirRegistro( registro ) {
    console.log('Abrir registro...', registro);
    this.dataLocal.abrirRegistro(registro);
  }

}
