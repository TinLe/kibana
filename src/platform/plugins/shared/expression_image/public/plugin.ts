/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { CoreSetup, CoreStart, Plugin } from '@kbn/core/public';
import { ExpressionsStart, ExpressionsSetup } from '@kbn/expressions-plugin/public';
import { imageRendererFactory } from './expression_renderers';
import { imageFunction } from '../common/expression_functions';

interface SetupDeps {
  expressions: ExpressionsSetup;
}

interface StartDeps {
  expression: ExpressionsStart;
}

export type ExpressionImagePluginSetup = void;
export type ExpressionImagePluginStart = void;

export class ExpressionImagePlugin
  implements Plugin<ExpressionImagePluginSetup, ExpressionImagePluginStart, SetupDeps, StartDeps>
{
  public setup(core: CoreSetup, { expressions }: SetupDeps): ExpressionImagePluginSetup {
    core.getStartServices().then(([start]) => {
      expressions.registerFunction(imageFunction);
      expressions.registerRenderer(imageRendererFactory(start));
    });
  }

  public start(core: CoreStart): ExpressionImagePluginStart {}

  public stop() {}
}
