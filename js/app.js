// Write your javascript code here

// navigator.geolocation.getCurrentPosition(onSuccess, onError);

//***** Data module functionalities *****/

//impot module
import getWeatherIcons from "../js/weather-data.js";
const icon = getWeatherIcons();
// console.log(icon);

//********* Data fatching functionalities *********/
//function for get current location

//fetche data for daily weather by api_key;

const apiKey = "7288373045abb8dfcf3ecd6253478fd6";
const cityName = "chittagong";
// const url = `api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=${apiKey}`;
const apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

const getCityApi = "https://api.teleport.org/api/cities/?limit=8&search=";

// function for accesing current location
const onSuccess = (position) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  getWeatherData(url);
};

const onError = (error) => {
  alert(error.message);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  getWeatherData(url);
};

const getWeatherData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  renderWeather(data);
  forcastData(data);
};
getWeatherData(apiEndPoint);

//fatching data for sarch suggestion using Teliport Api
const getCityData = async (value) => {
  const endPoint = getCityApi + value;
  const res = await fetch(endPoint);
  const data = await res.json();
  console.log(data);
  renderSuggestion(data._embedded["city:search-results"]);
};

/*------ fatching data for forcast endpoint-------*/

const forcastData = async (apiData) => {
  // const lat = apiData.coord.lat;
  const cityId = apiData.id;
  console.log(cityId);
  const endpoint = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric`;
  const res = await fetch(endpoint);
  const data = await res.json();
  const list = data.list;
  console.log(list);
  const forcastTemp = [];
  list.forEach((obj) => {
    // console.log(obj);
    const date = new Date(obj.dt_txt);
    const hour = date.getHours();
    if (hour == 12) {
      forcastTemp.push(obj);
      // console.log(forcastTemp);
    }
    renderForcast(forcastTemp);
  });
};

//***** Search functionalities *****/

//Function for search suggestion
const searchInput = document.querySelector(".weather__search");
searchInput.addEventListener("input", () => {
  getCityData(searchInput.value);
});

searchInput.addEventListener("keydown", (e) => {
  const inpValue = searchInput.value;
  let cityName;
  if (inpValue.includes(",")) {
    cityName =
      inpValue.slice(0, inpValue.indexOf(",")) +
      inpValue.slice(inpValue.lastIndexOf(","));
  }

  const apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  if (e.keyCode === 13) {
    getWeatherData(apiEndPoint);
  }
});

//********* Data rendering functionalities *********/

//Catch dom elements and
const city = document.querySelector(".weather__city");
const day = document.querySelector(".weather__day");
const time = document.querySelector(".time");
const humidity = document.querySelector(
  ".weather__indicator--humidity >.value"
);
const wind = document.querySelector(".weather__indicator--wind>.value");
const pressure = document.querySelector(".weather__indicator--pressure>.value");
const weatherImage = document.querySelector(".weather__image");
const weatherTemp = document.querySelector(".weather__temperature>.value");
const weatherForcast = document.querySelector(".weather__forecast");
const citysuggest = document.querySelector("#suggestions");

//Render data

//render WeatherData object

const renderWeather = (data) => {
  city.textContent = data.name;
  // const time = data.dt;
  // const timeZone = data.timezone;
  day.innerText = findDay(data.dt);
  time.innerText = getTime(data.dt);
  // console.log(getDay(data.dt, data.timezone));
  humidity.textContent = data.main.humidity;
  wind.innerText = `${getDirections(data.wind.deg)} ${data.wind.speed}`;
  pressure.innerText = data.main.pressure;
  weatherTemp.innerText = `${
    data.main.temp >= 0 ? "+" + data.main.temp : "-" + data.main.temp
  }`;
  const iconId = data.weather[0].id;
  icon.forEach((obj) => {
    if (obj.ids.includes(iconId)) {
      weatherImage.src = obj.url;
    }
  });
};
//renderForcast

const renderForcast = (data) => {
  weatherForcast.innerHTML = "";
  data.forEach((obj) => {
    const temp = obj.main.temp;
    const icon = `http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`;
    const dayName = new Date(obj.dt_txt).toLocaleDateString("En-en", {
      weekday: "long",
    });
    const desc = obj.weather[0].description;

    // console.log(dayName);
    weatherForcast.innerHTML += `
      <article class="weather__forecast__item">
      <img
        src='${icon}';
        alt="${desc}";
        class="weather__forecast__icon"
      />
      <h3 class="weather__forecast__day">"${dayName}"</h3>
      <p class="weather__forecast__temperature">
        <span class="value">"${temp}"</span> &deg;C
      </p>
      </article>
    `;
  });
};

//render suggestion

const renderSuggestion = (data) => {
  citysuggest.innerHTML = "";
  data.forEach((loc) => {
    citysuggest.innerHTML += `<option value="${loc.matching_full_name}"></option>`;
  });
};

//function for getting weekdays

const findDay = (value) => {
  console.log(new Date(value * 1000));
  const day = new Date(value * 1000).toLocaleDateString("en-En", {
    weekday: "long",
  });
  return day;

  // const days = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  // ];
  // return days[date.getUTCDay()];
};

//code for realTime update
const getTime = (value) => {
  return new Date(value * 1000).toLocaleString("en-US", {
    timeStyle: "long",
  });
};

//function for getting directions
const getDirections = (angle) => {
  const directions = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];

  const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
  return directions[index];
};
getDirections(0);

// code for time zone

// const getDay = (time, timezone) => {
//   return new Date(time * 1000).toLocaleString("en-US", {
//     timeZone: timezone,
//     dateStyle: "long",
//   });
// };

//Initialize the app
getWeatherData(apiEndPoint);
//get current location
navigator.geolocation.getCurrentPosition(onSuccess, onError);
