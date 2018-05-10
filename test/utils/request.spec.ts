import { expect } from '../_helpers/getChai';
import * as XavierAPI from '../../dist/xavier-api.min';


let Xavier;


describe('utils/request', () => {

    beforeEach(() => {
        Xavier = XavierAPI.create(XavierAPI.TESTNET_CONFIG);
    });

    it('should normalize all types of paths', () => {
        expect(Xavier.request.normalizePath('/transactions/unconfirmed')).to.equal('/transactions/unconfirmed');
        expect(Xavier.request.normalizePath('/transactions///unconfirmed/')).to.equal('/transactions/unconfirmed');
        expect(Xavier.request.normalizePath('//transactions/unconfirmed')).to.equal('/transactions/unconfirmed');
        expect(Xavier.request.normalizePath('\/\/transactions/unconfirmed')).to.equal('/transactions/unconfirmed');
        expect(Xavier.request.normalizePath('\/\/transactions\/unconfirmed\/\///\/')).to.equal('/transactions/unconfirmed');
        expect(Xavier.request.normalizePath('transactions/unconfirmed/')).to.equal('/transactions/unconfirmed');
    });

    it('should normalize all type of hosts', () => {
        expect(Xavier.request.normalizeHost('https://nodes.xaviernodes.com')).to.equal('https://nodes.xaviernodes.com');
        expect(Xavier.request.normalizeHost('https://nodes.xaviernodes.com/')).to.equal('https://nodes.xaviernodes.com');
        expect(Xavier.request.normalizeHost('https://nodes.xaviernodes.com//')).to.equal('https://nodes.xaviernodes.com');
        expect(Xavier.request.normalizeHost('https://nodes.xaviernodes.com///')).to.equal('https://nodes.xaviernodes.com');
    });

});
