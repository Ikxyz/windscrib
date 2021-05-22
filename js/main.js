console.log("WindScrib v1.0.2");

const API_KEY = "e33607657d15ab134399ef40a1c43892";

getUserGeoLocation().then(getWeatherInfoByGeoLocation).catch(alert);

getEle("getMyWeatherReport").addEventListener("click", async () => {
  await getWeatherInfoByGeoLocation(await getUserGeoLocation());
});

getEle("getLocationWeatherReport").addEventListener("click", () => {
  const city = getEle("locationInput").value;
  getWeatherInfoByCity(city);
});

function getEle(id = "") {
  if (!id) throw "element is required";

  return document.getElementById(id);
}

function checkGeoLocation() {
  if (navigator.geolocation) {
    return navigator.geolocation;
  } else {
    alert("Unable to get geo location information");
    return null;
  }
}

function updateWeatherReport(data) {
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  const temp = data.main.temp;
  const location = data.name + ", " + data.sys.country;
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;
  const speed = data.wind.speed;
  const weatherCondition = predictWeatherCondition(temp);

  setWeatherImage(weatherCondition);
  getEle("weather-temp").innerHTML = temp + " <sup>°C</sup>";
  getEle("weather-desc").innerHTML = weatherCondition;
  getEle("location").innerHTML = location;
  getEle("lat").innerHTML = "Latitude: " + lat;
  getEle("lon").innerHTML = "Longitude: " + lon;
  getEle("humidity").innerHTML = "Humidity: " + humidity;
  getEle("pressure").innerHTML = "Pressure: " + pressure;
  getEle("speed").innerHTML = "Speed: " + speed;
}

function predictWeatherCondition(temperature = 0) {
  if (temperature < 20) return "raining";

  if (temperature < 35) return "mixed";

  return "sunny";
}

function setWeatherImage(weatherCondition) {
  const imageHtmlElement = getEle("weather-img");

  if (weatherCondition === "raining")
    return (imageHtmlElement.src = "images/cloudy.png");

  if (weatherCondition === "mixed")
    return (imageHtmlElement.src = "images/mixed.png");

  imageHtmlElement.src = "images/sunny.png";
}

async function getWeatherInfoByGeoLocation({ lat, log }) {
  if (!lat && !log) return alert("Location Access Is Required");

  const param = `lat=${Latitude}&lon=${Longitude}`;

  const url = `https://api.openweathermap.org/data/2.5/weather?${param}&appid=${API_KEY}&units=metric`;

  const weatherResponse = await fetch(url);

  const weatherData = await weatherResponse.json();

  updateWeatherReport(weatherData);
}

async function getWeatherInfoByCity(city) {
  if (!city) alert("City Name  Is Required");

  const param = `q=${city || "New York"}`;

  const url = `https://api.openweathermap.org/data/2.5/weather?${param}&appid=${API_KEY}&units=metric`;

  const weatherResponse = await fetch(url);

  const weatherData = await weatherResponse.json();

  updateWeatherReport(weatherData);
}

async function getUserGeoLocation() {
  // New Promise
  return new Promise((resolve, reject) => {
    const geoLocation = checkGeoLocation();

    if (geoLocation === null)
      return reject("Browsers does not have support for geo location");

    geoLocation.getCurrentPosition(
      (position) => {
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;

        resolve({
          lat: Latitude,
          log: Longitude,
        });
      },
      (err) => {
        if (err.PERMISSION_DENIED) {
          return reject("WindScrib requires your location data to work");
        }
        if (err.POSITION_UNAVAILABLE) {
          return reject("Unable to get current location info");
        }
        return reject(err.message);
      }
    );
  });
}
