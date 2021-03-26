import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root' // Angular lo eleva a nivel global, funciona en toda la aplicación.
})
export class GifsService {

  private urlService: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'kEvLTY6nQShJaFuEEK04UM3HheCJVbo8';
  public resultados : Gif[] = [];
  private _historial: string[] = [];

  get historial(){return [...this._historial]}

  constructor(private http: HttpClient) { 
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string = ''){

    query = query.trim().toLocaleLowerCase();

    if(query ===''){
      return;
    }
    else{
      if(!this._historial.includes(query)){
        this._historial.unshift(query);
        this._historial = this._historial.splice(0,10);
      }
    }

    localStorage.setItem('historial',JSON.stringify(this.historial));

    const params= new HttpParams()
      .set('api_key',this.apiKey)
      .set('q',query)
      .set('limit','10');

      this.http.get<SearchGifsResponse>(`${this.urlService}/search`, {params})
        .subscribe((resp)=>{
          this.resultados = resp.data;
          localStorage.setItem('resultados',JSON.stringify(this.resultados));
          console.log(this.resultados);
        })
    
  }
}
