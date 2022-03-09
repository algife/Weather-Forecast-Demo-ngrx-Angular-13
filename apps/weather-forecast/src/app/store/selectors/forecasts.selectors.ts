import { createFeatureSelector } from '@ngrx/store';
import storeKeys from '../store-keys';
import { ForecastResponse } from '@bp/weather-forecast-shared';

export const getForecastsState = createFeatureSelector<ForecastResponse>(storeKeys.forecasts);
