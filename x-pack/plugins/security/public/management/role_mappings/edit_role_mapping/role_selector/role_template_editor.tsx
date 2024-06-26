/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiButtonEmpty,
  EuiCallOut,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiText,
} from '@elastic/eui';
import React, { Fragment } from 'react';

import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';

import { RoleTemplateTypeSelect } from './role_template_type_select';
import type { RoleTemplate } from '../../../../../common';
import {
  isInlineRoleTemplate,
  isInvalidRoleTemplate,
  isStoredRoleTemplate,
} from '../services/role_template_type';

interface Props {
  roleTemplate: RoleTemplate;
  canUseInlineScripts: boolean;
  canUseStoredScripts: boolean;
  onChange: (roleTemplate: RoleTemplate) => void;
  onDelete: (roleTemplate: RoleTemplate) => void;
  readOnly?: boolean;
}

export const RoleTemplateEditor = ({
  roleTemplate,
  onChange,
  onDelete,
  canUseInlineScripts,
  canUseStoredScripts,
  readOnly = false,
}: Props) => {
  return (
    <EuiFlexGroup direction="column" gutterSize="s">
      {getTemplateConfigurationFields()}
      {getEditorForTemplate()}
      <EuiFlexItem grow={false}>
        <EuiSpacer size="s" />
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            {!readOnly ? (
              <EuiButtonEmpty
                iconType="trash"
                color="danger"
                size="xs"
                onClick={() => onDelete(roleTemplate)}
                data-test-subj="deleteRoleTemplateButton"
              >
                <FormattedMessage
                  id="xpack.security.management.editRoleMapping.deleteRoleTemplateButton"
                  defaultMessage="Delete template"
                />
              </EuiButtonEmpty>
            ) : null}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  function getTemplateFormatSwitch() {
    const returnsJsonLabel = i18n.translate(
      'xpack.security.management.editRoleMapping.roleTemplateReturnsJson',
      {
        defaultMessage: 'Returns JSON',
      }
    );

    return (
      <EuiFormRow label={returnsJsonLabel}>
        <EuiSwitch
          data-test-subj="roleTemplateFormatSwitch"
          checked={roleTemplate.format === 'json'}
          label={returnsJsonLabel}
          showLabel={false}
          onChange={(e) => {
            onChange({
              ...roleTemplate,
              format: e.target.checked ? 'json' : 'string',
            });
          }}
          disabled={readOnly}
        />
      </EuiFormRow>
    );
  }

  function getTemplateConfigurationFields() {
    const templateTypeComboBox = (
      <EuiFlexItem>
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.security.management.editRoleMapping.roleTemplateType"
              defaultMessage="Template type"
            />
          }
        >
          <RoleTemplateTypeSelect
            roleTemplate={roleTemplate}
            canUseStoredScripts={canUseStoredScripts}
            canUseInlineScripts={canUseInlineScripts}
            onChange={onChange}
            readOnly={readOnly}
          />
        </EuiFormRow>
      </EuiFlexItem>
    );

    const templateFormatSwitch = <EuiFlexItem>{getTemplateFormatSwitch()}</EuiFlexItem>;

    return (
      <EuiFlexItem>
        <EuiFlexGroup justifyContent="spaceBetween">
          {templateTypeComboBox}
          {templateFormatSwitch}
        </EuiFlexGroup>
      </EuiFlexItem>
    );
  }

  function getEditorForTemplate() {
    if (isInlineRoleTemplate(roleTemplate)) {
      const extraProps: Record<string, any> = {};
      if (!canUseInlineScripts && !readOnly) {
        extraProps.isInvalid = true;
        extraProps.error = (
          <EuiText size="xs" color="danger" data-test-subj="roleMappingInlineScriptsDisabled">
            <FormattedMessage
              id="xpack.security.management.editRoleMapping.roleTemplateInlineScriptsDisabled"
              defaultMessage="Template uses inline scripts, which are disabled in Elasticsearch."
            />
          </EuiText>
        );
      }
      const example = '{{username}}_role';
      return (
        <Fragment>
          <EuiFlexItem grow={1} style={{ maxWidth: '400px' }}>
            <EuiFormRow
              label={
                <FormattedMessage
                  id="xpack.security.management.editRoleMapping.roleTemplateLabel"
                  defaultMessage="Template"
                />
              }
              helpText={
                <FormattedMessage
                  id="xpack.security.management.editRoleMapping.roleTemplateHelpText"
                  defaultMessage="Mustache templates are allowed. Example: {example}"
                  values={{
                    example,
                  }}
                />
              }
              {...extraProps}
            >
              <EuiFieldText
                data-test-subj="roleTemplateSourceEditor"
                value={roleTemplate.template.source}
                onChange={(e) => {
                  onChange({
                    ...roleTemplate,
                    template: {
                      source: e.target.value,
                    },
                  });
                }}
                disabled={readOnly}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </Fragment>
      );
    }

    if (isStoredRoleTemplate(roleTemplate)) {
      const extraProps: Record<string, any> = {};
      if (!canUseStoredScripts) {
        extraProps.isInvalid = true;
        extraProps.error = (
          <EuiText size="xs" color="danger" data-test-subj="roleMappingStoredScriptsDisabled">
            <FormattedMessage
              id="xpack.security.management.editRoleMapping.roleTemplateStoredScriptsDisabled"
              defaultMessage="Template uses stored scripts, which are disabled in Elasticsearch."
            />
          </EuiText>
        );
      }
      return (
        <Fragment>
          <EuiFlexItem grow={1} style={{ maxWidth: '400px' }}>
            <EuiFormRow
              label={
                <FormattedMessage
                  id="xpack.security.management.editRoleMapping.storedScriptLabel"
                  defaultMessage="Stored script ID"
                />
              }
              helpText={
                <FormattedMessage
                  id="xpack.security.management.editRoleMapping.storedScriptHelpText"
                  defaultMessage="ID of a previously stored Painless or Mustache script."
                />
              }
              {...extraProps}
            >
              <EuiFieldText
                data-test-subj="roleTemplateScriptIdEditor"
                value={roleTemplate.template.id}
                onChange={(e) => {
                  onChange({
                    ...roleTemplate,
                    template: {
                      id: e.target.value,
                    },
                  });
                }}
                disabled={readOnly}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </Fragment>
      );
    }

    if (isInvalidRoleTemplate(roleTemplate)) {
      return (
        <EuiFlexItem grow={1} data-test-subj="roleMappingInvalidRoleTemplate">
          <EuiCallOut
            color="warning"
            title={
              <FormattedMessage
                id="xpack.security.management.editRoleMapping.invalidRoleTemplateTitle"
                defaultMessage="Invalid role template"
              />
            }
          >
            <FormattedMessage
              id="xpack.security.management.editRoleMapping.invalidRoleTemplateMessage"
              defaultMessage="Role template is invalid, and cannot be edited here. Please delete and recreate, or fix via the Role Mapping API."
            />
          </EuiCallOut>
        </EuiFlexItem>
      );
    }

    throw new Error(`Unable to determine role template type`);
  }
};
