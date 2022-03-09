import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { appRoutes } from './routes';
import { SimpleRouterSerializer } from './routes/simple-router-serializer';
import { appEffects } from './store/effects';
import { appReducers } from './store/reducers';

@NgModule({
	declarations: [AppComponent, ForecastsSearchComponent, ForecastsResultsTableComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,

		// ! Material Modules
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatButtonToggleModule,
		MatButtonModule,
		MatPaginatorModule,
		MatSortModule,
		MatTableModule,
		MatCardModule,
		MatMenuModule,
		MatToolbarModule,

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
