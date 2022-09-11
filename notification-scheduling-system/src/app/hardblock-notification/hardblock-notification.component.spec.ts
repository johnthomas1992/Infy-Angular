import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { NotificationService } from '../notification.service';

import { HardblockNotificationComponent } from './hardblock-notification.component';
import { INotificationMapper, INotificationResponse } from '../interfaces';
import mapperData from "../../assets/mapperData.json";
import notificationDates from "./mockData/notificationDates.json";

const NotificationServiceMock:INotificationResponse = notificationDates; 
const mapper : Array<INotificationMapper>= mapperData;
describe('HardblockNotificationComponent', () => {
  let component: HardblockNotificationComponent;
  let fixture: ComponentFixture<HardblockNotificationComponent>;
  let debugElem: DebugElement;
  let elem: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HardblockNotificationComponent],
      providers: [
        { provide: NotificationService, useValue: NotificationServiceMock }
      ],
      imports: [FormsModule, HttpClientTestingModule]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(HardblockNotificationComponent);
        component = fixture.componentInstance;
        debugElem = fixture.debugElement.query(By.css('section'));
        elem = debugElem.nativeElement;
        fixture.detectChanges();
      });
  });

  beforeEach(() => {

  });

  it('should create HardBlockNotification Component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the market on market selection change', waitForAsync(() => {
    fixture.detectChanges();
    let select: HTMLSelectElement = fixture.debugElement.query(By.css('.select-market')).nativeElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let text = select.options[select.selectedIndex].label;
      expect(text).toBe('Norway');
    });
  }));

  it('should set the company type on company type selection change', waitForAsync(() => {
    fixture.detectChanges();
    let select: HTMLSelectElement = fixture.debugElement.query(By.css('.select-company-type')).nativeElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let text = select.options[select.selectedIndex].label;
      expect(text).toBe('Medium');
    });
  }));

  it('should call the getNotificationDetails on submit', () => {
    fixture.detectChanges();
    spyOn(component, 'getNotificationDetails');
    component.selectedCompanyType = 'Small';
    component.selectedMarket = 'Denmark';
    elem = fixture.debugElement.query(By.css('button')).nativeElement;
    elem.click();
    expect(component.getNotificationDetails).toHaveBeenCalled();
  });

  it('should set completeion to 75% after alert when todays date is 01/04/2021 when selected market is Denmark and company type small', () => {
    fixture.detectChanges();
    spyOn(component, 'getNotificationDetails');
    component.selectedCompanyType = 'Small';
    component.selectedMarket = 'Denmark';
    component.todaysDate = '01/04/2021';
    component.notificationsDatesArr = NotificationServiceMock.notifications;
    component.setNotification(mapper);
    expect(component.notificationDetails[0].completion).toBe(75);
  });

  it('should set the prior icon to be checked when todays date is 01/04/2021 when selected market is Denmark and company type small', () => {
    fixture.detectChanges();
    spyOn(component, 'getNotificationDetails');
    component.selectedCompanyType = 'Small';
    component.selectedMarket = 'Denmark';
    component.todaysDate = '01/04/2021';
    component.notificationsDatesArr = NotificationServiceMock.notifications;
    component.setNotification(mapper);
    expect(component.notificationDetails[0].completion).toBeGreaterThan(0);
  });

  it('should throw an error when 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    service.getComments().subscribe(
      data => fail('Should have failed with 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('404 error');
      });
  });
});
