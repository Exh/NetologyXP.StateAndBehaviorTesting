'use strict';

class CashMachineFake
{
    constructor()
    {
        this._prices = [];
        this._total = 0;
    }

    add_item(item, volume)
    {
        var sum = this._prices[item] * volume / 1000.0;
        this._total += sum;
    }

    set_price_for_item(item, price)
    {
        this._prices[item] = price;
    }

    get_price_for_item(item)
    {
        return this._prices[item];
    }

    get total()
    {
        return this._total;
    }

    reset_total()
    {
        this._total = 0;
    }
}


module.exports = CashMachineFake;