/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { ItemsBadge } from '../item_badge';
import {
  ENVIRONMENT_NOT_DEFINED_VALUE,
  getEnvironmentLabel,
} from '../../../../common/environment_filter_values';

interface Props {
  environments: string[];
}

export function EnvironmentBadge({ environments = [] }: Props) {
  if (environments.length === 0) {
    environments.push(getEnvironmentLabel(ENVIRONMENT_NOT_DEFINED_VALUE));
  }
  return (
    <ItemsBadge
      items={environments}
      multipleItemsMessage={i18n.translate('xpack.apm.servicesTable.environmentCount', {
        values: { environmentCount: environments.length },
        defaultMessage: '{environmentCount, plural, one {1 environment} other {# environments}}',
      })}
    />
  );
}
