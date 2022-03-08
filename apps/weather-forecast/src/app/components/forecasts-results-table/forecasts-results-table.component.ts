import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DynamicObject, ForecastTimePeriod, RouterStateUrl } from 'libs/weather-forecast/models';
import {
	RESULTS_TABLE_CITY_NAME_COLUMN_KEY,
	RESULTS_TABLE_DELETE_COLUMN_KEY,
} from 'libs/weather-forecast/services/src/lib/helpers/constants';
import { combineLatestWith, debounceTime, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import * as ForecastActions from '../../store/actions/forecasts.actions';
import { AppState } from '../../store/app.state';
import { ForecastsState } from '../../store/reducers/forecasts.reducers';
import storeKeys from './../../store/store-keys';

@Component({
	selector: 'bp-forecasts-results-table',
	templateUrl: './forecasts-results-table.component.html',
	styleUrls: ['./forecasts-results-table.component.scss'],
})
export class ForecastsResultsTableComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<boolean>();
	public noData = true;
	public displayedColumns: string[] = [];
	public dataSource!: MatTableDataSource<any>;
	public readonly cityNameColumnKey = RESULTS_TABLE_CITY_NAME_COLUMN_KEY;
	public readonly deleteColumnKey = RESULTS_TABLE_DELETE_COLUMN_KEY;

	get forecasts$() {
		return this.actions$.pipe(
			ofType(ForecastActions.fetchForecastSuccess),
			switchMap(() => this.store.select(storeKeys.forecasts)),
			takeUntil(this.destroy$)
		);
	}

	get params$() {
		return this.store.select(storeKeys.router).pipe(
			map(rs => rs.state as any as RouterStateUrl),
			filter(rs => rs.queryParams.city && rs.params.timePeriodSelected),
			map(routerState => ({
				city: routerState.queryParams.city,
				timePeriodSelected: routerState.params.timePeriodSelected,
			})),
			takeUntil(this.destroy$)
		);
	}

	get tableData$() {
		return this.forecasts$.pipe(
			combineLatestWith(this.params$.pipe(map(params => params.timePeriodSelected))),
			debounceTime(100)
		);
	}

	constructor(private store: Store<AppState>, private actions$: Actions) {}

	ngOnInit(): void {
		this.subscribeToTableDataChanges();
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	subscribeToTableDataChanges(): void {
		this.tableData$.subscribe(([forecasts, timePeriodSelected]) => this.setupTable(timePeriodSelected, forecasts));
	}

	setupTable(timePeriod: ForecastTimePeriod, forecasts: ForecastsState) {
		let columns: string[] = [];
		this.noData = Boolean(forecasts?.length);
		const tableData = Object.keys(forecasts).map(city => {
			const cityForecast = forecasts[city];
			const currentViewCityForecast = cityForecast[timePeriod];

			// column values
			if (columns.length === 0) columns = this.setupColumnsBy(currentViewCityForecast);

			// row values
			return {
				[this.cityNameColumnKey]: city,
				...currentViewCityForecast,
			};
		});

		if (!tableData || !tableData[0]) {
			this.displayedColumns = [];
			this.noData = true;
		} else {
			// Order alphabetically by City Name
			tableData.sort((a, b) => {
				if (a[this.cityNameColumnKey] < b[this.cityNameColumnKey]) return -1;
				if (a[this.cityNameColumnKey] > b[this.cityNameColumnKey]) return 1;
				return 0;
			});

			if (this.displayedColumns.length > 0) {
				this.dataSource = new MatTableDataSource(tableData);
				this.dataSource.data = tableData;
			}
		}
	}

	setupColumnsBy(currentViewCityForecast: DynamicObject<number>[]) {
		this.displayedColumns = [this.cityNameColumnKey, ...Object.keys(currentViewCityForecast), this.deleteColumnKey];
		return this.displayedColumns;
	}

	removeCityForecastFromTable(city: string) {
		if (confirm(`Are you sure you want to remove the city forecast for ${city}?`)) {
			console.log(`❌ Removed ${city} forecast from the table`);
			this.store.dispatch(ForecastActions.removeCityForecast({ city }));
		}
	}
}
