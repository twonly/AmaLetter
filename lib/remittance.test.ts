import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  normalizeRemittanceAmount,
  packRemittanceSignature,
  unpackRemittanceSignature,
} from './remittance.ts';

test('normalizes remittance amount with a default of 50 Hong Kong dollars', () => {
  assert.equal(normalizeRemittanceAmount(undefined), 50);
  assert.equal(normalizeRemittanceAmount(''), 50);
  assert.equal(normalizeRemittanceAmount('120'), 120);
  assert.equal(normalizeRemittanceAmount('0'), 50);
  assert.equal(normalizeRemittanceAmount('-8'), 50);
  assert.equal(normalizeRemittanceAmount('10000'), 9999);
});

test('packs remittance metadata into signature and strips it when reading', () => {
  const packed = packRemittanceSignature('夫 木生', 88);
  const unpacked = unpackRemittanceSignature(packed);

  assert.equal(unpacked.signature, '夫 木生');
  assert.equal(unpacked.remittanceAmount, 88);
});

test('keeps old signatures without remittance metadata unchanged', () => {
  assert.deepEqual(unpackRemittanceSignature('儿 阿正'), {
    signature: '儿 阿正',
    remittanceAmount: null,
  });
});
