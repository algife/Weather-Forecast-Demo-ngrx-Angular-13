import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateUrl } from '@bp/weather-forecast-shared';

export class SimpleRouterSerializer implements RouterStateSerializer<RouterStateUrl> {
	serialize(routerState: RouterStateSnapshot): RouterStateUrl {
		let route = routerState.root;
		while (route.firstChild) route = route.firstChild;

		const {
			url,
			root: { queryParams },
		} = routerState;
		const { params } = route;

		// Only return an object including the URL, params and query params
		// instead of the entire snapshot
		return { url, params, queryParams };
	}
}
