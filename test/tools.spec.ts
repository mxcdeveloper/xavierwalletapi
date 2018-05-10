import { expect } from './_helpers/getChai';
import * as XavierAPI from '../dist/xavier-api.min';


let Xavier;


describe('tools', function () {

    beforeEach(() => {
        Xavier = XavierAPI.create(XavierAPI.TESTNET_CONFIG);
    });

    it('should build the right address from the given public key', () => {

        const publicKey = 'GL6Cbk3JnD9XiBRK5ntCavSrGGD5JT9pXSRkukcEcaSW';
        const address = '3N1JKsPcQ5x49utR79Maey4tbjssfrn2RYp';

        expect(Xavier.tools.getAddressFromPublicKey(publicKey)).to.equal(address);

    });

});
