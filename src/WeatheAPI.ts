

const WEATHR_API_KEY = "6793731f5b5aa354c422acd15a89e2a1";

async function getWeather(city: string) {
    WEATHR_API_KEY
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHR_API_KEY}&units=metric`);
    const data = await response.json();
    return data.main.temp;
}

console.log(await getWeather("The Colony"));
