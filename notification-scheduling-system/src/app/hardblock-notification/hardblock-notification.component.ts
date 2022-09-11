import { Component, OnInit } from '@angular/core';
import { INotification, INotificationResponse } from '../interfaces';
import { NotificationService } from '../notification.service';
import { faCircleCheck, faCalendar, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-hardblock-notification',
  templateUrl: './hardblock-notification.component.html',
  styleUrls: ['./hardblock-notification.component.scss']
})
export class HardblockNotificationComponent implements OnInit {

  faInfo = faCircleInfo;
  faCircleCheck = faCircleCheck;
  faCalendar = faCalendar;
  notificationDetails: Array<INotification> = [];
  marketsArr = ["Denmark", "Norway", "Sweden", "Finland"];
  companyTypeArr = ["Small", "Medium", "Large"];
  selectedMarket = '';
  selectedCompanyType = '';
  notificationsDatesArr: Array<string> = [];
  noDataAvailable = false;
  daysToHardblock = 0;
  todaysDate = '01/04/2021';  // hard coded date for the task mm/dd/yyyy

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
  }

  getNotificationDetails() {
    this.notificationService.getNotificationDates(this.selectedMarket, this.selectedCompanyType).subscribe(
      (data: INotificationResponse) => {
        const response = JSON.parse(JSON.stringify(data));
        this.notificationsDatesArr = response.notifications;
        const labelsArr = this.notificationService.notificationLabelMapper();
        this.setNotification(labelsArr);
        this.noDataAvailable = false;
      }, (err: Error) => {
        console.log('err', err);
        this.notificationDetails = [];
        this.noDataAvailable = true;
      });
  }
  setNotification(labelsArr: Array<any>) {
    this.notificationDetails = [];
    const maxLimit = 4;
    const mockNotificationsArr = this.notificationsDatesArr;
    mockNotificationsArr.forEach((elem: any, index: number) => {
      let notification: INotification = { label: '', date: '', numberOfDays: 0, completion: 0 };
      if (this.notificationsDatesArr.length === maxLimit && index === maxLimit - 1) {
        notification.label = labelsArr.filter(element => element.notificationNumber === maxLimit)[0].notification;
      } else {
        notification.label = labelsArr.filter(element => element.notificationNumber === index)[0].notification;
      }
      notification.date = this.notificationsDatesArr[index].toString();
      if (index < this.notificationsDatesArr.length - 1) {
        this.setNotificationNumberOfDays(notification, elem, mockNotificationsArr[index + 1]);
      } else {
        notification.numberOfDays = -1;
        notification.completion = -1;
      }
      this.notificationDetails.push(notification);
    });
    this.setDaysToHardBlock();
  }

  setDaysToHardBlock() {
    this.daysToHardblock =  this.notificationDetails.reduce((acc, val) => acc += val.numberOfDays, 0) + 1;
  }
  setNotificationCompletion(currentDate: string, nextDate: string, notification: INotification) {
    const todayDate = new Date(this.todaysDate);
    const notificationDate = new Date(nextDate);
    let todaysDateDifferenceTime: number = Math.abs(notificationDate.getTime() - todayDate.getTime());
    const todaysDateDifference = Math.round(todaysDateDifferenceTime / (1000 * 3600 * 24));
    const completion = (Math.round((todaysDateDifference / notification.numberOfDays) * 100));
    if (todayDate > new Date(currentDate) && todayDate < notificationDate) {
      notification.completion = 100 - completion;
    } else if (todayDate > new Date(currentDate)) {
      notification.completion = 100;
    } else {
      notification.completion = 0;
    }
  }

  setNotificationNumberOfDays(notification: INotification, currentDate: string, nextDate: string) {
    const notificationDate = new Date(currentDate);
    const nextNotificationDate = new Date(nextDate);
    let dateDifferenceTime: number = Math.abs(nextNotificationDate.getTime() - notificationDate.getTime());
    notification.numberOfDays = Math.round(dateDifferenceTime / (1000 * 3600 * 24));
    this.setNotificationCompletion(currentDate, nextDate, notification);
  }
}
