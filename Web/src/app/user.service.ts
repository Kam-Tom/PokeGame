import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { UserData } from '../models/user.model';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token:string = '';
  
  get Token() : string
  {
    return this.token;
  }

  constructor(private http: HttpClient) {}

  isLogged() : boolean
  {
    return this.token !== '';
  }

  login(username:string, password:string)
  {
      return this.http.post<{token:string}>('http://localhost:8000/user/login',
      {
        username: username,
        password: password
      })
      .pipe
      (
        tap((resData) => {this.token = `Berer ${resData.token}`;})
      )
  }

  register(username:string, password:string)
  {
    return this.http.post<{token:string}>('http://localhost:8000/user/register',
    {
      username: username,
      password: password
    })
  }
  unregister()
  {

    this.http.delete('http://localhost:8000/user')
    .subscribe(() => this.token = '');
  }
  getGameData() : Observable<UserData>
  {
    return this.http.get<{ data: UserData; message: string }>('http://localhost:8000/user')
    .pipe
    (
       map(response => response.data)
    );
  }
}
