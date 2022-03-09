import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [HttpClientModule, CommonModule],
	exports: [HttpClientModule],
})
export class WeatherForecastSharedModule {}
