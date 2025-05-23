/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { IScopedClusterClient } from '@kbn/core/server';

import {
  Connector,
  CONNECTORS_INDEX,
  MANAGED_CONNECTOR_INDEX_PREFIX,
} from '@kbn/search-connectors';

import { createIndex } from '../indices/create_index';
import { indexOrAliasExists } from '../indices/exists_index';
import { generateApiKey } from '../indices/generate_api_key';
import { generatedIndexName } from '../indices/generate_index_name';

export const generateConfig = async (
  client: IScopedClusterClient,
  connector: Connector,
  isAgentlessEnabled: boolean
) => {
  let associatedIndex: string;

  if (connector.index_name) {
    associatedIndex = connector.index_name;
  } else {
    const indexPrefix = connector.is_native ? MANAGED_CONNECTOR_INDEX_PREFIX : ''; // managed connectors need to be prefixed with `content-`
    const connectorReference = connector.name || connector.service_type || 'my-connector'; // pass a default name to generate a readable index name rather than gibberish

    associatedIndex = await generatedIndexName(client, indexPrefix + connectorReference);
  }

  if (!indexOrAliasExists(client, associatedIndex)) {
    await createIndex(client, associatedIndex, connector.language, true);
  }

  await client.asCurrentUser.transport.request({
    body: {
      index_name: associatedIndex,
    },
    method: 'PUT',
    path: `/_connector/${connector.id}/_index_name`,
  });

  await client.asCurrentUser.indices.refresh({ index: CONNECTORS_INDEX });
  const apiKeyResponse = await generateApiKey(
    client,
    associatedIndex,
    connector.is_native,
    isAgentlessEnabled
  );

  return {
    apiKeyResponse,
    associatedIndex,
  };
};
