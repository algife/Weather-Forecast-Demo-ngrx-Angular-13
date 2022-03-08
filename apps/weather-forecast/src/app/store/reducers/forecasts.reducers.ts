import { createReducer, on } from '@ngrx/store';
import { DynamicObject, ForecastAggregated } from 'libs/weather-forecast/models';
import * as ForecastsActions from '../actions/forecasts.actions';

export type ForecastsState = DynamicObject<ForecastAggregated>;

export const initialState: ForecastsState = {};

export const featureReducer = createReducer(
	initialState,
	on(ForecastsActions.removeCityForecast, (state, action) => {
		const payload = action.city;
		const key = parseCityForecastName(payload);
		const newState = { ...state };
		delete newState[key];
		return newState;
	}),
	on(ForecastsActions.fetchForecast, state => state),
	on(ForecastsActions.fetchForecastSuccess, (state, action) => {
		const payload = action.data;
		const key = parseCityForecastName(payload.name);
		return { ...state, [key]: payload };
	}),
	on(ForecastsActions.fetchForecastFailure, (state, action) => {
		console.log('fetchForecastFailure', { state, action });
		return state;
	})
);

export const parseCityForecastName = (cityName: string) => cityName.toLowerCase();
