<!--Ionic Docs: https://ionicframework.com/docs/api-->

<style>
  content {
    display: grid;
    gap: 1fr;
    grid-template-areas:
        "mainInfo extraInfo"
        "forecast forecast"
        "misc misc"
    ;
    justify-items: center;
    justify-content: center;

    font-family:'Segoe UI';
    background-color: bisque;
  }

  mainInfo {
    grid-area: mainInfo;
    display: grid;
    grid-template-columns: 2fr 2fr;
    grid-template:
        "icon    temperature"
        "current-weather    current-weather"
        "location    location"
    ;
    align-items: center;
    justify-items: center;

    padding: 2%;
    width: 100%;
    font-size: 125%;
  }

  extraInfo {
    grid-area: extraInfo;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "current-time     update-time"
      "dewpoint     humidity"
      "visibility     ."
    ;

    padding: 2%;
  }

  forecast {
    grid-area: forecast;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 0.5fr, 1fr;
    /* grid-template-areas:
      "forecast-time . . . . ."
      "day day day day day day" 
    ; */

    padding-left: 1.5%;
    padding-right: 1.5%;
    width: 100%;

    background-color: lightblue;
  }

  forecast-time {
    grid-area: "forecast-time";
    grid-column: 1 / span 6;
  }

  misc {
    grid-area: misc;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
      "subtext button"
    ;
    align-items: center;
    justify-items: center;

    min-height: 25%;
  }

  subtext {
    grid-area: "subtext";
    text-align: center;

    padding: 5%;
  }

  button {
    min-width: 60%;
    min-height: 60%;

    background-color: grey;
    color: black;
    font-size: medium;
  }

  img {
    min-width: 150%;
  }
</style>

<script lang="ts">
  import { CurrentWeather, Forecast} from "$lib/weather-model.ts";
  import DayView from "$lib/day_view.svelte";

  const weather = new CurrentWeather();
  const forecast = new Forecast();
  const partlyCloudyIcon = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.JK1309d5PThOToLhxDVGkwAAAA%26pid%3DApi&f=1&ipt=67122b5eb58e8b5455f4612fa3588e6ad883c812e7b79046c39c9c064e831abb&ipo=images";


  async function weatherUpdate() {
    await weather.update();
    // console.log("Weather Data: ", weather);
  }

  async function forecastUpdate() {
    await forecast.update();
    console.log("Forecast Data: ", forecast.data);
  }

  const reload = () => { location.reload() };

</script>

<content class="content">
  {#await weatherUpdate()}
    <h1>Weather Data is Loading...</h1>
  {:then success}
    <mainInfo>
      <icon><img alt="weather icon" src={weather.icon}></icon>
      <temperature><h1>{weather.temperature.toFixed()}°F</h1></temperature>
      <current-weather>{weather.description}</current-weather>
      <!-- <feelsLike>Feels Like 12°</feelsLike> -->
      <location><h3>Hempstead,<br>New York</h3></location>
    </mainInfo>

    <extraInfo>
      <current-time><b>Time Loaded:</b><br>{weather.getCurrentTime()}</current-time>
      <update-time><b>Last Weather Update:</b><br>{weather.getLastUpdateTime()}</update-time>
      <!-- <wind>Wind: 10 SE mph</wind> -->
      <dewpoint><b>Dewpoint:</b> {weather.dewpoint.toFixed()}°F</dewpoint>
      <humidity><b>Relative Humidity:</b> {weather.relativeHumidity.toFixed()}%</humidity>
      <visibility><b>Visibility:</b> {weather.visibility.toFixed(1)} miles</visibility>
      <!-- <rain>Rain: 12%</rain>
      <sunrise>Sunrise: 6:00 AM</sunrise>
      <sunset>Sunset: 5:58 PM</sunset> -->
    </extraInfo>
  {:catch error}
    <h1>Error: {error.message}</h1>
  {/await}

  <forecast>
    {#await forecastUpdate()}
      <h1>Forecast Data is Loading...</h1>
    {:then success} 
      <forecast-time><b>Last Forecast Update:</b> {forecast.getLastUpdateTime()}</forecast-time>
      {#each forecast.data as day}
        <DayView day={day[1]}></DayView>
      {/each}
    {:catch error}
      <h1>Error: {error.message}</h1>
    {/await}
  </forecast>

  <misc>
    <subtext>Weather data and images acquired from the <i>National Weather Service (NWS) API</i></subtext>
    <button on:click={reload}>Update Weather Data</button>
  </misc>

</content>
