/// <reference path="../node_modules/electron/electron.d.ts" />

import {deviceHandler, CONNECT_EVENT, DISCONNECT_EVENT, FEATURE_EVENT} from "./keepkey-device-handler";
import "jquery";
import {Features} from "@keepkey/device-client/dist/global/features";
import {DeviceMessageHelper} from "@keepkey/device-client/dist/device-message-helper";

$('#node-version').text(process.versions.node);
$('#chrome-version').text(process.versions.chrome);
$('#electron-version').text(process.versions.electron);

deviceHandler.eventEmitter.addListener(CONNECT_EVENT, () => {
  $('#keepkey-detected').text('true');
});

deviceHandler.eventEmitter.addListener(DISCONNECT_EVENT, () => {
  $('#keepkey-detected').text('false');
  $('#firmware-version').text('');
  $('#feature-data').text('');
  $('#bootloader-version').text('');
  $('#label').text('');
});

deviceHandler.eventEmitter.addListener(FEATURE_EVENT, (features: Features) => {
  $('#feature-data').text(JSON.stringify(features, DeviceMessageHelper.buffer2Hex, 4));
  $('#firmware-version').text(features.version);
  $('#bootloader-version').text(features.raw.bootloaderInfo.tag);
  $('#label').text(features.raw.label);
});

$("#dark-mode").on('change', function () {
  let checked = $(this).prop('checked');
  checked ? $('body').addClass('dark') : $('body').removeClass('dark');
});