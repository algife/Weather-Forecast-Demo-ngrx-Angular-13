# Weather forecast using ngRx in Angular 13

> This app displays city forecasts and has been built in Angular 13 making use of ngRx Redux-like State Management, Route Store, Effects, Reducers, Actions ...

## Pre-requisites

-   You will need Node.js, npm and yarn installed globally as well as [Nx](https://nx.dev/getting-started/nx-setup#install-nx)
-   Run `yarn` and `npm install` in your command line

## Run Development Server

-   Run `npm start` in your command line

## Build

-   Run `npm run build` in your command line

## Dependency Graph

-   Run `nx dep-graph` in your command line

## Description

Using the free open weather map two API endpoints (the key is on the weather service)
https://openweathermap.org/api/one-call-api
https://openweathermap.org/api/geocoding-api

-   Built using NgRx
-   The app allows to search the weather forecast hourly or daily for a city.
-   The UI has a search box and two filter options, `hourly` and `daily`, and a table.
-   When a new city is searched, we get its coordinates using `http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid={API key}` and then we make a call to get the daily and hourly data for that city. The call just for the hourly mode is `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=current,minutely,daily,alerts&appid={API key}`, and for the daily mode `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=current,minutely,hourly,alerts&appid={API key}`. Once the data is retrieved we added to the table
-   When no city is found, we display a message
-   The city table has a column `City Name`, and the rest are temperature columns. In the case of hourly mode, 8 columns with 3-hour step and in the case of daily mode 7 days.
-   Switching between hourly and daily modes does not necessarily triggers new requests If the data has been retrieved
-   The URL it is updated according to the search query and mode. That is two parameters on the URL.
-   SOLID, DRY and designed to be maintainable.
-   Tests not included
-   Using repository formatting

#### Hourly Cities Mode

| City Name | 03:00 | 06:00 | 09:00 | 12:00 | 15:00 | 18:00 | 21:00 | 24:00 |
| --------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| New York  | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   |
| London    | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   |
| Limassol  | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   | 15°   |

#### Daily Cities Mode

| City Name | Mo  | Tu  | We  | Th  | Fr  | Sa  | Su  |
| --------- | --- | --- | --- | --- | --- | --- | --- |
| New York  | 15° | 15° | 15° | 15° | 15° | 15° | 15° |
| London    | 15° | 15° | 15° | 15° | 15° | 15° | 15° |
| Limassol  | 15° | 15° | 15° | 15° | 15° | 15° | 15° |

#### This project was generated using [Nx](https://nx.dev)
