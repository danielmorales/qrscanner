import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private storage: Storage,
              private navCtrl: NavController,
              private inAppBrowser: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
    this.cargarStorage();
  }

  async cargarStorage() {
    // cargar registros y almacenarlos en el arreglo guardados
    // guardados es igual a registros, pero si registros no existe, entonces guardados es un arreglo vacío
    this.guardados = (await this.storage.get('registros')) || [];

  }

  async guardarRegistro(format: string, text: string) {
    // primero se espera a que se carguen los archivos del storage, y luego se guarda
    await this.cargarStorage();

    const nuevoRegistro = new Registro(format, text);
    // unshit guarda siempre en la primera posición del arreglo
    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);

    // Guardar registros en storage 'registros'
    this.storage.set('registros', this.guardados);

    this.abrirRegistro(nuevoRegistro);

  }

  abrirRegistro(registro: Registro) {
    this.navCtrl.navigateForward('/tabs/tab2');

    switch (registro.type) {
      case 'http':
        // Abrir el navegador web
        // el '_system' abre el navegador web por defecto
        // registro.txt tiene la url
         this.inAppBrowser.create(registro.text, '_system');
         break;
      case 'geo':
      // Abrir mapa
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
        break;

    }
  }

  enviarCorreo() {

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);
    this.guardados.forEach(registro => {

      const linea = `${registro.type},${registro.format},${registro.created},${registro.text.replace(',', ' ')}\n`;

      arrTemp.push( linea );
    });

    console.log(arrTemp.join(''));
    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string) {
    // tslint:disable-next-line: no-unused-expression
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
      .then(existe => {
        console.log('Existe archivo?', existe);
        return this.escribirEnArchivo(text);
      })
      .catch(err => {
        return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
          .then(creado => this.escribirEnArchivo(text))
          .catch(err2 => console.log('No se pudo crear el archivo'));
      });
  }

  async escribirEnArchivo(text: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

    console.log('Archivo creado');
    const archivo = `${this.file.dataDirectory}/registros.csv`;
    console.log(this.file.dataDirectory + 'registros.csv');

    const email = {
      to: 'daniel.morales@usach.cl',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
     //   'file://img/logo.png',
     //   'res://icon.png',
      //  'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
     //   'file://README.pdf'
      ],
      subject: 'Backup Scans',
      body: 'Aqui van los scans en un csv',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);

  }
}
