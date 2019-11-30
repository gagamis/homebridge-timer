var Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
  console.log('homebridge API version: ' + homebridge.version);

  // Service and Characteristic are from hap-nodejs
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerAccessory('homebridge-watchdog', 'WatchDog', watchDog);
};

function watchDog(log, config) {
  this.log = log;
  this.name = config['name'] || 'Gamis watchdog';
  this.period = config['period'] || 60000;
  this.contactTriggered = false;
}

watchDog.prototype.getServices = function() {
  // information service
  var informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Gamis Manufacturer')
    .setCharacteristic(Characteristic.Model, 'Rev-1')
    .setCharacteristic(Characteristic.SerialNumber, 'A1S2NASF88EW');

  // contact service
  this.contactService = new Service.ContactSensor(this.name);
  this.contactService
    .getCharacteristic(Characteristic.ContactSensorState)
    .on('get', this.getContact.bind(this));

  var services = [informationService, this.contactService];
  return services;
};

watchDog.prototype.getContact = function(callback) {
  callback(null, this.contactTriggered);
};

// timer
const intervalObj = setInterval(() => {
  this.contactTriggered = !this.contactTriggered;
  this.contactService.setCharacteristic(
    Characteristic.ContactSensorState,
    this.contactTriggered
  );
}, this.period);
