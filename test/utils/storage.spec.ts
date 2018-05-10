import { expect } from '../_helpers/getChai';
import { waterfall } from '../_helpers/promiseTools';
import * as XavierAPI from '../../dist/xavier-api.min';


let Xavier;


describe('utils/storage', () => {

    beforeEach(() => {
        Xavier = XavierAPI.create(XavierAPI.TESTNET_CONFIG);
    });

    it('should store data while working on one network', (done) => {
        const storage = Xavier.storage.getStorage();
        waterfall([
            () => storage.set('a', 1),
            () => storage.get('a'),
            (a) => expect(a).to.equal(1)
        ]).then(() => done());
    });

    it('should store data only once while working on one network', (done) => {
        const storage = Xavier.storage.getStorage();
        waterfall([
            () => storage.set('a', 1),
            () => storage.set('a', 1),
            () => storage.getAll().then((data) => {
                expect(data['a']).to.equal(1);
                expect(Object.keys(data)).to.deep.equal(['a']);
            })
        ]).then(() => done());
    });

    it('should store data while working on different networks', (done) => {
        const storage = Xavier.storage.getStorage();
        Xavier.config.set({ networkByte: 'A' });
        waterfall([
            () => storage.set('a', 1),
            () => storage.get('a'),
            (a) => expect(a).to.equal(1),
            () => Xavier.config.set({ networkByte: 'B' }),
            () => storage.get('a'),
            (a) => expect(a).to.be.a('null')
        ]).then(() => done());
    });

    it('should store data only once for every network', (done) => {
        const storage = Xavier.storage.getStorage();
        Xavier.config.set({ networkByte: 'A' });
        waterfall([
            () => storage.set('a', 1),
            () => storage.set('a', 1),
            () => storage.getAll().then((data) => {
                expect(data['a']).to.equal(1);
                expect(Object.keys(data)).to.deep.equal(['a']);
            }),
            () => Xavier.config.set({ networkByte: 'B' }),
            () => storage.get('a'),
            (a) => expect(a).to.be.a('null'),
            () => storage.set('a', 2),
            () => storage.set('a', 2),
            () => storage.getAll().then((data) => {
                expect(data['a']).to.equal(2);
                expect(Object.keys(data)).to.deep.equal(['a']);
            })
        ]).then(() => done());
    });

    it('should always store the data written last', (done) => {
        const storage = Xavier.storage.getStorage();
        waterfall([
            () => storage.set('a', 1),
            () => storage.set('a', 2),
            () => storage.set('a', 3),
            () => storage.get('a'),
            (a) => expect(a).to.equal(3)
        ]).then(() => done());
    });

    it('should return all data in the form of an object', (done) => {
        const storage = Xavier.storage.getStorage();
        waterfall([
            () => storage.set('a', 1),
            () => storage.set('b', 2),
            () => storage.set('c', 3),
            () => storage.getAll(),
            (data) => expect(data).to.deep.equal({ a: 1, b: 2, c: 3 })
        ]).then(() => done());
    });

    it('should return all data in the form of an array', (done) => {
        const storage = Xavier.storage.getStorage();
        waterfall([
            () => storage.set('a', 1),
            () => storage.set('b', 2),
            () => storage.set('c', 3),
            () => storage.getList(),
            (list) => expect(list).to.have.members([1, 2, 3])
        ]).then(() => done());
    });

});
