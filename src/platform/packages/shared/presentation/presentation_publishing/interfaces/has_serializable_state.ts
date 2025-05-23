/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { Reference } from '@kbn/content-management-utils';

/**
 * A package containing the serialized Embeddable state, with references extracted. When saving Embeddables using any
 * strategy, this is the format that should be used.
 */
export interface SerializedPanelState<RawStateType extends object = object> {
  references?: Reference[];
  rawState: RawStateType;
}

export interface HasSerializableState<State extends object = object> {
  /**
   * Serializes all state into a format that can be saved into
   * some external store. The opposite of `deserialize` in the {@link ReactEmbeddableFactory}
   */
  serializeState: () => SerializedPanelState<State>;
}

export const apiHasSerializableState = (api: unknown | null): api is HasSerializableState => {
  return Boolean((api as HasSerializableState)?.serializeState);
};
