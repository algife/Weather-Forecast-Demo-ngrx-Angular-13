import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { RouterStateUrl } from 'libs/weather-forecast/models';

import storeKeys from '../store-keys';

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>(storeKeys.router);
