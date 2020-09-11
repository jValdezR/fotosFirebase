import { FileItem } from '../models/file-item';
import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }
  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transferencia = this._getTransferencia(event);

    if (!transferencia) {
      return;
    }
    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);

    this.mouseSobre.emit(false);
  }

  private _getTransferencia(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {
    // tslint:disable-next-line: forin
    // for (const iterator in Object.getOwnPropertyNames(archivosLista)) {
    //   const archivoTemp = archivosLista[propiedad];

    //   if (this._archivoPuedeCargarse(archivoTemp)) {
    //     const nuevoArchivo = new FileItem(archivoTemp);
    //     this.archivos.push(nuevoArchivo);
    //   }
    // }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < archivosLista.length; i++){
      console.log(archivosLista[i]);
      const archivoTemporal = archivosLista[i];
      if (this._archivoPuedeSerCargado(archivoTemporal)){
        const nuevoArchivo = new FileItem( archivoTemporal);
        console.log('nuevoArchivo: ' + nuevoArchivo);
        this.archivos.push(nuevoArchivo);
      }
    }
    console.log(this.archivos);
  }

  // Validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoDropeado(archivo.name) && this.esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener($event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoDropeado(nombre: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo == nombre) {
        console.log('El archivo ' + nombre + ' ya está agregado');
        return true;
      }
    }
    return false;
  }

  private esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }

}