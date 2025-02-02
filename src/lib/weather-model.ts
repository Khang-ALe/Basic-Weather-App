import { getCurrentWeather, getForecast } from "./api-call.ts";

const locale = "en-US";
const dateOptions: Intl.DateTimeFormatOptions = { timeStyle: "short" };

function celciusToFahrenheit(value: number) {
    return (value * 1.8) + 32;
}

function metersToMiles(value: number) {
    return value * 0.0006213712;
}

function getCurrentDate() {
    return new Date(Date.now());
}


export class CurrentWeather {
    date: Date;
    description: string;
    temperature: number; // in fahrenheit
    icon: string; // URL to an image
    dewpoint: number; // in fahrenheit
    relativeHumidity: number; //a percentage
    visibility: number; // in miles

    constructor() {
        this.date = new Date();
        this.description = "";
        this.temperature = -1;
        this.icon = ""
        this.dewpoint = -1;
        this.relativeHumidity = -1
        this.visibility = -1;
        // this.update();
    }

    async update() {
        const weatherData = await getCurrentWeather();
        // console.log("Weather Data: ", weatherData)
        this.date = new Date(Date.parse(weatherData.timestamp));
        this.description = weatherData.textDescription;
        this.temperature = celciusToFahrenheit(weatherData.temperature.value);
        this.icon = weatherData.icon;
        this.dewpoint = celciusToFahrenheit(weatherData.dewpoint.value);
        this.relativeHumidity = weatherData.relativeHumidity.value;
        this.visibility = metersToMiles(weatherData.visibility.value);
    }

    getLastUpdateTime() {
        return this.date.toLocaleTimeString(locale, dateOptions);
    }

    getCurrentTime() {
        return getCurrentDate().toLocaleString(locale, dateOptions);;
    }
}

export class ForecastDay {
    name: string;
    temperature: number; //in fahrenheit
    icon: string; //URL to an image
    
    constructor(day: string, temperature: number, icon: string) {
        this.name = day;
        this.temperature = temperature;
        this.icon = icon;
    }
}

export class Forecast {
    data: Map<string, ForecastDay>;
    lastUpdateTime: Date;
    
    constructor() {
        this.data = new Map();
        this.lastUpdateTime = new Date();
        // this.update();
    }

    async update() {
        await getForecast()
            .then((apiData) => {
                this.lastUpdateTime = new Date(Date.parse(apiData.updateTime));
                
                // Adds data from API to the forecast Map
                const prds = apiData.periods; // API's array of weather data for the next 8 days
                // console.log(prds);
                let n = 1; // for creating the keys as `Day ${n}`
                let j = prds[0].name=="Tonight" ? 1: 2; // for accessing the indices of the API's daytime weather data

                for(let i=j; n<7; i+=2) {
                    this.data.set(`Day ${n}`, new ForecastDay(prds[i].name, prds[i].temperature, prds[i].icon));
                    n++;
                }
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    }

    getLastUpdateTime() {
        return this.lastUpdateTime.toLocaleTimeString(locale, dateOptions);
    }
}
