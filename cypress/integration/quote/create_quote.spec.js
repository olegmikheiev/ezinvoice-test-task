import {loginAs} from '../../support/common/actions';

describe('New quote test', function() {
    it('User can log in', function() {
        loginAs('mytest@ezlux.lu', '123456');
    });
});
