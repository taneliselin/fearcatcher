'use strict';
var Document = require('camo').Document;

class ToneMeasurement extends Document {
  constructor() {
    super();
    
    this.anger = Number;
    this.disgust = Number;
    this.fear = Number;
    this.joy = Number;
    this.sadness = Number;

  }
}

module.exports = ToneMeasurement;