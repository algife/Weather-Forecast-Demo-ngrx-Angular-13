import * as fromRouter from '@ngrx/router-store';
import * as fromForecasts from './reducers/forecasts.reducers';
import storeKeys from './store-keys';

export interface AppState {
	[storeKeys.router]: fromRouter.RouterReducerState;
	[storeKeys.forecasts]: fromForecasts.ForecastsState;
}
