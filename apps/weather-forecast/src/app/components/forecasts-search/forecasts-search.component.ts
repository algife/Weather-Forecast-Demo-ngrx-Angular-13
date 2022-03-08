import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { SearchFormFields, RouterStateUrl } from 'libs/weather-forecast/models';
import { ALLOWED_FORECAST_TIME_PERIODS } from 'libs/weather-forecast/services/src/lib/helpers/constants';
import { parseURLParams } from 'libs/weather-forecast/services/src/lib/helpers/parsers';
import { debounceTime, filter, map, merge, Observable, Subject, takeUntil, tap } from 'rxjs';
import * as ForecastsActions from '../../store/actions/forecasts.actions';
import { AppState } from '../../store/app.state';
import storeKeys from '../../store/store-keys';

@Component({
	selector: 'bp-forecasts-search',
	templateUrl: './forecasts-search.component.html',
	styleUrls: ['./forecasts-search.component.scss'],
})
export class ForecastsSearchComponent implements OnDestroy, AfterViewInit {
	public readonly destroy$ = new Subject<boolean>();
	public showCityNotFoundError!: boolean;
	public forecastSearchForm: FormGroup = this.fb.group({
		city: ['', [Validators.required, Validators.minLength(3)]],
		timePeriodSelected: ['', []],
	});
	public readonly allowedForecastTimePeriods = ALLOWED_FORECAST_TIME_PERIODS; // used in the template

	// OBSERVABLES
	// ------------
	get formChanges$(): Observable<SearchFormFields> {
		return this.forecastSearchForm.valueChanges.pipe(
			tap(() => this.setDefaultUIFlags()), // reset flag for the UI
			debounceTime(400), // adds a threshold time for user input without triggering the search
			filter(formValue => formValue && formValue.city !== ''),
			takeUntil(this.destroy$) // unsubscribe on component OnDestroy life-hook event
		);
	}

	get params$() {
		return this.store.select(storeKeys.router).pipe(
			map(rs => rs.state as any as RouterStateUrl),
			filter(rs => rs.queryParams.city && rs.params.timePeriodSelected),
			map(parseURLParams),
			takeUntil(this.destroy$)
		);
	}

	get loadForecastSuccess$() {
		return this.actions$.pipe(ofType(ForecastsActions.fetchForecastSuccess), takeUntil(this.destroy$));
	}

	get loadForecastFailure$() {
		return this.actions$.pipe(ofType(ForecastsActions.fetchForecastFailure), takeUntil(this.destroy$));
	}

	get loadForecastNotFound$() {
		return this.actions$.pipe(ofType(ForecastsActions.fetchForecastCityNotFound), takeUntil(this.destroy$));
	}

	get forecastRemoved$() {
		return this.actions$.pipe(ofType(ForecastsActions.removeCityForecast), takeUntil(this.destroy$));
	}

	get loadResultAction$() {
		return merge(
			this.loadForecastSuccess$,
			this.loadForecastFailure$,
			this.loadForecastNotFound$,
			this.forecastRemoved$
		).pipe(takeUntil(this.destroy$));
	}
	// end of observables

	constructor(
		private router: Router,
		private store: Store<AppState>,
		private actions$: ActionsSubject,
		private fb: FormBuilder
	) {
		this.setDefaultUIFlags();
	}

	ngAfterViewInit(): void {
		this.initSubscriptions();
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	// Initialize the observables
	initSubscriptions(): void {
		this.subscribeToStoreActions();
		this.subscribeToFormChanges();
	}

	subscribeToFormChanges(): void {
		this.formChanges$.subscribe((formValue: SearchFormFields) => {
			const url = `/forecast/${formValue.timePeriodSelected}?city=${formValue.city}`;
			this.router.navigateByUrl(url);
		});
	}

	subscribeToStoreActions(): void {
		this.params$.subscribe(({ city, timePeriodSelected }) => {
			// Setup default values for the form based in URL params (it does not emits form change event)
			this.forecastSearchForm.patchValue({
				city: city ?? '',
				timePeriodSelected: timePeriodSelected ?? '',
			} as SearchFormFields);
		});

		this.loadResultAction$.subscribe(loadAction => {
			// Set CITY NOT FOUND ERROR UI FLAG
			this.showCityNotFoundError = loadAction.type === ForecastsActions.ForecastsActionKey.FetchCityNotFound;
		});
	}

	setDefaultUIFlags(): void {
		this.showCityNotFoundError = false;
	}
}
