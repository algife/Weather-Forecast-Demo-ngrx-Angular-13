import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ForecastsResultsTableComponent } from './components/forecasts-results-table/forecasts-results-table.component';
import { ForecastsSearchComponent } from './components/forecasts-search/forecasts-search.component';
import { SimpleRouterSerializer } from './routes/simple-router-serializer';
import { appEffects } from './store/effects';
import { appReducers } from './store/reducers';
import { appRoutes } from './routes';

@NgModule({
	declarations: [AppComponent, ForecastsSearchComponent, ForecastsResultsTableComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,

		// ! Routes
		RouterModule.forRoot(appRoutes),

		// ! NgRx
		EffectsModule.forRoot(appEffects),
		StoreModule.forRoot(appReducers /*, { metaReducers }*/),
		StoreRouterConnectingModule.forRoot({ serializer: SimpleRouterSerializer }),
		StoreDevtoolsModule.instrument({
			maxAge: 25,
			logOnly: environment.production,
			autoPause: true, // Pauses recording actions and state changes when the extension window is not open
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
