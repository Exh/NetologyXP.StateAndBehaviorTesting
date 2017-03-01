'use strict';

class Barmen {
    constructor(cupboard, smsService, cashMachine) {
        this._cupboard = cupboard;
        this._smsService = smsService;
        this._cashMachine = cashMachine;
        this._wasSmsSent = false;
        this._empty_items = [];
    }

    wasSmsSent(item) {
        var empty_item = this._empty_items[item];
        if (empty_item) {
            return true;
        }
        return false;
    }

    resetEmptyItems(item)
    {
        this._empty_items[item] = false;
    }

    pour(drinkName, volume, visitor) {
        if (!this._cupboard.hasDrink(drinkName, volume)) {
            var empty_item = this._empty_items[drinkName];
            if ((empty_item == undefined) ||
                (!empty_item)) {
                this._smsService.send("Hello. We have run out of " + drinkName + ". Please buy several bottles.");
                this._empty_items[drinkName] = true;
            }
            return 0;
        }
        this._cashMachine.add_item(drinkName, volume);
        return this._cupboard.getDrink(drinkName, volume);
    }
}

module.exports = Barmen;