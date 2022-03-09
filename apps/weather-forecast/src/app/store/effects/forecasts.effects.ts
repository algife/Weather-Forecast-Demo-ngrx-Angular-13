import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import {
	ALLOWED_FORECAST_TIME_PERIODS,
	CityGeoData,
	DEFAULT_CITY,
	DEFAULT_TIME_PERIOD_SELECTED,
	RouterStateUrl,
} from '@bp/weather-forecast-shared';
import { WeatherForecastApiService } from '@bp/weather-forecast-shared';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as ForecastsActions from '../actions/forecasts.actions';
import { AppState } from '../app.state';
import * as fromForecasts from '../reducers/forecasts.reducers';
import storeKeys from '../store-keys';

@Injectable()
export class ForecastsEffects {
	citySearch$ = createEffect(() =>
		this.actions$.pipe(
			ofType(routerNavigatedAction), // successful navigation
			map(action => action.payload.routerState as any as RouterStateUrl),
			switchMap(async state => {
				const timePeriodSelected =
					ALLOWED_FORECAST_TIME_PERIODS.find((item: string) => item === state.params.timePeriodSelected) ||
					'';
				const city = (state.queryParams.city || '') as string;

				// INVALID PARAMS
				if (!timePeriodSelected || !city) {
					// Redirect setting default values to the invalid params but preserve the valid ones
					const url = `/forecast/${timePeriodSelected || DEFAULT_TIME_PERIOD_SELECTED}?city=${
						city || DEFAULT_CITY
					}`;
					console.error(`Invalid URL Params for forecast route. Redirecting with default values to ${url}`);
					this.router.navigateByUrl(url);
				}

				// If a city is sent as URL Query params, dispatch action to fetch data
				return ForecastsActions.fetchForecast({ city });
			}),
			catchError(error => of(ForecastsActions.fetchForecastFailure({ error })))
		)
	);

	fetchForecast$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(ForecastsActions.fetchForecast),
			withLatestFrom(this.store.select(storeKeys.forecasts)),
			switchMap(([action, state]) => {
				const { city } = action;

				// FETCH FROM STORE IF THE DATA ALREADY HAS BEEN FETCHED PRIORLY
				const cityKey = fromForecasts.parseCityForecastName(action.city);
				const cityForecastStored = state[cityKey];
				if (cityForecastStored) return of(ForecastsActions.fetchForecastSuccess({ data: cityForecastStored }));

				// FETCH FROM API otherwise
				return this.weatherForecastApiService.fetchCityGeoData$(city).pipe(
					switchMap((cityGeoData: CityGeoData) => {
						// City not found?
						// return an observable with an action that will be auto-dispatched
						if (!cityGeoData) return of(ForecastsActions.fetchForecastCityNotFound());

						// City found, get forecast
						return this.weatherForecastApiService.fetchGeoLocationForecast$(cityGeoData).pipe(
							// map to the action that will be auto-dispatched
							map(forecastAggr => ForecastsActions.fetchForecastSuccess({ data: forecastAggr }))
						);
					})
				);
			}),
			catchError(error => of(ForecastsActions.fetchForecastFailure({ error })))
		);
	});

	constructor(
		private actions$: Actions,
		private router: Router,
		private store: Store<AppState>,
		private weatherForecastApiService: WeatherForecastApiService
	) {}
}
