export const getCurrentWeather = async function() {
// Making HTTP request for the current weather data
    let response = await fetch("https://api.weather.gov/stations/KJFK/observations/latest", 
                    {method: "GET"});
    let weather_data = await response.json();
    // console.log(`Current Weather Data: ${weather_data.properties}`);
    return weather_data.properties;
}


export const getForecast = async function() {
    return new Promise<Object>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Calling API to get point data from the Geolocation data
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const pointURL = `https://api.weather.gov/points/${latitude},${longitude}`;
                let locationResponse = await fetch(pointURL,{method: "GET"});
                let pointData = await locationResponse.json();
                // console.log("Point Data: ", pointData.properties);
        
                // Calling API with the forecast URL from the previous response
                const forecastUrl = pointData.properties.forecast;
                let forecastResponse = await fetch(forecastUrl, {method: "GET"});
                const forecastData = await forecastResponse.json();
                // console.log("Forecast Data: ", forecastData.properties);
                
                resolve(forecastData.properties);
            }, 
            (error) => { 
                reject(`Error: ${error}`) 
            }
        );
    });
    
}

