"use strict";

class SmsService {
    constructor()
    {
        this._was_called = false;
    }

    send(message) {
        this._was_called = true;
    }

    wasCalled()
    {
        return this._was_called;
    }
}

module.exports = SmsService;