/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { expect } from 'expect';
import { FtrProviderContext } from '../../../ftr_provider_context';

export default function telemetryConfigTest({ getService }: FtrProviderContext) {
  const svlCommonApi = getService('svlCommonApi');
  const supertest = getService('supertest');

  describe('/api/telemetry/v2/config API Telemetry config', () => {
    const baseConfig = {
      allowChangingOptInStatus: false,
      optIn: true,
      sendUsageFrom: 'server',
      telemetryNotifyUserAboutOptInDefault: false,
      labels: {
        serverless: 'search',
      },
    };

    it('GET should get the default config', async () => {
      const { body } = await supertest
        .get('/api/telemetry/v2/config')
        .set(svlCommonApi.getCommonRequestHeader())
        .expect(200);

      expect(body).toMatchObject(baseConfig);
    });

    // coreApp.allowDynamicConfigOverrides is disabled
    it.skip('GET should get updated labels after dynamically updating them', async () => {
      const uniqueJourneyName = `my-ftr-test-${new Date().getMilliseconds()}`;
      await supertest
        .put('/internal/core/_settings')
        .set(svlCommonApi.getInternalRequestHeader())
        .set('elastic-api-version', '1')
        .send({ 'telemetry.labels.journeyName': uniqueJourneyName })
        .expect(200, { ok: true });

      const { body } = await supertest
        .get('/api/telemetry/v2/config')
        .set(svlCommonApi.getCommonRequestHeader())
        .expect(200);
      expect(body).toMatchObject({
        ...baseConfig,
        labels: {
          ...baseConfig.labels,
          journeyName: uniqueJourneyName,
        },
      });
    });
  });
}
