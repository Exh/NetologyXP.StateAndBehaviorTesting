"use strict";

class SmsServiceFake {
    constructor() {
        this._lastSentSms = '';
        this._was_called = false;
    }

    send(message) {
        this._lastSentSms = message;
        this._was_called = true;
    }

    get lastSentSms() {
        return this._lastSentSms;
    }

    wasCalled()
    {
        return this._was_called;
    }
}

module.exports = SmsServiceFake;