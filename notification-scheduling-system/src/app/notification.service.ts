import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INotificationMapper } from './interfaces';
import mapperData from '../assets/mockData/mapperData.json';
import { CONSTANTS } from 'src/assets/constants';
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
    return this.httpClient.post(CONSTANTS.AWS_API, body)
  }

}
