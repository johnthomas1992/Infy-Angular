import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INotificationMapper } from './interfaces';
import mapperData from '../assets/mapperData.json';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  mapper: Array<INotificationMapper> = mapperData;
  constructor(private httpClient: HttpClient) { }

  notificationLabelMapper(): Array<any> {
    return this.mapper;
  }

  getNotificationDates(market: string, companyType: string): Observable<any> {
    let body = {
      "Country": market,
      "Type": companyType
    };
    return this.httpClient.post("https://5vlquaf0qc.execute-api.ap-south-1.amazonaws.com/mock-stage/mock-data", body)
  }

}
