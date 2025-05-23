/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../ftr_provider_context';

export default function ({ getService, getPageObjects }: FtrProviderContext) {
  const { visualize, lens } = getPageObjects(['visualize', 'lens']);
  const find = getService('find');
  const retry = getService('retry');
  const testSubjects = getService('testSubjects');

  describe('lens reference lines tests', () => {
    it('should show a disabled reference layer button if no data dimension is defined', async () => {
      await visualize.navigateToNewVisualization();
      await visualize.clickVisType('lens');

      await testSubjects.click('lnsLayerAddButton');
      await retry.waitFor('wait for layer popup to appear', async () =>
        testSubjects.exists(`lnsLayerAddButton-referenceLine`)
      );
      expect(
        await (await testSubjects.find(`lnsLayerAddButton-referenceLine`)).getAttribute('disabled')
      ).to.be('true');
    });

    it('should add a reference layer with a static value in it', async () => {
      await lens.configureDimension({
        dimension: 'lnsXY_xDimensionPanel > lns-empty-dimension',
        operation: 'date_histogram',
        field: '@timestamp',
      });

      await lens.configureDimension({
        dimension: 'lnsXY_yDimensionPanel > lns-empty-dimension',
        operation: 'average',
        field: 'bytes',
      });

      await lens.createLayer('referenceLine');

      expect((await find.allByCssSelector(`[data-test-subj^="lns-layerPanel-"]`)).length).to.eql(2);
      expect(
        await (
          await testSubjects.find('lnsXY_yReferenceLineLeftPanel > lns-dimensionTrigger')
        ).getVisibleText()
      ).to.eql('Static value: 4992.44');
    });

    it('should create a dynamic referenceLine when dragging a field to a referenceLine dimension group', async () => {
      await lens.dragFieldToDimensionTrigger(
        'bytes',
        'lnsXY_yReferenceLineLeftPanel > lns-empty-dimension'
      );

      expect(await lens.getDimensionTriggersTexts('lnsXY_yReferenceLineLeftPanel')).to.eql([
        'Static value: 4992.44',
        'Median of bytes',
      ]);
    });

    it('should add a new group to the reference layer when a right axis is enabled', async () => {
      await lens.configureDimension({
        dimension: 'lnsXY_yDimensionPanel > lns-empty-dimension',
        operation: 'average',
        field: 'bytes',
        keepOpen: true,
      });

      await lens.changeAxisSide('right');

      await lens.closeDimensionEditor();

      await testSubjects.existOrFail('lnsXY_yReferenceLineRightPanel > lns-empty-dimension');
    });

    it('should carry the style when moving a reference line to another group', async () => {
      // style it enabling the fill
      await testSubjects.click('lnsXY_yReferenceLineLeftPanel > lns-dimensionTrigger');
      await testSubjects.click('lnsXY_fill_below');
      await lens.closeDimensionEditor();

      // drag and drop it to the left axis
      await lens.dragDimensionToDimension({
        from: 'lnsXY_yReferenceLineLeftPanel > lns-dimensionTrigger',
        to: 'lnsXY_yReferenceLineRightPanel > lns-empty-dimension',
      });

      await testSubjects.click('lnsXY_yReferenceLineRightPanel > lns-dimensionTrigger');
      expect(
        await find.existsByCssSelector(
          '[data-test-subj="lnsXY_fill_below"][class*="euiButtonGroupButton-isSelected"]'
        )
      ).to.be(true);

      await lens.closeDimensionEditor();
    });

    it('should duplicate also the original style when duplicating a reference line', async () => {
      // drag and drop to the empty field to generate a duplicate
      await lens.dragDimensionToDimension({
        from: 'lnsXY_yReferenceLineRightPanel > lns-dimensionTrigger',
        to: 'lnsXY_yReferenceLineRightPanel > lns-empty-dimension',
      });

      await (
        await find.byCssSelector(
          '[data-test-subj="lnsXY_yReferenceLineRightPanel"]:nth-child(2) [data-test-subj="lns-dimensionTrigger"]'
        )
      ).click();
      expect(
        await find.existsByCssSelector(
          '[data-test-subj="lnsXY_fill_below"][class*="euiButtonGroupButton-isSelected"]'
        )
      ).to.be(true);
      await lens.closeDimensionEditor();
    });
  });
}
