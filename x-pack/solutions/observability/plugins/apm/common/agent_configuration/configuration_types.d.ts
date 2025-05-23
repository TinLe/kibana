/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type t from 'io-ts';
import type { agentConfigurationIntakeRt } from './runtime_types/agent_configuration_intake_rt';

export type AgentConfigurationIntake = t.TypeOf<typeof agentConfigurationIntakeRt>;

export type AgentConfiguration = {
  '@timestamp': number;
  applied_by_agent?: boolean;
  etag: string;
  agent_name?: string;
} & AgentConfigurationIntake;
