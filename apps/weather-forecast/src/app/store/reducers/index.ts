import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../app.state';
import storeKeys from '../store-keys';
import * as fromForecasts from './forecasts.reducers';

export const appReducers: ActionReducerMap<AppState> = {
	[storeKeys.router]: routerReducer,
	[storeKeys.forecasts]: fromForecasts.featureReducer,
};
