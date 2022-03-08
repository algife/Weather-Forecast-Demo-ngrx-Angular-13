// import { DynamicObject } from './_generics.models';

import { DynamicObject } from './_generics.models';

export const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export enum ForecastTimePeriod {
	// Include here all the list based in the API spec
	'current' = 'current',
	'minutely' = 'minutely',
	'daily' = 'daily',
	'hourly' = 'hourly',
	'alerts' = 'alerts',
}

export const allowedForecastTimePeriods = [ForecastTimePeriod.daily, ForecastTimePeriod.hourly];
export const disallowedForecastTimePeriods = Object.keys(ForecastTimePeriod).filter(tp =>
	(allowedForecastTimePeriods as string[]).includes(tp)
);

export interface CityGeoData extends DynamicObject<any> {
	name: string;
	country: string;
	state: string;
	local_names: DynamicObject<string>;
	lat?: number; // latitude
	lon?: number; // longitude
}

export interface Forecast<DT, HT> extends CityGeoData {
	daily: DT[];
	hourly: HT[];
	timezone: string;
	timezone_offset: number;
}

export interface ForecastResponse<DT = ForecastDailyPeriodReport, HT = ForecastHourlyPeriodReport>
	extends Forecast<DT, HT> {
	daily: DT[];
	hourly: HT[];
	timezone: string;
	timezone_offset: number;
	lon: number;
	lat: number;
}

export interface ForecastPeriodReport {
	cityName?: string;
	dt: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust: number;
	weather: WeatherSummary[];
	pop: number;
}

export interface ForecastDailyPeriodReport extends ForecastPeriodReport {
	sunrise: number;
	sunset: number;
	moonrise: number;
	moonset: number;
	moon_phase: number;
	temp: {
		day: number;
		min: number;
		max: number;
		night: number;
		eve: number;
		morn: number;
	};
	feels_like: {
		day: number;
		night: number;
		eve: number;
		morn: number;
	};
}

export interface ForecastHourlyPeriodReport extends ForecastPeriodReport {
	temp: number;
	feels_like: number;
	visibility: number;
}

export type ForecastPeriodReportGroup = ForecastDailyPeriodReport[] | ForecastHourlyPeriodReport[];

export interface WeatherSummary {
	id: number;
	main: string;
	description: string;
	icon: string;
}
