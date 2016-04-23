'use strict';
var Document = require('camo').Document;

class Measurement extends Document {
  constructor() {
    super();
    
    this.anger = Number;
    this.contempt = Number;
    this.disgust = Number;
    this.fear = Number;
    this.happiness = Number;
    this.neutral = Number;
    this.sadness = Number;
    this.surprise = Number;

  }
}

module.exports = Measurement;