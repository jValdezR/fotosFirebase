import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';
@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private carpetaImagenes = 'img';

  constructor(private db: AngularFirestore) {
  }




  private guardarImagen(imagen: { nombre: string, url: string }): void {

    this.db.collection(`${this.carpetaImagenes}`)
      .add(imagen);
  }





  cargarImagenesFirebase(imagenes: FileItem[]): void {
    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }
      const upLoadTask: firebase.storage.UploadTask
      = storageRef.child(`${this.carpetaImagenes}/${item.nombreArchivo}`)
        .put(item.archivo);

      upLoadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.log('Error al subir', error),
        async() => {
 
          console.log('Imagen cargada correctamente');
          item.url = await storageRef.child(upLoadTask.snapshot.ref.fullPath).getDownloadURL();
          item.estaSubiendo = false;
          this.guardarImagen({
            nombre: item.nombreArchivo,
            url: item.url,
          });
        });

    }

  }

}
