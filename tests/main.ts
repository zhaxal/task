import { Meteor } from 'meteor/meteor';
import assert from 'assert';
import { updateUserRole } from '/functions/user';
import { UsersCollection } from '/imports/api/collections';

describe('task', function () {
  it('package.json has correct name', async function () {
    const { name } = await import('../package.json');
    assert.strictEqual(name, 'task');
  });

  if (Meteor.isClient) {
    it('client is not server', function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it('server is not client', function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});


