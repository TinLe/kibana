/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback, useMemo, useState } from 'react';
import type {
  DurationRange,
  OnRefreshChangeProps,
} from '@elastic/eui/src/components/date_picker/types';
import { useDataUsageMetricsUrlParams } from './use_charts_url_params';
import { DateRangePickerValues } from '../components/filters/date_picker';
import { DEFAULT_DATE_RANGE_OPTIONS, isDateRangeValid } from '../../../common/utils';

export const useDateRangePicker = () => {
  const {
    setUrlDateRangeFilter,
    startDate: startDateFromUrl,
    endDate: endDateFromUrl,
  } = useDataUsageMetricsUrlParams();
  const [dateRangePickerState, setDateRangePickerState] = useState<DateRangePickerValues>({
    ...DEFAULT_DATE_RANGE_OPTIONS,
    startDate: startDateFromUrl ?? DEFAULT_DATE_RANGE_OPTIONS.startDate,
    endDate: endDateFromUrl ?? DEFAULT_DATE_RANGE_OPTIONS.endDate,
  });

  const updateUsageMetricsDateRanges = useCallback(
    ({ start, end }: DurationRange) => {
      setDateRangePickerState((prevState) => ({
        ...prevState,
        startDate: start,
        endDate: end,
      }));
    },
    [setDateRangePickerState]
  );

  const updateUsageMetricsRecentlyUsedDateRanges = useCallback(
    (recentlyUsedDateRanges: DateRangePickerValues['recentlyUsedDateRanges']) => {
      setDateRangePickerState((prevState) => ({
        ...prevState,
        recentlyUsedDateRanges,
      }));
    },
    [setDateRangePickerState]
  );

  // handle refresh timer update
  const onRefreshChange = useCallback(
    (evt: OnRefreshChangeProps) => {
      setDateRangePickerState((prevState) => ({
        ...prevState,
        autoRefreshOptions: { enabled: !evt.isPaused, duration: evt.refreshInterval },
      }));
    },
    [setDateRangePickerState]
  );

  // handle manual time change on date picker
  const onTimeChange = useCallback(
    ({ start: newStart, end: newEnd }: DurationRange) => {
      // update date ranges
      updateUsageMetricsDateRanges({ start: newStart, end: newEnd });

      // update recently used date ranges
      const newRecentlyUsedDateRanges = [
        { start: newStart, end: newEnd },
        ...dateRangePickerState.recentlyUsedDateRanges
          .filter(
            (recentlyUsedRange: DurationRange) =>
              !(recentlyUsedRange.start === newStart && recentlyUsedRange.end === newEnd)
          )
          .slice(0, 9),
      ];
      updateUsageMetricsRecentlyUsedDateRanges(newRecentlyUsedDateRanges);
      setUrlDateRangeFilter({ startDate: newStart, endDate: newEnd });
    },
    [
      dateRangePickerState.recentlyUsedDateRanges,
      setUrlDateRangeFilter,
      updateUsageMetricsDateRanges,
      updateUsageMetricsRecentlyUsedDateRanges,
    ]
  );

  const isValidDateRange = useMemo(
    () =>
      isDateRangeValid({
        start: dateRangePickerState.startDate,
        end: dateRangePickerState.endDate,
      }),
    [dateRangePickerState.endDate, dateRangePickerState.startDate]
  );

  return { dateRangePickerState, isValidDateRange, onRefreshChange, onTimeChange };
};
