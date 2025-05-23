/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { pipe } from 'fp-ts/pipeable';
import { left } from 'fp-ts/Either';
import { foldLeftRight, getPaths } from '@kbn/securitysolution-io-ts-utils';
import { NonEmptyStringArray } from '.';

describe('non_empty_string_array', () => {
  test('it should FAIL validation when given "null"', () => {
    const payload: NonEmptyStringArray | null = null;
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([
      'Invalid value "null" supplied to "NonEmptyStringArray"',
    ]);
    expect(message.schema).toEqual({});
  });

  test('it should FAIL validation when given "undefined"', () => {
    const payload: NonEmptyStringArray | undefined = undefined;
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([
      'Invalid value "undefined" supplied to "NonEmptyStringArray"',
    ]);
    expect(message.schema).toEqual({});
  });

  test('it should FAIL validation of single value of an empty string ""', () => {
    const payload: NonEmptyStringArray = '';
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([
      'Invalid value "" supplied to "NonEmptyStringArray"',
    ]);
    expect(message.schema).toEqual({});
  });

  test('it should validate a single value of "a" into an array of size 1 of ["a"]', () => {
    const payload: NonEmptyStringArray = 'a';
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(['a']);
  });

  test('it should validate 2 values of "a,b" into an array of size 2 of ["a", "b"]', () => {
    const payload: NonEmptyStringArray = 'a,b';
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(['a', 'b']);
  });

  test('it should validate 3 values of "a,b,c" into an array of size 3 of ["a", "b", "c"]', () => {
    const payload: NonEmptyStringArray = 'a,b,c';
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(['a', 'b', 'c']);
  });

  test('it should FAIL validation of number', () => {
    const payload: number = 5;
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([
      'Invalid value "5" supplied to "NonEmptyStringArray"',
    ]);
    expect(message.schema).toEqual({});
  });

  test('it should validate 3 values of "   a,   b,    c  " into an array of size 3 of ["a", "b", "c"] even though they have spaces', () => {
    const payload: NonEmptyStringArray = '   a,   b,    c  ';
    const decoded = NonEmptyStringArray.decode(payload);
    const message = pipe(decoded, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(['a', 'b', 'c']);
  });
});
