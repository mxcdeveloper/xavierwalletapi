import resetRequireCache from '../_helpers/resetRequireCache';
resetRequireCache('dist/xavier-api.min');

import { expect } from '../_helpers/getChai';
import { mockableFetch } from '../_helpers/mockableFetch';
import * as XavierAPI from '../../dist/xavier-api.min';


let Xavier;
let AssetPair;

let fakeXAVIER;
let fakeBTC;


describe('AssetPair', () => {

    beforeEach((done) => {

        Xavier = XavierAPI.create(XavierAPI.TESTNET_CONFIG);
        AssetPair = Xavier.AssetPair;

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
            })
        ]).then((assets) => {

            fakeXAVIER = assets[0];
            fakeBTC = assets[1];

            mockableFetch.replyWith(JSON.stringify({
                pair: {
                    amountAsset: fakeXAVIER.id,
                    priceAsset: fakeBTC.id
                }
            }));

        }).then(() => done());

    });

    afterEach(() => {
        mockableFetch.useOriginal();
    });

    describe('creating instances', () => {

        it('should be an instance of AssetPair when created from two Asset object', (done) => {
            AssetPair.get(fakeXAVIER, fakeBTC).then((assetPair) => {
                expect(AssetPair.isAssetPair(assetPair)).to.be.true;
            }).then(() => done());
        });

        it('should be an instance of AssetPair when created from two asset IDs', (done) => {
            AssetPair.get(fakeXAVIER.id, fakeBTC.id).then((assetPair) => {
                expect(AssetPair.isAssetPair(assetPair)).to.be.true;
            }).then(() => done());
        });

        it('should be an instance of AssetPair when created from an Asset object and an asset ID', (done) => {
            AssetPair.get(fakeXAVIER, fakeBTC.id).then((assetPair) => {
                expect(AssetPair.isAssetPair(assetPair)).to.be.true;
            }).then(() => done());
        });

        it('should be an instance of AssetPair when created from an asset ID and an Asset object', (done) => {
            AssetPair.get(fakeXAVIER.id, fakeBTC).then((assetPair) => {
                expect(AssetPair.isAssetPair(assetPair)).to.be.true;
            }).then(() => done());
        });

    });

    describe('core functionality', () => {

        it('should return the pair if assets are passed in the right order', (done) => {
            AssetPair.get(fakeXAVIER, fakeBTC).then((assetPair) => {
                expect(assetPair.amountAsset).to.equal(fakeXAVIER);
                expect(assetPair.priceAsset).to.equal(fakeBTC);
            }).then(() => done());
        });

        it('should return the pair if assets are passed in the reversed order', (done) => {
            AssetPair.get(fakeBTC, fakeXAVIER).then((assetPair) => {
                expect(assetPair.amountAsset).to.equal(fakeXAVIER);
                expect(assetPair.priceAsset).to.equal(fakeBTC);
            }).then(() => done());
        });

        it('should return the pair with the right precision difference', (done) => {
            AssetPair.get(fakeXAVIER, fakeBTC).then((assetPair) => {
                expect(assetPair.precisionDifference).to.equal(0);
            }).then(() => done());
        });

    });

});
