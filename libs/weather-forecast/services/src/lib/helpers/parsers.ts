import {
	CityGeoData,
	DynamicObject,
	ForecastAggregated,
	ForecastDailyPeriodReport,
	ForecastHourlyPeriodReport,
	ForecastResponse,
	RouterStateUrl,
	SearchFormFields,
} from 'libs/weather-forecast/models';
import moment from 'moment';
import _ from 'underscore';
import { WEEK_DAYS } from './constants';

export const parseURLParams = (routerStateUrl: RouterStateUrl): SearchFormFields => {
	return {
		city: routerStateUrl.queryParams.city,
		timePeriodSelected: routerStateUrl.params.timePeriodSelected,
	};
};

export const parseCityForecastResponse = (geoData: CityGeoData, cityForecast: ForecastResponse): ForecastAggregated => {
	// Parse data to match the data store model

	// ! DAILY
	// Merge all the data into just one single temperature the city for each day
	const aggregatedDaily = _parseCityForecastDaily(cityForecast.daily);

	// ! HOURLY
	// Merge all the snapshots into 8 hourly snapshots with 3 hours step each.
	const aggregatedHourly = _parseCityForecastHourly(cityForecast.hourly);

	// merge and overwrite some fields
	return { ...geoData, ...cityForecast, hourly: aggregatedHourly, daily: aggregatedDaily };
};

const _parseCityForecastHourly = (hourly: ForecastHourlyPeriodReport[]) => {
	const hourlyCols = [...Array(24 / 3).keys()].map(i => `${3 * i}:00`.padStart(5, '0'));
	const getGroupHeaderFor = (dt: number): string => {
		const ref = moment(dt * 1000)
			.startOf('hour')
			.format('HH:mm');
		const headerIndex = hourlyCols.indexOf(ref);
		const result = headerIndex > -1 ? ref : getGroupHeaderFor(dt + 60 * 60);
		return result;
	};
	const aggregatedHourly = {} as any;
	const hourlyGroups = _.groupBy(hourly, item => getGroupHeaderFor(item.dt));

	// Add temp value to the aggregated result
	Object.keys(hourlyGroups).forEach(gk => {
		aggregatedHourly[gk] = _getTimePeriodAverageTemperature(hourlyGroups[gk]);
	});

	return aggregatedHourly as DynamicObject<number>;
};

const _parseCityForecastDaily = (daily: ForecastDailyPeriodReport[]) => {
	const dailyCols = WEEK_DAYS.map(wd => wd.slice(0, 2));
	const aggregatedDaily: any = {};
	const dailyGroups = _.groupBy(daily, item => dailyCols[moment(item.dt * 1000).weekday()]);

	// Add temp value to the aggregated result
	Object.keys(dailyGroups).forEach(gk => {
		aggregatedDaily[gk] = _roundTemp(dailyGroups[gk][0].temp.day); // rounded to one decimal
	});
	return aggregatedDaily as DynamicObject<number>;
};

const _roundTemp = (temp: number) => Math.round(temp * 10) / 10;

const _getTimePeriodAverageTemperature = (group: ForecastHourlyPeriodReport[]) =>
	_roundTemp(group.reduce((acc, item) => acc + item.temp, 0) / group.length);
