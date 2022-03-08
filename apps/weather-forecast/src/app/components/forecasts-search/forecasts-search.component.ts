import { Component } from '@angular/core';
import { WeatherForecastApiService } from 'libs/weather-forecast/services/src/lib/weather-forecast-api.service';

@Component({
	selector: 'bp-forecasts-search',
	templateUrl: './forecasts-search.component.html',
	styleUrls: ['./forecasts-search.component.scss'],
})
export class ForecastsSearchComponent {
	public cityQuery = 'Limassol';

	constructor(private apiService: WeatherForecastApiService) {}

	searchCityForecast() {
		this.apiService.fetchCityGeoData$(this.cityQuery).subscribe(geoData => {
			console.log('City GeoData received', geoData);
			this.apiService.fetchGeoLocationForecast$(geoData).subscribe(cityForecast => {
				console.log('City Forecast received', cityForecast);
			});
		});
	}
}
