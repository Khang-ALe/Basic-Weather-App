<style>
    day {
        display: grid;
        justify-items: center;
        align-content: center;
        align-items: center;

        max-inline-size: 80%;
    }

    img {
        width: 100%;
    }
</style>

<script lang="ts">
    import type { ForecastDay } from "./weather-model";

    export let day: ForecastDay;
    let dayName: string;

    switch (day.name) {
    case "Sunday":
        dayName = "SUN";
        break;
    case "Monday":
        dayName = "MON";
        break;
    case "Tuesday":
        dayName = "TUES";
        break;
    case "Wednesday":
        dayName = "WED";
        break;
    case "Thursday":
        dayName = "THURS";
        break;
    case "Friday":
        dayName = "FRI";
        break;
    case "Saturday":
        dayName = "SAT";
        break;
    default:
        dayName = "ERROR";
    }

</script>

<day>
    <h2>{day.temperature}°F</h2>
    <img alt="weather icon" src={day.icon}>
    <h2>{dayName}</h2>
</day>