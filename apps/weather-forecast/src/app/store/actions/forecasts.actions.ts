import { createAction, props } from '@ngrx/store';
import { ForecastAggregated } from '@bp/weather-forecast-shared';

export enum ForecastsActionKey {
	Fetch = '[Forecasts] Load',
	FetchSuccess = '[Forecasts] Load Success',
	FetchFailure = '[Forecasts] Load Failure',
	FetchCityNotFound = '[Forecasts] City Not Found',
	SearchInvalidParams = '[Forecast Invalid Params] Invalid Params',
	Search = '[Forecasts] Search',
	RemoveCityForecast = '[Forecasts] Remove City Forecast Result From Table',
}

export const fetchForecast = createAction(ForecastsActionKey.Fetch, props<{ city: string }>());
export const removeCityForecast = createAction(ForecastsActionKey.RemoveCityForecast, props<{ city: string }>());
export const fetchForecastSuccess = createAction(
	ForecastsActionKey.FetchSuccess,
	props<{ data: ForecastAggregated }>()
);
export const fetchForecastFailure = createAction(ForecastsActionKey.FetchFailure, props<{ error: Error }>());
export const fetchForecastCityNotFound = createAction(ForecastsActionKey.FetchCityNotFound);
export const searchForecastCityInvalidParams = createAction(
	ForecastsActionKey.SearchInvalidParams,
	props<{ timePeriodSelected: string; city: string }>()
);
