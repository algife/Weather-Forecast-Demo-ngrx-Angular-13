import { createFeatureSelector } from '@ngrx/store';
import storeKeys from '../store-keys';
import { ForecastResponse } from 'libs/weather-forecast/models';

export const getForecastsState = createFeatureSelector<ForecastResponse>(storeKeys.forecasts);
