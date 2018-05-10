import resetRequireCache from '../_helpers/resetRequireCache';
resetRequireCache('dist/xavier-api.min');

import { expect } from '../_helpers/getChai';
import Response from '../_helpers/getResponse';
import { mockableFetch } from '../_helpers/mockableFetch';
import * as XavierAPI from '../../dist/xavier-api.min';


let Xavier;
let OrderPrice;

let fakeXAVIER;
let fakeBTC;
let fakeUSD;
let fakeEUR;
let fakeZERO;


// TODO : add test for `.toFormat()` method

describe('OrderPrice', () => {

    beforeEach((done) => {

        Xavier = XavierAPI.create(XavierAPI.TESTNET_CONFIG);
        OrderPrice = Xavier.OrderPrice;

        mockableFetch.mockWith((input: string) => {
            const [assetOne, assetTwo] = input.split('/').slice(-2);
            return Promise.resolve(new Response(JSON.stringify({
                pair: {
                    amountAsset: assetOne,
                    priceAsset: assetTwo
                }
            })));
        });

        Promise.all([
            Xavier.Asset.get({
                id: 'XAVIER',
                name: 'Xavier',
                precision: 8
            }),
            Xavier.Asset.get({
                id: 'BTC',
                name: 'Bitcoin',
                precision: 8
            }),
            Xavier.Asset.get({
                id: 'USD',
                name: 'US Dollar',
                precision: 2
            }),
            Xavier.Asset.get({
                id: 'EUR',
                name: 'Euro',
                precision: 2
            }),
            Xavier.Asset.get({
                id: 'ZERO',
                name: 'Zero Precision Token',
                precision: 0
            })
        ]).then((assets) => {
            fakeXAVIER = assets[0];
            fakeBTC = assets[1];
            fakeUSD = assets[2];
            fakeEUR = assets[3];
            fakeZERO = assets[4];
        }).then(() => {
            return Xavier.AssetPair.clearCache();
        }).then(() => done());

    });

    afterEach(() => {
        mockableFetch.useOriginal();
    });

    describe('creating instances', () => {

        it('should be an instance of OrderPrice when created from tokens', (done) => {
            OrderPrice.fromTokens('10.00', fakeXAVIER, fakeBTC).then((orderPrice) => {
                expect(OrderPrice.isOrderPrice(orderPrice)).to.be.true;
            }).then(() => done());
        });

        it('should be an instance of OrderPrice when created from matcher coins', (done) => {
            OrderPrice.fromMatcherCoins('10000000000', fakeXAVIER, fakeBTC).then((orderPrice) => {
                expect(OrderPrice.isOrderPrice(orderPrice)).to.be.true;
            }).then(() => done());
        });

        it('should create OrderPrice with Asset instances as arguments', (done) => {
            Promise.all([
                OrderPrice.fromTokens('1000', fakeXAVIER, fakeBTC),
                OrderPrice.fromMatcherCoins('100000000000', fakeXAVIER, fakeBTC)
            ]).then((orderPrices) => {
                expect(OrderPrice.isOrderPrice(orderPrices[0])).to.be.true;
                expect(OrderPrice.isOrderPrice(orderPrices[1])).to.be.true;
            }).then(() => done());
        });

        it('should create OrderPrice with asset IDs as arguments', (done) => {
            Promise.all([
                OrderPrice.fromTokens('1000', fakeXAVIER.id, fakeBTC.id),
                OrderPrice.fromMatcherCoins('100000000000', fakeXAVIER.id, fakeBTC.id)
            ]).then((orderPrices) => {
                expect(OrderPrice.isOrderPrice(orderPrices[0])).to.be.true;
                expect(OrderPrice.isOrderPrice(orderPrices[1])).to.be.true;
            }).then(() => done());
        });

        it('should create OrderPrice when `pair` is an instance of AssetPair', (done) => {
            Xavier.AssetPair.get(fakeXAVIER, fakeBTC).then((pair) => {
                return Promise.all([
                    OrderPrice.fromTokens('1000', pair),
                    OrderPrice.fromMatcherCoins('1000', pair)
                ]);
            }).then((orderPrices) => {
                expect(OrderPrice.isOrderPrice(orderPrices[0])).to.be.true;
                expect(OrderPrice.isOrderPrice(orderPrices[1])).to.be.true;
            }).then(() => done());
        });

    });

    describe('core functionality', () => {

        describe('tokens to matcher coins', () => {

            it('should convert when assets precisions are the same [8, 8]', (done) => {
                OrderPrice.fromTokens('1.47', fakeXAVIER, fakeBTC).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('147000000');
                }).then(() => done());
            });

            it('should convert when assets precisions are the same [2, 2]', (done) => {
                OrderPrice.fromTokens('0.01', fakeUSD, fakeEUR).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('1000000');
                }).then(() => done());
            });

            it('should convert when assets precisions are the same [0, 0]', (done) => {
                OrderPrice.fromTokens('5', fakeZERO, fakeZERO).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('500000000');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [8, 2]', (done) => {
                OrderPrice.fromTokens('11.5', fakeXAVIER, fakeUSD).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('1150');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [8, 0]', (done) => {
                OrderPrice.fromTokens('555', fakeBTC, fakeZERO).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('555');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [2, 8]', (done) => {
                OrderPrice.fromTokens('2.33445566', fakeEUR, fakeBTC).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('233445566000000');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [0, 8]', (done) => {
                OrderPrice.fromTokens('100.01020304', fakeZERO, fakeXAVIER).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('1000102030400000000');
                }).then(() => done());
            });

        });

        describe('tokens to matcher coins while dropping insignificant digits', () => {

            it('should convert when assets precisions are the same [8, 8]', (done) => {
                OrderPrice.fromTokens('11.509910102', fakeXAVIER, fakeBTC).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('1150991010');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [8, 2]', (done) => {
                OrderPrice.fromTokens('11.5099', fakeXAVIER, fakeUSD).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('1150');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [8, 0]', (done) => {
                OrderPrice.fromTokens('555.33', fakeBTC, fakeZERO).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('555');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [2, 8]', (done) => {
                OrderPrice.fromTokens('2.334455667788', fakeEUR, fakeBTC).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('233445566000000');
                }).then(() => done());
            });

            it('should convert when assets precisions are the same [0, 0]', (done) => {
                OrderPrice.fromTokens('555.33', fakeZERO, fakeZERO).then((orderPrice) => {
                    expect(orderPrice.toMatcherCoins()).to.equal('55500000000');
                }).then(() => done());
            });

        });

        describe('matcher coins to tokens', () => {

            it('should convert when assets precisions are the same [8, 8]', (done) => {
                OrderPrice.fromMatcherCoins('147000000', fakeXAVIER, fakeBTC).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('1.47000000');
                }).then(() => done());
            });

            it('should convert when assets precisions are the same [2, 2]', (done) => {
                OrderPrice.fromMatcherCoins('1000000', fakeUSD, fakeEUR).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('0.01');
                }).then(() => done());
            });

            it('should convert when assets precisions are the same [0, 0]', (done) => {
                OrderPrice.fromMatcherCoins('500000000', fakeZERO, fakeZERO).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('5');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [8, 2]', (done) => {
                OrderPrice.fromMatcherCoins('1150', fakeBTC, fakeEUR).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('11.50');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [8, 0]', (done) => {
                OrderPrice.fromMatcherCoins('555', fakeXAVIER, fakeZERO).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('555');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [2, 8]', (done) => {
                OrderPrice.fromMatcherCoins('233445566000000', fakeUSD, fakeXAVIER).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('2.33445566');
                }).then(() => done());
            });

            it('should convert when assets precisions are different [0, 8]', (done) => {
                OrderPrice.fromMatcherCoins('1000102030400000000', fakeZERO, fakeBTC).then((orderPrice) => {
                    expect(orderPrice.toTokens()).to.equal('100.01020304');
                }).then(() => done());
            });

        });

    });

    describe('conversions', () => {

        it('should return a proper BigNumber instance (from coins)', (done) => {
            OrderPrice.fromMatcherCoins('147000000', fakeXAVIER, fakeBTC).then((orderPrice) => {
                const matcherCoins = orderPrice.getMatcherCoins();
                expect(matcherCoins.isBigNumber).to.be.true;
                expect(matcherCoins.toFixed(0)).to.equal('147000000');
                const tokens = orderPrice.getTokens();
                expect(tokens.isBigNumber).to.be.true;
                expect(tokens.toFixed(8)).to.equal('1.47000000');
            }).then(() => done());
        });

        it('should return a proper BigNumber instance (from tokens)', (done) => {
            OrderPrice.fromTokens('1.47000000', fakeXAVIER, fakeBTC).then((orderPrice) => {
                const matcherCoins = orderPrice.getMatcherCoins();
                expect(matcherCoins.isBigNumber).to.be.true;
                expect(matcherCoins.toFixed(0)).to.equal('147000000');
                const tokens = orderPrice.getTokens();
                expect(tokens.isBigNumber).to.be.true;
                expect(tokens.toFixed(8)).to.equal('1.47000000');
            }).then(() => done());
        });

        it('should convert to JSON', (done) => {
            OrderPrice.fromTokens('1.47000000', fakeXAVIER, fakeBTC).then((orderPrice) => {
                const s = '{"amountAssetId":"XAVIER","priceAssetId":"BTC","priceTokens":"1.47000000"}';
                expect(JSON.stringify(orderPrice)).to.equal(s);
            }).then(() => done());
        });

        it('should convert to string', (done) => {
            OrderPrice.fromTokens('1.47000000', fakeXAVIER, fakeBTC).then((orderPrice) => {
                expect(orderPrice.toString()).to.equal('1.47000000 XAVIER/BTC');
            }).then(() => done());
        });

    });

});
