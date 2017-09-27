/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/*eslint-env mocha*/

import mutationTracker from 'object-invariant-test-helper';
import { expect } from 'chai';

import * as actionTypes from '../../../app/constants/actionTypes';
import * as users from '../../../app/reducers/users';

describe('users', () => {
  describe('allUsers', () => {
    const user = {userid: 'a1b2c3', email: 'annie@foo.com'};
    const profile = {fullName: 'Annie Foo'};
    const memberships = [
      {userid: 'a1b2c3', profile: {fullName: 'Annie Foo'}},
      {userid: 'd4e5f6', profile: {b: 2}}
    ];
    const account = {userid: 'jkl012', profile: {fullName: 'Jane Doe', patient: { birthday: '2010-01-01' }}};
    it('should return the initial state', () => {
      expect(users.allUsers(undefined, {})).to.deep.equal({});
    });

    it('should handle LOGIN_SUCCESS', () => {
      const action = {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile, memberships }
      };
      expect(users.allUsers(undefined, action)).to.deep.equal({
        a1b2c3: {email: user.email, fullName: profile.fullName},
        d4e5f6: {b: 2}
      });
      let initialState = {};
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === users.allUsers(initialState, action)).to.be.false;
    });

    it('should handle SET_USER_INFO_FROM_TOKEN', () => {
      const action = {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user, profile, memberships }
      };
      expect(users.allUsers(undefined, action)).to.deep.equal({
        a1b2c3: {email: user.email, fullName: profile.fullName},
        d4e5f6: {b: 2}
      });
      let initialState = {};
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === users.allUsers(initialState, action)).to.be.false;
    });

    it('should handle SET_ALL_USERS', () => {
      const action = {
        type: actionTypes.SET_ALL_USERS,
        payload: { user, profile, memberships }
      };
      expect(users.allUsers(undefined, action)).to.deep.equal({
        a1b2c3: {email: user.email, fullName: profile.fullName},
        d4e5f6: {b: 2}
      });
      let initialState = {};
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === users.allUsers(initialState, action)).to.be.false;
    });

    it('should handle CREATE_CUSTODIAL_ACCOUNT_SUCCESS', () => {
      const action = {
        type: actionTypes.CREATE_CUSTODIAL_ACCOUNT_SUCCESS,
        payload: { account }
      };
      expect(users.allUsers(undefined, action)).to.deep.equal({
        jkl012: account.profile
      });
      let initialState = {};
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === users.allUsers(initialState, action)).to.be.false;
    });

    it('should handle UPDATE_PROFILE_SUCCESS', () => {
      const action = {
        type: actionTypes.UPDATE_PROFILE_SUCCESS,
        payload: { profile, userId: 'a1b2c3' }
      };
      let initialState = {};
      const tracked = mutationTracker.trackObj(initialState);
      expect(users.allUsers(initialState, action)).to.deep.equal({
        a1b2c3: profile
      });
      expect(mutationTracker.hasMutated(tracked)).to.be.false;
    });

    it('should handle LOGOUT_REQUEST', () => {
      let initialState = {foo: 'bar'};
      let result = users.allUsers(initialState, {
        type: actionTypes.LOGOUT_REQUEST
      });
      expect(result).to.deep.equal({});
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
    });
  });

  describe('loggedInUser', () => {
    const user = {userid: 'a1b2c3'};
    it('should return the initial state', () => {
      expect(users.loggedInUser(undefined, {})).to.be.null;
    });

    it('should handle LOGIN_SUCCESS', () => {
      expect(users.loggedInUser(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user }
      })).to.equal(user.userid);
    });

    it('should handle LOGOUT_REQUEST', () => {
      expect(users.loggedInUser(undefined, {
        type: actionTypes.LOGOUT_REQUEST
      })).to.be.null;
    });

    it('should handle SET_USER_INFO_FROM_TOKEN', () => {
      expect(users.loggedInUser(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user }
      })).to.equal(user.userid);
    });
  });

  describe('loginErrorMessage', () => {
    it('should return the initial state', () => {
      expect(users.loginErrorMessage(undefined, {})).to.be.null;
    });

    it('should handle LOGIN_FAILURE', () => {
      const errMsg = 'Login error!';
      expect(users.loginErrorMessage(undefined, {
        type: actionTypes.LOGIN_FAILURE,
        error: true,
        payload: new Error(errMsg)
      })).to.equal(errMsg);
    });

    it('should handle LOGIN_REQUEST', () => {
      expect(users.loginErrorMessage(undefined, {
        type: actionTypes.LOGIN_REQUEST
      })).to.be.null;
    });
  });

  describe('updateProfileErrorMessage', () => {
    it('should return the initial state', () => {
      expect(users.updateProfileErrorMessage(undefined, {})).to.be.null;
    });

    it('should handle UPDATE_PROFILE_FAILURE', () => {
      const errMsg = 'Update profile error!';
      expect(users.updateProfileErrorMessage(undefined, {
        type: actionTypes.UPDATE_PROFILE_FAILURE,
        error: true,
        payload: new Error(errMsg)
      })).to.equal(errMsg);
    });

    it('should handle UPDATE_PROFILE_REQUEST', () => {
      expect(users.updateProfileErrorMessage(undefined, {
        type: actionTypes.UPDATE_PROFILE_REQUEST
      })).to.be.null;
    });
  });

  describe('updateProfileErrorDismissed', () => {
    it('should return the initial state', () => {
      expect(users.updateProfileErrorDismissed(undefined, {})).to.be.null;
    });

    it('should handle DISMISS_UPDATE_PROFILE_ERROR', () => {
      expect(users.updateProfileErrorDismissed(undefined, {
        type: actionTypes.DISMISS_UPDATE_PROFILE_ERROR
      })).to.equal(true);
    });

    it('should handle UPDATE_PROFILE_REQUEST', () => {
      expect(users.updateProfileErrorDismissed(undefined, {
        type: actionTypes.UPDATE_PROFILE_REQUEST
      })).to.be.null;
    });
  });

  describe('createCustodialAccountErrorMessage', () => {
    it('should return the initial state', () => {
      expect(users.createCustodialAccountErrorMessage(undefined, {})).to.be.null;
    });

    it('should handle CREATE_CUSTODIAL_ACCOUNT_FAILURE', () => {
      const errMsg = 'Could not create account!';
      expect(users.createCustodialAccountErrorMessage(undefined, {
        type: actionTypes.CREATE_CUSTODIAL_ACCOUNT_FAILURE,
        error: true,
        payload: new Error(errMsg)
      })).to.equal(errMsg);
    });

    it('should handle CREATE_CUSTODIAL_ACCOUNT_REQUEST', () => {
      expect(users.createCustodialAccountErrorMessage(undefined, {
        type: actionTypes.CREATE_CUSTODIAL_ACCOUNT_REQUEST
      })).to.be.null;
    });
  });

  describe('createCustodialAccountErrorDismissed', () => {
    it('should return the initial state', () => {
      expect(users.createCustodialAccountErrorDismissed(undefined, {})).to.be.false;
    });

    it('should handle DISMISS_CREATE_CUSTODIAL_ACCOUNT_ERROR', () => {
      expect(users.createCustodialAccountErrorDismissed(undefined, {
        type: actionTypes.DISMISS_CREATE_CUSTODIAL_ACCOUNT_ERROR
      })).to.equal(true);
    });

    it('should handle CREATE_CUSTODIAL_ACCOUNT_REQUEST', () => {
      expect(users.createCustodialAccountErrorDismissed(undefined, {
        type: actionTypes.CREATE_CUSTODIAL_ACCOUNT_REQUEST
      })).to.be.false;
    });
  });

  describe('targetDevices', () => {
    const memberships = [
      {userid: 'a1b2c3', profile: {foo: 'bar'}},
      {userid: 'd4e5f6', profile: {patient: {a: 1, targetDevices:['a_cgm', 'a_meter']}}},
      {userid: 'g7h8i0', profile: {patient: {b: 2}}}
    ];
    it('should return the initial state', () => {
      expect(users.targetDevices(undefined, {})).to.deep.equal({});
    });

    it('should handle ADD_TARGET_DEVICE', () => {
      const userId = 'a1b2c3', deviceKey = 'a_pump';
      let initialState = {
        [userId]: ['a_meter'],
        d4e5f6: ['another_pump']
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.ADD_TARGET_DEVICE,
        payload: { userId, deviceKey }
      });
      expect(result).to.deep.equal({
        [userId]: ['a_meter', 'a_pump'],
        d4e5f6: ['another_pump']
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
      expect(initialState[userId] === result[userId]).to.be.false;
    });

    it('should handle ADD_TARGET_DEVICE [without dups]', () => {
      const userId = 'a1b2c3', deviceKey = 'a_pump';
      let initialState = {
        [userId]: ['a_meter', 'a_pump'],
        d4e5f6: ['another_pump']
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.ADD_TARGET_DEVICE,
        payload: { userId, deviceKey }
      });
      expect(result).to.deep.equal({
        [userId]: ['a_meter', 'a_pump'],
        d4e5f6: ['another_pump']
      });

      // due to dupe, state is not modified
      expect(initialState === result).to.be.true;
      expect(initialState[userId] === result[userId]).to.be.true;
    });

    it('should handle ADD_TARGET_DEVICE [when no user selected]', () => {
      const userId = 'noUserSelected', deviceKey = 'a_pump';
      let initialState = {
        a1b2c3: ['a_meter', 'a_pump'],
        d4e5f6: ['another_pump']
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.ADD_TARGET_DEVICE,
        payload: { userId, deviceKey }
      });
      expect(result).to.deep.equal({
        noUserSelected: ['a_pump'],
        a1b2c3: ['a_meter', 'a_pump'],
        d4e5f6: ['another_pump']
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
      expect(initialState[userId] === result[userId]).to.be.false;
    });

    it('should handle LOGIN_SUCCESS', () => {
      expect(users.targetDevices(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { memberships }
      })).to.deep.equal({
        d4e5f6: ['a_cgm', 'a_meter'],
        g7h8i0: []
      });
    });

    it('should handle LOGOUT_REQUEST', () => {
      let initialState = {
        d4e5f6: ['a_meter', 'another_pump'],
        g7h8i0: ['a_pump', 'a_cgm']
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.LOGOUT_REQUEST
      });
      expect(result).to.deep.equal({});
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
    });

    it('should handle REMOVE_TARGET_DEVICE', () => {
      const userId = 'a1b2c3', deviceKey = 'a_meter';
      let initialState = {
        [userId]: ['a_meter', 'a_pump'],
        d4e5f6: ['another_pump']
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.REMOVE_TARGET_DEVICE,
        payload: { userId, deviceKey }
      });
      expect(result).to.deep.equal({
        [userId]: ['a_pump'],
        d4e5f6: ['another_pump']
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
      expect(initialState[userId] === result[userId]).to.be.false;
    });

    it('should handle SET_USER_INFO_FROM_TOKEN', () => {
      expect(users.targetDevices(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { memberships }
      })).to.deep.equal({
        d4e5f6: ['a_cgm', 'a_meter'],
        g7h8i0: []
      });
    });

    it('should handle SET_USERS_TARGETS', () => {
      let initialState = {
        d4e5f6: [],
        g7h8i0: []
      };
      const targets = {
        d4e5f6: [{key: 'a_cgm'}],
        g7h8i0: [{key: 'a_pump'}, {key: 'a_meter'}],
        j1k2l3: [{key: 'another_pump'}]
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.SET_USERS_TARGETS,
        payload: { targets }
      });
      expect(result).to.deep.equal({
        d4e5f6: ['a_cgm'],
        g7h8i0: ['a_pump', 'a_meter']
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
      expect(initialState.d4e5f6 === result.d4e5f6).to.be.false;
      expect(initialState.g7h8i0 === result.g7h8i0).to.be.false;
    });

    it('should handle STORING_USERS_TARGETS (by clearing noUserSelected devices)', () => {
      const initialState = {
        noUserSelected: ['a_pump', 'a_cgm'],
        a1b2c3: ['a_pump', 'a_cgm', 'a_meter']
      };
      let result = users.targetDevices(initialState, {
        type: actionTypes.STORING_USERS_TARGETS
      });
      expect(result).to.deep.equal({
        a1b2c3: ['a_pump', 'a_cgm', 'a_meter']
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
    });
  });

  describe('targetTimezones', () => {
    const memberships = [
      {userid: 'a1b2c3', profile: {foo: 'bar'}},
      {userid: 'd4e5f6', profile: {patient: {a: 1, targetTimezone: 'US/Mountain'}}},
      {userid: 'g7h8i0', profile: {patient: {b: 2}}}
    ];
    it('should return the initial state', () => {
      expect(users.targetTimezones(undefined, {})).to.deep.equal({});
    });

    it('should handle LOGIN_SUCCESS', () => {
      expect(users.targetTimezones(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { memberships }
      })).to.deep.equal({
        d4e5f6: 'US/Mountain',
        g7h8i0: null
      });
    });

    it('should handle LOGOUT_REQUEST', () => {
      let initialState = {
        d4e5f6: 'Pacific/Honolulu',
        g7h8i0: 'US/Pacific'
      };
      let result = users.targetTimezones(initialState, {
        type: actionTypes.LOGOUT_REQUEST
      });
      expect(result).to.deep.equal({});
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
    });

    it('should handle SET_TARGET_TIMEZONE', () => {
      const userId = 'a1b2c3', timezoneName = 'Pacific/Honolulu';
      let initialState = {
        [userId]: null,
        d4e5f6: 'US/Pacific'
      };
      let result = users.targetTimezones(initialState, {
        type: actionTypes.SET_TARGET_TIMEZONE,
        payload: { userId, timezoneName }
      });
      expect(result).to.deep.equal({
        [userId]: timezoneName,
        d4e5f6: 'US/Pacific'
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
      expect(initialState[userId] === result[userId]).to.be.false;
    });

    it('should handle SET_USER_INFO_FROM_TOKEN', () => {
      expect(users.targetTimezones(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { memberships }
      })).to.deep.equal({
        d4e5f6: 'US/Mountain',
        g7h8i0: null
      });
    });

    it('should handle SET_USERS_TARGETS', () => {
      let initialState = {
        d4e5f6: null,
        g7h8i0: null
      };
      const targets = {
        d4e5f6: [{timezone: 'Pacific/Honolulu'}],
        g7h8i0: [{timezone: 'Europe/London'}, {timezone: 'Pacific/Auckland'}],
        j1k2l3: [{timezone: 'US/Eastern'}]
      };
      let result = users.targetTimezones(initialState, {
        type: actionTypes.SET_USERS_TARGETS,
        payload: { targets }
      });
      expect(result).to.deep.equal({
        d4e5f6: 'Pacific/Honolulu',
        g7h8i0: null
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
      expect(initialState.d4e5f6 === result.d4e5f6).to.be.false;
    });

    it('should handle STORING_USERS_TARGETS (by clearing noUserSelected devices)', () => {
      const initialState = {
        noUserSelected: 'Pacific/Honolulu',
        a1b2c3: 'US/Eastern'
      };
      let result = users.targetTimezones(initialState, {
        type: actionTypes.STORING_USERS_TARGETS
      });
      expect(result).to.deep.equal({
        a1b2c3: 'US/Eastern'
      });
      // tests to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
    });
  });

  describe('targetUsersForUpload', () => {
    const user = {userid: 'a1b2c3'};
    const memberships = [
      {userid: 'a1b2c3', profile: {fullName: 'Annie Foo'}},
      {userid: 'd4e5f6', profile: {patient: {b: 2}}}
    ];
    it('should return the initial state', () => {
      expect(users.targetUsersForUpload(undefined, {})).to.deep.equal([]);
    });

    it('should handle LOGIN_SUCCESS [loggedInUser is PWD]', () => {
      const profile = {patient: {diagnosisDate: '1999-01-01'}};
      expect(users.targetUsersForUpload(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile, memberships }
      })).to.deep.equal(['a1b2c3', 'd4e5f6']);
    });

    it('should handle LOGIN_SUCCESS [loggedInUser is not PWD]', () => {
      const profile = {a: 1};
      expect(users.targetUsersForUpload(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile, memberships }
      })).to.deep.equal(['d4e5f6']);
    });

    it('should handle LOGOUT_REQUEST', () => {
      const initialState = ['d4e5f6'];
      const result = users.targetUsersForUpload(initialState, {
        type: actionTypes.LOGOUT_REQUEST
      });
      expect(result).to.deep.equal([]);
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === result).to.be.false;
    });

    it('should handle SET_USER_INFO_FROM_TOKEN [loggedInUser is PWD]', () => {
      const profile = {patient: {diagnosisDate: '1999-01-01'}};
      expect(users.targetUsersForUpload(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user, profile, memberships }
      })).to.deep.equal(['a1b2c3', 'd4e5f6']);
    });

    it('should handle SET_USER_INFO_FROM_TOKEN [loggedInUser is not PWD]', () => {
      const profile = {a: 1};
      expect(users.targetUsersForUpload(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user, profile, memberships }
      })).to.deep.equal(['d4e5f6']);
    });

    it('should handle SET_ALL_USERS', () => {
      const profile = {a: 1};
      expect(users.targetUsersForUpload(undefined, {
        type: actionTypes.SET_ALL_USERS,
        payload: { user, profile, memberships }
      })).to.deep.equal(['d4e5f6']);
    });

    describe('SET_ALL_USERS', () => {
      it('should handle when logged in is VCA', () => {
        const profile = {patient: {b: 2}};
        const user = {userid: 'x1y2z3', profile: {fullName: 'VCA Foo'}, roles: ['clinic']};
        const memberships = [
          {userid: 'a1b2c3', profile: {fullName: 'Annie Foo'}},
          {userid: 'd4e5f6', profile: {patient: {b: 2}}},
          user
        ];
        expect(users.targetUsersForUpload(undefined, {
          type: actionTypes.SET_ALL_USERS,
          payload: { user, profile, memberships }
        })).to.deep.equal(['a1b2c3','d4e5f6']);
      });
      it('should handle non VCA roles', () => {
        const profile = {patient: {b: 2}};
        const user = {userid: '888', profile: { patient: {c: 1}}, roles: ['other']};
        const memberships = [
          {userid: 'd4e5f6', profile: {patient: {b: 2}}},
          {userid: 'x1y2z3', profile: {patient: {a: 1}}},
          user
        ];
        expect(users.targetUsersForUpload(undefined, {
          type: actionTypes.SET_ALL_USERS,
          payload: { user, profile, memberships }
        })).to.deep.equal(['d4e5f6', 'x1y2z3', '888']);
      });
      it('should handle normal accounts', () => {
        const profile = {a: 1};
        expect(users.targetUsersForUpload(undefined, {
          type: actionTypes.SET_ALL_USERS,
          payload: { user, profile, memberships }
        })).to.deep.equal(['d4e5f6']);
      });
    });

    it('should handle CREATE_CUSTODIAL_ACCOUNT_SUCCESS', () => {
      const action = {
        type: actionTypes.CREATE_CUSTODIAL_ACCOUNT_SUCCESS,
        payload: { account: user }
      };
      expect(users.targetUsersForUpload(undefined, action)).to.deep.equal(['a1b2c3']);
      let initialState = [];
      // test to be sure not *mutating* state object but rather returning new!
      expect(initialState === users.targetUsersForUpload(initialState, action)).to.be.false;
    });
  });

  describe('uploadTargetUser', () => {
    const user = {userid: 'a1b2c3'};
    it('should return the initial state', () => {
      expect(users.uploadTargetUser(undefined, {})).to.be.null;
    });

    it('should handle LOGIN_SUCCESS [loggedInUser is PWD]', () => {
      const profile = {patient: {diagnosisDate: '1999-01-01'}};
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile }
      })).to.equal(user.userid);
    });

    it('should handle LOGIN_SUCCESS [loggedInUser is not PWD, can upload to only one]', () => {
      const profile = {a: 1};
      const memberships = [
        {userid: 'a1b2c3'},
        {userid: 'd4e5f6', profile: {patient: {diagnosisDate: '1999-01-01'}}}
      ];
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile, memberships }
      })).to.equal(memberships[1].userid);
    });

    it('should handle LOGIN_SUCCESS [loggedInUser is clinic, can upload to only one]', () => {
      const user = {userid: 'a1b2c3', roles: ['clinic']};
      const profile = {a: 1};
      const memberships = [
        {userid: 'a1b2c3'},
        {userid: 'd4e5f6', profile: {patient: {diagnosisDate: '1999-01-01'}}}
      ];
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile, memberships }
      })).to.be.null;
    });

    it('should handle LOGIN_SUCCESS [loggedInUser is not PWD, can upload to > 1]', () => {
      const profile = {a: 1};
      const memberships = [{userid: 'd4e5f6'}, {foo: 'bar'}];
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user, profile, memberships }
      })).to.be.null;
    });

    it('should handle LOGOUT_REQUEST', () => {
      expect(users.uploadTargetUser('d4e5f6', {
        type: actionTypes.LOGOUT_REQUEST
      })).to.equal(null);
    });

    it('should handle SET_UPLOAD_TARGET_USER', () => {
      const userId = 'a1b2c3';
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.SET_UPLOAD_TARGET_USER,
        payload: { userId }
      })).to.equal(userId);
    });

    it('should handle SET_USER_INFO_FROM_TOKEN [loggedInUser is PWD]', () => {
      const profile = {patient: {diagnosisData: '1999-01-01'}};
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user, profile }
      })).to.equal(user.userid);
    });

    it('should handle SET_USER_INFO_FROM_TOKEN [loggedInUser is not PWD, can upload to only one]', () => {
      const profile = {a: 1};
      const memberships = [
        {userid: 'a1b2c3'},
        {userid: 'd4e5f6', profile: {patient: {diagnosisDate: '1999-01-01'}}}
      ];
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user, profile, memberships }
      })).to.equal(memberships[1].userid);
    });

    it('should handle SET_USER_INFO_FROM_TOKEN [loggedInUser is not PWD, can upload to > 1]', () => {
      const profile = {a: 1};
      const memberships = [{userid: 'd4e5f6'}, {foo: 'bar'}];
      expect(users.uploadTargetUser(undefined, {
        type: actionTypes.SET_USER_INFO_FROM_TOKEN,
        payload: { user, profile, memberships }
      })).to.be.null;
    });
  });
});
