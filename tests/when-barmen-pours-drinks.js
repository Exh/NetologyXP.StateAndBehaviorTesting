"use strict";

var assert = require('chai').assert;
var Barmen = require('../src/barmen');
var sinon = require('sinon');

var SmsService = require('../src/sms-service');
var Visitor = require('../src/visitor');
var CupboardFake = require('../tests/fakes/cupboard-fake');
var SmsServiceFake = require('../tests/fakes/sms-service-fake');
var CashMachine = require('../src/cash-machine');
var CashMachineFake = require('../tests/fakes/cash-machine-fake');

suite('When barmen pours drinks', function () {
    let visitor = {};
    let barmen = {};
    suite('cupboard is empty', function () {
        let emptyCupboard = {};
        let cashMachine = [];

        setup(function () {
            visitor = new Visitor();
            visitor.sober();

            emptyCupboard = new CupboardFake();
            emptyCupboard.empty = true;

            cashMachine = new CashMachineFake();
        });

        test('sms to buy drink is sent to boss', function () {
            let smsService = new SmsServiceFake();
            barmen = new Barmen(emptyCupboard, smsService, cashMachine);

            barmen.pour("vodka", 100, visitor);

            assert.equal(smsService.lastSentSms, "Hello. We have run out of vodka. Please buy several bottles.");
        });




        test('sms service is called if no drink is available', function () {
            let smsService = new SmsService();
            let smsServiceMock = sinon.mock(smsService);
            barmen = new Barmen(emptyCupboard, smsService, cashMachine);
            smsServiceMock.expects("send")
                .once()
                .withArgs("Hello. We have run out of vodka. Please buy several bottles.");

            barmen.pour("vodka", 100, visitor);

            smsServiceMock.verify();
            smsServiceMock.restore();
        });






        test('barmen sends sms to buy drink to boss', function () {
            let smsService = new SmsServiceFake();
            barmen = new Barmen(emptyCupboard, smsService, cashMachine);

            barmen.pour("vodka", 100, visitor);

            assert.equal(true, barmen.wasSmsSent("vodka"));
        });

        test('Barmen sends sms to buy drink to boss. Barman does it one time only for each drink', function () {
            let smsService = new SmsService();
            let smsServiceMock = sinon.mock(smsService);
            barmen = new Barmen(emptyCupboard, smsService, cashMachine);
            smsServiceMock.expects("send")
                .once()
                .withArgs("Hello. We have run out of vodka. Please buy several bottles.");

            barmen.pour("vodka", 100, visitor);
            barmen.pour("vodka", 100, visitor);

            smsServiceMock.verify();
            smsServiceMock.restore();
        });


    });

    suite("cupboard is full", function() {
        let fullCupboard = {};
        let cashMachine = [];

        setup(function () {
            visitor = new Visitor();
            visitor.sober();

            fullCupboard = new CupboardFake();
            fullCupboard.empty = false;
        });

        test("accounting tracker is called after purchase of drink", function() {
            let smsService = new SmsServiceFake();
            cashMachine = new CashMachine();

            let cashMachineMock = sinon.mock(cashMachine);
            barmen = new Barmen(fullCupboard, smsService, cashMachine);

            cashMachineMock.expects("add_item").once().withArgs("vodka", 100);
            barmen.pour("vodka", 100, visitor);

            cashMachineMock.verify();
            cashMachineMock.restore();
        });


        test("client buy 100 ml of vodka, total cash of cash machine is 85", function() {
            let smsService = new SmsServiceFake();
            cashMachine = new CashMachineFake();
            barmen = new Barmen(fullCupboard, smsService, cashMachine);
            cashMachine.set_price_for_item("vodka", 850);

            barmen.pour("vodka", 100, visitor);

            assert.equal(85, cashMachine.total);
        });
    });
});
