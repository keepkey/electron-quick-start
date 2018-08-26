import * as UsbDetect from "usb-detection";
import {EventEmitter2, Listener} from "eventemitter2";

export type Device = UsbDetect.Device;
type deviceAddress = number;

const KEEPKEY_VENDOR_ID: number = 11044;
const KEEPKEY_PRODUCT_ID: number = 1;

export const CONNECT_EVENT = 'connect';
export const DISCONNECT_EVENT = 'disconnect';

class UsbDetector {
  private activeDevices = new Map<deviceAddress, Device>();
  public eventEmitter = new EventEmitter2({newListener: true})

  private find() {
    UsbDetect.find(KEEPKEY_VENDOR_ID, KEEPKEY_PRODUCT_ID, (err, devices) => {
      if (err) {
        throw err;
      } else {
        devices.forEach((device: Device) => {
          if (!this.activeDevices.get(device.deviceAddress)) {
            this.activeDevices.set(device.deviceAddress, device);
            this.eventEmitter.emit('connect', device);
          }
        })
      }
    });
  }

  public initiate() {
    // new 'connect' listeners get fired for already connected devices
    this.eventEmitter.on('newListener', (event: string | string[], listener: Listener) => {
      if (event === CONNECT_EVENT || (event.indexOf && event.indexOf(CONNECT_EVENT) != -1)) {
        this.activeDevices.forEach((device: Device) => listener(device));
      }
    });

    UsbDetect.startMonitoring();

    UsbDetect.on('add:11044:1', (device) => {
      if (!this.activeDevices.get(device.deviceAddress)) {
        this.activeDevices.set(device.deviceAddress, device);
        this.eventEmitter.emit(CONNECT_EVENT, device);
      }
    });
    UsbDetect.on('remove:11044:1', (device) => {
      if (this.activeDevices.get(device.deviceAddress)) {
        this.activeDevices.delete(device.deviceAddress);
        this.eventEmitter.emit(DISCONNECT_EVENT, device);
      }
    });

    this.find();
  }
}

export let detector = new UsbDetector();
detector.initiate();

export default detector;

