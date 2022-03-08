import { Route } from '@angular/router';
import { ForecastsSearchComponent } from '../components/forecasts-search/forecasts-search.component';

export const appRoutes: Route[] = [
	{
		path: 'forecast/:timePeriodSelected',
		component: ForecastsSearchComponent,
	},
	{ path: '**', redirectTo: 'forecast/daily' },
];
