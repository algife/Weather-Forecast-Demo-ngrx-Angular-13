import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CityGeoData, disallowedForecastTimePeriods, ForecastResponse } from 'libs/weather-forecast/models';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	private readonly _apiKey = '010721642521f31b0fbc8c3831d45951';
	private readonly _apiBaseDomain = `https://api.openweathermap.org`;
	private readonly _weatherApiGeoBaseUrl = `${this._apiBaseDomain}/geo/1.0/direct`;
	private readonly _weatherApiForecastBaseUrl = `${this._apiBaseDomain}/data/2.5/onecall`;

	disallowedForecastTimePeriods = disallowedForecastTimePeriods;

	constructor(private http: HttpClient) {}

	public fetchCityGeoData$(cityName: string) {
		return (
			this.http
				.get<CityGeoData[]>(this._weatherApiGeoBaseUrl, {
				params: new HttpParams()
				// URL QUERY PARAMS
					.set('appId', this._apiKey)
					.set('q', cityName)
					.set('limit', 1),
			})
				// response is an array with just one element (because is limited to 1)
				.pipe(map(([cityGeoData]) => cityGeoData))
		);
	}

	public fetchGeoLocationForecast$(geoData: CityGeoData) {
		return this.http.get<ForecastResponse>(this._weatherApiForecastBaseUrl, {
			params: new HttpParams()
				// URL QUERY PARAMS
				.set('appId', this._apiKey)
				.set('lat', geoData.lat ?? '')
				.set('lon', geoData.lon ?? '')
				.set('exclude', this.disallowedForecastTimePeriods.join(',')),
		});
	}
}
