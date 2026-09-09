import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canManageSettings, canWriteContent, hasAdminAccess, requireAdminRole, requireWriteAccess } from '../lib/permissions';

describe('admin permissions', () => {
  it('allows super admin and admin to manage settings', () => {
    assert.equal(hasAdminAccess('super_admin'), true);
    assert.equal(hasAdminAccess('admin'), true);
    assert.equal(canManageSettings('super_admin'), true);
    assert.equal(canManageSettings('admin'), true);
    assert.equal(canManageSettings('editor'), false);
  });

  it('requires elevated roles for write actions', () => {
    assert.equal(requireAdminRole('admin', ['super_admin', 'admin']), true);
    assert.equal(requireWriteAccess('editor'), true);
    assert.equal(requireWriteAccess('viewer'), false);
    assert.equal(requireAdminRole('viewer', ['super_admin', 'admin']), false);
  });

  it('blocks write access for viewers', () => {
    assert.equal(canWriteContent('viewer'), false);
    assert.equal(canWriteContent('editor'), true);
  });
});
