import {detector as usbDetector, Device as UsbDevice} from "./usb-detector";
import {Features} from "@keepkey/device-client/dist/global/features";
import {DeviceClient} from "@keepkey/device-client/dist/device-client";
import {Device as HidDevice, devices as getHidDevices} from "node-hid";
import {NodeTransport} from "./node-transport";
import {EventEmitter2} from "eventemitter2";

export const FEATURE_EVENT = "feature", CONNECT_EVENT = "connect", DISCONNECT_EVENT = "disconnect";

class KeepkeyDeviceHandler {
  private deviceClient: DeviceClient;
  public eventEmitter = new EventEmitter2();

  public initialize() {
    usbDetector.eventEmitter.on(CONNECT_EVENT, this.onDeviceConnected.bind(this));
    usbDetector.eventEmitter.on(DISCONNECT_EVENT, this.onDeviceDisconnected.bind(this));
  }

  private onDeviceConnected(usbDevice: UsbDevice) {
    this.eventEmitter.emit(CONNECT_EVENT);
    let hidDevices: Array<HidDevice> = getHidDevices();
    let connectedDeviceList = hidDevices.filter((hidDevice) => {
      return hidDevice.manufacturer === usbDevice.manufacturer &&
        hidDevice.productId === usbDevice.productId &&
        hidDevice.serialNumber === usbDevice.serialNumber;
    });
    if (connectedDeviceList.length !== 1) {
      throw 'mismatch between USB devices and HID devices';
    }

    NodeTransport.factory(connectedDeviceList[0], (client: DeviceClient) => {
      console.log('initializing device...');
      this.deviceClient = client;
      client.initialize()
        .then((features: { data: Features }) => {
          this.eventEmitter.emit(FEATURE_EVENT, features);
        });
    });
  }

  private onDeviceDisconnected(usbDevice: UsbDevice) {
    console.log('destroying device-client');
    this.eventEmitter.emit(DISCONNECT_EVENT);
    this.deviceClient.destroy();
    this.deviceClient = undefined;
    console.log('disconnected', usbDevice);
  }
}

export let deviceHandler = new KeepkeyDeviceHandler();
deviceHandler.initialize();