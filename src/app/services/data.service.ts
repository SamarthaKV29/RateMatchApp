import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rate, RLocation, RMC } from '../ratematch/ratematch.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>("https://kuebixratematch.herokuapp.com/api/v1/rates");
  }
  getLocations(): Observable<RLocation[]> {
    return this.http.get<RLocation[]>("https://kuebixratematch.herokuapp.com/api/v1/locations");
  }
  getMatchCrits(): Observable<RMC[]> {
    return this.http.get<RMC[]>("https://kuebixratematch.herokuapp.com/api/v1/matchcrit");
  }
}
