import axios from 'axios';

// 从环境变量中读取 API key
const apiKey = import.meta.env.VITE_SOME_KEY;

// OpenWeatherMap API 的基础 URL
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// 使用城市名称获取天气信息
const getWeatherByCityName = (city) => {
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`; 
    return axios.get(url).then(response => response.data);
};

// 导出服务函数
export default {
    getWeatherByCityName
};
