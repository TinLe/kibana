/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiLoadingChart, EuiPanel, EuiText } from '@elastic/eui';
import * as React from 'react';

import { euiStyled } from '@kbn/kibana-react-plugin/common';

interface LogsSharedLoadingProps {
  text: string | JSX.Element;
  height: number | string;
  width: number | string;
}

export class LogsSharedLoadingPanel extends React.PureComponent<LogsSharedLoadingProps, {}> {
  public render() {
    const { height, text, width } = this.props;
    return (
      <LogsSharedLoadingStaticPanel style={{ height, width }} role="row">
        <LogsSharedLoadingStaticContentPanel>
          <EuiPanel>
            <EuiLoadingChart size="m" />
            <EuiText>
              <p>{text}</p>
            </EuiText>
          </EuiPanel>
        </LogsSharedLoadingStaticContentPanel>
      </LogsSharedLoadingStaticPanel>
    );
  }
}

export const LogsSharedLoadingStaticPanel = euiStyled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const LogsSharedLoadingStaticContentPanel = euiStyled.div`
  flex: 0 0 auto;
  align-self: center;
  text-align: center;
`;
