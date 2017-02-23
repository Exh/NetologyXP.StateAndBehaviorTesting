'use strict';

class Barmen {
    constructor(cupboard, smsService, cashMachine) {
        this._cupboard = cupboard;
        this._smsService = smsService;
        this._cashMachine = cashMachine;
        this._wasSmsSent = false;
    }

    get wasSmsSent() {
        return this._wasSmsSent;
    }

    pour(drinkName, volume, visitor) {
        if (!this._cupboard.hasDrink(drinkName, volume)) {
            this._smsService.send("Hello. We have run out of " + drinkName + ". Please buy several bottles.");
            this._wasSmsSent = this._smsService.wasCalled();
        }
        this._cashMachine.add_item(drinkName + ": " + volume + " ml");
        return this._cupboard.getDrink(drinkName, volume);
    }
}

module.exports = Barmen;