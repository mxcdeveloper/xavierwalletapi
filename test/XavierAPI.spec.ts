import { expect } from './_helpers/getChai';
import * as XavierAPI from '../dist/xavier-api.min';


let requiredConfigValues;
let allConfigValues;


describe('XavierAPI', () => {

    beforeEach(() => {

        requiredConfigValues = {
            networkByte: 1,
            nodeAddress: '1',
            matcherAddress: '1',
            logLevel: 'warning',
            timeDiff: 0 // TODO : add some cases in the future API tests
        };

        allConfigValues = {
            ...requiredConfigValues,
            minimumSeedLength: 1,
            requestOffset: 1,
            requestLimit: 1
        };

    });

    it('should throw when created without required fields in config', () => {
        expect(() => XavierAPI.create({})).to.throw();
        expect(() => XavierAPI.create({ networkByte: 1, nodeAddress: '1' })).to.throw();
        expect(() => XavierAPI.create({ networkByte: 1, matcherAddress: '1' })).to.throw();
        expect(() => XavierAPI.create({ nodeAddress: '1', matcherAddress: '1' })).to.throw();
    });

    it('should have all fields in config when all fields are passed', () => {
        const Xavier = XavierAPI.create(allConfigValues);
        expect(Xavier.config.get()).to.deep.equal(allConfigValues);
    });

    it('should have all fields in config when only required fields are passed', () => {
        const Xavier = XavierAPI.create(requiredConfigValues);
        const config = Xavier.config.get();
        expect(Object.keys(config)).to.have.members(Object.keys(allConfigValues));
    });

    it('should only insert fallback basic values when stored config does not have them', () => {

        const logLevel = 'none';

        const Xavier = XavierAPI.create({ ...requiredConfigValues, logLevel });
        Xavier.config.set({ assetFactory: () => {} });
        const config = Xavier.config.get();
        expect(config.logLevel).to.equal(logLevel);

        const Xavier2 = XavierAPI.create(requiredConfigValues);
        const config2 = Xavier2.config.get();
        expect(config2.logLevel).to.equal(Xavier.constants.DEFAULT_BASIC_CONFIG.logLevel);

    });

});
