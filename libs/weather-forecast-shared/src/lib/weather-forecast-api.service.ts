import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CityGeoData, ForecastResponse } from './models';
import { map } from 'rxjs';
import { DISALLOWED_FORECAST_TIME_PERIODS, OPEN_WEATHER_API_KEY } from './constants';
import { parseCityForecastResponse } from './parsers';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	private readonly _apiKey = OPEN_WEATHER_API_KEY;
	private readonly _apiBaseDomain = `https://api.openweathermap.org`;
	private readonly _weatherApiGeoBaseUrl = `${this._apiBaseDomain}/geo/1.0/direct`;
	private readonly _weatherApiForecastBaseUrl = `${this._apiBaseDomain}/data/2.5/onecall`;

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
				// response is an array with just one element
				.pipe(map(([cityGeoData]) => cityGeoData))
		);
	}

	public fetchGeoLocationForecast$(geoData: CityGeoData) {
		if (!geoData.lat || !geoData.lon) throw new Error('Invalid params at fetchGeoLocationForecast');

		return this.http
			.get<ForecastResponse>(this._weatherApiForecastBaseUrl, {
			params: new HttpParams()
			// URL QUERY PARAMS
				.set('appId', this._apiKey)
				.set('lat', geoData.lat)
				.set('lon', geoData.lon)
				.set('units', 'metric') // it returns celsius
				.set('exclude', DISALLOWED_FORECAST_TIME_PERIODS.join(',')),
		})
			.pipe(map(forecastResponse => parseCityForecastResponse(geoData, forecastResponse)));
	}
}
