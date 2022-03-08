import { createAction, props } from '@ngrx/store';
import { ForecastAggregated } from 'libs/weather-forecast/models';

export enum ForecastsActionKey {
	Fetch = '[Forecast Fetch] Load',
	FetchSuccess = '[Forecast Fetch] Load Success',
	FetchFailure = '[Forecast Fetch] Load Failure',
	FetchCityNotFound = '[Forecast Fetch] City Not Found',
	SearchInvalidParams = '[Forecast Search Invalid Params] Invalid Params',
	Search = '[Forecast Search] Search',
}

export const fetchForecast = createAction(ForecastsActionKey.Fetch, props<{ city: string }>());
export const fetchForecastSuccess = createAction(
	ForecastsActionKey.FetchSuccess,
	props<{ data: ForecastAggregated }>()
);
export const fetchForecastFailure = createAction(ForecastsActionKey.FetchFailure, props<{ error: any }>());
export const fetchForecastCityNotFound = createAction(ForecastsActionKey.FetchCityNotFound);
export const searchForecastCityInvalidParams = createAction(
	ForecastsActionKey.SearchInvalidParams,
	props<{ timePeriodSelected: string; city: string }>()
);
