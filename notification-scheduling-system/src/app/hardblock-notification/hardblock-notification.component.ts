import { Component, OnInit } from '@angular/core';
import { INotification, INotificationMapper, INotificationResponse } from '../interfaces';
import { NotificationService } from '../notification.service';
import { faCircleCheck, faCalendar, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { CONSTANTS } from 'src/assets/constants';
import marketData from '../../assets/mockData/marketData.json';
import companyTypeData from '../../assets/mockData/companyTypeData.json';

@Component({
  selector: 'app-hardblock-notification',
  templateUrl: './hardblock-notification.component.html',
  styleUrls: ['./hardblock-notification.component.scss']
})
export class HardblockNotificationComponent implements OnInit {

  faInfo = faCircleInfo;
  faCircleCheck = faCircleCheck;
  faCalendar = faCalendar;

  marketsArr = marketData;
  companyTypeArr = companyTypeData;
  selectedMarket = '';
  selectedCompanyType = '';
  todaysDate = CONSTANTS.TODAYSDATE;  // hard coded date for the task mm/dd/yyyy
  notificationsDatesArr: Array<string> = [];
  notificationDetails: Array<INotification> = [];

  noDataAvailable = false;
  daysToHardblock = 0;
  daysDifference = 0;
  isLoading = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() { }

  /**
   * Function to get notification data from AWS
   */
  getNotificationDetails() {
    this.isLoading = true;
    this.notificationService.getNotificationDates(this.selectedMarket, this.selectedCompanyType).subscribe(
      (data: INotificationResponse) => {
        const response = JSON.parse(JSON.stringify(data));
        this.notificationsDatesArr = response.notifications;
        const labelsArr = this.notificationService.notificationLabelMapper();
        this.setNotification(labelsArr);
        this.noDataAvailable = false;
        this.isLoading = false;
      }, (err: Error) => {
        console.log('err', err);
        this.notificationDetails = [];
        this.noDataAvailable = true;
        this.isLoading = false;
      });
  }

  /**
   * Adds the notification object with label mapping , number of days and completion to notificationDetails array
   * @param labelsArr contains the mapper array
   */
  setNotification(labelsArr: Array<INotificationMapper>) {
    this.notificationDetails = [];
    const maxLimit = 4; // assuming that max number notification dates to be 5 ( 0 to 4)
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
        notification.numberOfDays = -1; // to hide the number of days  after hardblock
        notification.completion = -1; // to hide the progress bar after hardblock
      }
      this.notificationDetails.push(notification);
    });
    this.setDaysToHardBlock();
  }

  /**
   * Sets the total number days to hardblock
   */
  setDaysToHardBlock() {
    this.daysToHardblock = this.daysDifference;
  }

  /**
   * Calculates the completion value comparing on todays date , prev remainder and next remainder dates 
   * @param currentDate 
   * @param nextDate 
   * @param notification 
   */
  setNotificationCompletion(currentDate: string, nextDate: string, notification: INotification) {
    const todayDate = new Date(this.todaysDate);
    const notificationDate = new Date(nextDate);
    let todaysDateDifferenceTime: number = Math.abs(notificationDate.getTime() - todayDate.getTime());
    this.daysDifference = Math.round(todaysDateDifferenceTime / (1000 * 3600 * 24));
    const completion = (Math.round((this.daysDifference / notification.numberOfDays) * 100));
    if (todayDate > new Date(currentDate) && todayDate < notificationDate) {
      notification.completion = 100 - completion;
    } else if (todayDate > new Date(currentDate)) {
      notification.completion = 100;
    } else {
      notification.completion = 0;
    }
  }

  /**
   * calculates the number of days between notifications
   * @param notification 
   * @param currentDate 
   * @param nextDate 
   */
  setNotificationNumberOfDays(notification: INotification, currentDate: string, nextDate: string) {
    const notificationDate = new Date(currentDate);
    const nextNotificationDate = new Date(nextDate);
    let dateDifferenceTime: number = Math.abs(nextNotificationDate.getTime() - notificationDate.getTime());
    notification.numberOfDays = Math.round(dateDifferenceTime / (1000 * 3600 * 24));
    this.setNotificationCompletion(currentDate, nextDate, notification);
  }
}
