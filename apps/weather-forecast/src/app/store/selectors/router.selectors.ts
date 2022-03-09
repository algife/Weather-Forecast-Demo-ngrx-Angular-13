import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { RouterStateUrl } from '@bp/weather-forecast-shared';

import storeKeys from '../store-keys';

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>(storeKeys.router);
