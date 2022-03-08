import { ForecastTimePeriod } from 'libs/weather-forecast/models';

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ALLOWED_FORECAST_TIME_PERIODS: string[] = [ForecastTimePeriod.daily, ForecastTimePeriod.hourly];

export const DISALLOWED_FORECAST_TIME_PERIODS: string[] = Object.keys(ForecastTimePeriod).filter(
	m => !ALLOWED_FORECAST_TIME_PERIODS.includes(m as any)
);
