var Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  console.log('homebridge API version: ' + homebridge.version);

  // Service and Characteristic are from hap-nodejs
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  ContactState = homebridge.hap.Characteristic.ContactSensorState;
  homebridge.registerAccessory('homebridge-watchdog', 'WatchDog', watchDog);
};

function watchDog(log, config) {
  this.log = log;
  this.name = config['name'] || 'Gamis watchdog';
  this.interval = config['interval'] || 60000;
  this.contactTriggered = false;

  setInterval(this.watchdogContactState.bind(this), this.interval);
}

watchDog.prototype = {
  identify: function(callback) {
    callback(null);
  },

  watchdogContactState: function() {
    this.contactTriggered = !this.contactTriggered;
    this.service
      .getCharacteristic(Characteristic.ContactSensorState)
      .setValue(this.contactTriggered);
  },

  getContactSensorState: function(callback) {
    this.log('getContactSensorState: ', this.contactTriggered);
    callback(null, this.contactTriggered);
  },
  getName: function(callback) {
    callback(null, this.name);
  },
  getServices: function() {
    var informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'GAMIS Systems')
      .setCharacteristic(Characteristic.Model, 'Rev-1')
      .setCharacteristic(Characteristic.SerialNumber, 'Version 0.0.3')
      .setCharacteristic(Characteristic.SerialNumber, 'A1S2NASF88EW');

    this.service
      .getCharacteristic(Characteristic.ContactSensorState)
      .on('get', this.getContactSensorState.bind(this));

    this.service
      .getCharacteristic(Characteristic.Name)
      .on('get', this.getName.bind(this));

    return [informationService, this.service];
  }
};
