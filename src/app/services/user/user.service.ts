import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { UploadService } from '../upload/upload.service';
import * as swal from 'sweetalert';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  token: string='';
  menu: any;

  constructor(
    public http: HttpClient,
    public router: Router,
    public uploadServices: UploadService
  ) { 

    
    try{
      this.user = JSON.parse(localStorage.getItem('user'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }
    catch{
      this.user = null;
      this.menu = null;
    }

    this.token = localStorage.getItem('token') || '';

  }

  createUser(user: User){
    let url = URL_SERVICES + '/users'

    return this.http.post(url, user ).pipe(map((resp: any)=>{
      return resp;
    }), catchError((err) => {
      console.log(err);
      swal.default('Error al crear el usuario', err.error.err.message, 'error')
      return throwError(err)
    }));
  }

  login(user: User, rememberme=false){

    let url = URL_SERVICES + '/login'

    if( rememberme ){
      localStorage.setItem('email', user.email)
    }else{
      localStorage.removeItem('email')
    }

    return this.http.post(url, user)
                    .pipe(map((resp: any)=>{
                      this.saveStorage(resp); 
                      return true;
                    }), catchError((err)=>{
                      console.log(err.error.err.message);
                      swal.default('Error en el Login', err.error.err.message, 'error');
                      return throwError(err);
                    }));

  }

  logout(){
    this.user = null,
    this.token = '';
    this.menu = null;

    console.log(this.menu);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('menu')
    localStorage.removeItem('email');


    this.router.navigate(['/login']);

  }
  
  //Usuarios
  //Cargar usuarios
  getUsers(skip: number, limit: number = 5){
    
    let url = URL_SERVICES + `/users?skip=${skip}&limit=${limit}`;
    
    return this.http.get(url, { headers: { 'token': this.token }} );
    
  }
  
  //Buscar usuarios
  searchUser(item: string){

    let url = URL_SERVICES + `/search/collections/users/${item}`;
    return this.http.get(url);

  }

  //estado de logeado
  stateLoged(){
    return this.token.length > 30  ? true : false;
  }


  //Actualiar usuario 
  updateUser(user: User){
    let url = URL_SERVICES+'/users/'+user._id;

    return this.http.put(url, user, {headers: {'token':this.token}})
                    .pipe(map((resp: any)=>{

                      if(user._id === resp.user._id){
                        this.saveStorage(resp)
                      }
                      return resp;
                    }));
  }

  //borrar usuario
  removeUser(id: string){

    let url = URL_SERVICES+'/users/'+id;

    return this.http.delete(url, { headers: { 'token': this.token } } );

  }


  saveStorage(resp){
    localStorage.setItem('id', resp.user._id)                  

                      if(resp.token!=undefined){
                        this.token = resp.token;
                        localStorage.setItem('token', resp.token)
                      }
                      
                      this.menu = resp.menu;
                      console.log(this.menu);
                      localStorage.setItem('menu', JSON.stringify(resp.menu));

                      this.user = resp.user;
                      localStorage.setItem('user', JSON.stringify(resp.user));

  }

  //actualizar usuario
  updateImage(file: File, id: string){
    this.uploadServices.uploadFile(file, 'user', id, this.token)
                      .then((resp: any)=>{
                        
                        this.saveStorage(JSON.parse(resp));
                        swal.default('Imagen actualizada', this.user.name,'success')
                      })
                      .catch(resp=>{
                        console.log(JSON.parse(resp));
                      });
  }
}
