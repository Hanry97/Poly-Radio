import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Radio } from './radio';

@Injectable({
  providedIn: 'root'
})
export class RadioListService {

  urlRadios = "http://localhost:3000/list_radio";

  constructor(private http:HttpClient) { }

  getListRadios(){
    return this.http.get<Radio[]>(this.urlRadios);
  }
}
