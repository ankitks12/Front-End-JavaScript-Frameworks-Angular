import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgServive: ProcessHTTPMsgService) { }

  getLeaders() : Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsgServive.handleError));
  }

  getLeader(id : string) : Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
    .pipe(catchError(this.processHTTPMsgServive.handleError));  //Array function => , shorthand for normal js function  
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
    .pipe(catchError(this.processHTTPMsgServive.handleError));
  }
}
