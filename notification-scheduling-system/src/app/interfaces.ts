export interface INotification {
    label: string,
    date: string,
    numberOfDays: number,
    completion: number
}

export interface INotificationResponse {
    companyId: string,
    notifications:Array<string>
}

export interface INotificationMapper  {
    notification: string,
    notificationNumber: number
  }
