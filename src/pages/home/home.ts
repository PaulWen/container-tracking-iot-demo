import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {SensorsPage} from "../sensors/sensors";
import {Logger} from "../../app/logger";
import {AppConfig} from "../../app/app.config";
import {Storage} from "@ionic/storage";

/**
 * This class represents the start screen of the app.
 * Via this app page the IoT device can be configured with the correct credentials in order to connect it to the
 * IBM Watson IoT Platform. This class does also make sure that the configuration gets saved persistently to the app storage.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private organisation: string;
  private deviceType: string;
  private deviceId: string;
  private authenticationToken: string;
  private uploadUrl: string;

  constructor(public navCtrl: NavController, private storage: Storage) {
    // read configuration from the storage or set it to undefined
    this.storage.get(AppConfig.STORAGE_KEY_ORGANISATION).then((value:string) => {
      if (value != null) {
        this.organisation = value;
      } else {
        this.organisation = "";
      }
    });
    this.storage.get(AppConfig.STORAGE_KEY_DEVICE_TYPE).then((value:string) => {
      if (value != null) {
        this.deviceType = value;
      } else {
        this.deviceType = "";
      }
    });
    this.storage.get(AppConfig.STORAGE_KEY_DEVICE_ID).then((value:string) => {
      if (value != null) {
        this.deviceId = value;
      } else {
        this.deviceId = "";
      }
    });
    this.storage.get(AppConfig.STORAGE_KEY_AUTHENTICATION_TOKEN).then((value:string) => {
      if (value != null) {
        this.authenticationToken = value;
      } else {
        this.authenticationToken = "";
      }
    });
    this.storage.get(AppConfig.STORAGE_UPLOAD_URL).then((value: string) => {
      if (value != null) {
        this.uploadUrl = value;
      } else {
        this.uploadUrl = "https://container-tracker-dashboard.mybluemix.net/image-upload";
      }
    });
  }

  /**
   * This method opens the sensor page and provides the sensor page with the login data of the
   * IoT device so that the device can be contacted to the IBM Watson IoT Platform.
   */
  private openSensorPage() {
    // store the configuration data to the local app storage
    this.storage.set(AppConfig.STORAGE_KEY_ORGANISATION, this.organisation);
    this.storage.set(AppConfig.STORAGE_KEY_DEVICE_TYPE, this.deviceType);
    this.storage.set(AppConfig.STORAGE_KEY_DEVICE_ID, this.deviceId);
    this.storage.set(AppConfig.STORAGE_KEY_AUTHENTICATION_TOKEN, this.authenticationToken);
    this.storage.set(AppConfig.STORAGE_UPLOAD_URL, this.uploadUrl);

    // build up payload to pass to the sensor page
    let payload: any = {};

    payload[AppConfig.STORAGE_KEY_ORGANISATION] = this.organisation;
    payload[AppConfig.STORAGE_KEY_DEVICE_ID] = this.deviceId;
    payload[AppConfig.STORAGE_KEY_DEVICE_TYPE] = this.deviceType;
    payload[AppConfig.STORAGE_KEY_AUTHENTICATION_TOKEN] = this.authenticationToken;
    payload[AppConfig.STORAGE_UPLOAD_URL] = this.uploadUrl;

    // call the sensor page to start the tracking
    this.navCtrl.push(SensorsPage, payload);
  }

}
