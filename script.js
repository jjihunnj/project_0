// ===== DOM =====
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');
const weatherCard = document.getElementById('weatherCard');
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');

// ===== Иконки по описанию погоды =====
function getWeatherIcon(desc) {
  const d = desc.toLowerCase();
  if (d.includes('sun') || d.includes('clear')) return '☀️';
  if (d.includes('partly') || d.includes('cloudy')) return '⛅';
  if (d.includes('cloud') || d.includes('overcast')) return '☁️';
  if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
  if (d.includes('thunder') || d.includes('storm')) return '⛈️';
  if (d.includes('snow') || d.includes('sleet')) return '❄️';
  if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return '🌫️';
  if (d.includes('wind')) return '💨';
  return '🌤️';
}

// ===== Запрос погоды через wttr.in =====
async function getWeather(city) {
  // format=j1 — полный JSON
  // lang=ru — описание на русском (где поддерживается)
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=ru`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Не удалось получить данные о погоде');
  }

  const data = await response.json();
  return data;
}

// ===== Отображение =====
function showLoading() {
  loading.classList.remove('hidden');
  errorBox.classList.add('hidden');
  weatherCard.classList.add('hidden');
}

function showError(msg) {
  loading.classList.add('hidden');
  weatherCard.classList.add('hidden');
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

function showWeather(data) {
  loading.classList.add('hidden');
  errorBox.classList.add('hidden');
  weatherCard.classList.remove('hidden');

  const current = data.current_condition[0];
  const area = data.nearest_area[0];

  // Город и страна
  cityName.textContent = area.areaName[0].value;
  countryName.textContent = area.country[0].value;

  // Температура
  temperature.textContent = current.temp_C;
  feelsLike.textContent = `Ощущается как ${current.FeelsLikeC}°`;

  // Описание
  const desc = current.lang_ru 
    ? current.lang_ru[0].value 
    : current.weatherDesc[0].value;
  
  weatherDescription.textContent = desc;
  weatherIcon.textContent = getWeatherIcon(current.weatherDesc[0].value);

  // Детали
  humidity.textContent = `${current.humidity}%`;
  wind.textContent = `${current.windspeedKmph} км/ч`;
  pressure.textContent = `${current.pressure} мб`;
  visibility.textContent = `${current.visibility} км`;
}

// ===== Поиск =====
async function searchCity(city) {
  if (!city.trim()) {
    showError('Введите название города');
    return;
  }

  showLoading();

  try {
    const data = await getWeather(city.trim());
    showWeather(data);
  } catch (err) {
    showError('Город не найден или ошибка сети. Попробуйте ещё раз.');
  }
}

// ===== События =====
searchBtn.addEventListener('click', () => {
  searchCity(cityInput.value);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchCity(cityInput.value);
  }
});

// Старт — Бишкек
window.addEventListener('DOMContentLoaded', () => {
  cityInput.value = 'Бишкек';
  searchCity('Бишкек');
});
