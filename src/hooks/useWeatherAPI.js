
import { useState, useEffect, useCallback } from 'react';


const fetchCurrentWeather = ({authorizationKey, locationName}) => {

  
    //這裡加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
    return fetch(
        `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((response) => response.json())
      .then((data) =>{
        // data為物件
        console.log('111111111111111111',data);
        //不直接將locationData指定到weatherElement是因為其他所需資料再外層
        const locationData = data.records.location[0];
        
        // locationData.weatherElement 為物件陣列
        const weatherElements = locationData.weatherElement.reduce(
            (neededElements,current)=>{
              if(['WDSD','TEMP'].includes(current.elementName)){
                 neededElements[current.elementName] = current.elementValue;
              }  
              return neededElements;  
            },
            {}
        );
        return {
            observationTime: locationData.time.obsTime,
            locationName: locationData.locationName,
            temperature: weatherElements.TEMP,
            windSpeed: weatherElements.WDSD,
        };
      });
      
  
  };
  

  
// 抓取  天氣現象（Wx) 降雨機率（PoP） 舒適度（CI）
  const fetchWeatherForecast = ({authorizationKey, cityName}) => {

    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    )
      .then((response)=>response.json())
      .then((data)=>{
        console.log('data',data);
        
        const locationData = data.records.location[0];
  
        console.log(locationData);
  
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements,current)=>{
            if (['Wx','PoP','CI'].includes(current.elementName)){
              //time陣列中會預測3個時段 每個時段12小時 共36小時 取time[0]為資料
              neededElements[current.elementName] = current.time[0].parameter; 
            };
            return neededElements;
          },
          {}
        );

        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility:weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        }
  
      });
  };


const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {

    const [weatherElement,setWeatherElement] = useState({
        observationTime: new Date(),
        description: '',
        locationName: '',
        temperature: 0,
        windSpeed: 0,
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true,
      });
    
    const fetchData = useCallback(async() =>{

        setWeatherElement((prevState)=>({
            ...prevState,
            isLoading:true,
        }));

        const [currentWeather,weatherForecast] = await Promise.all([
            fetchCurrentWeather({authorizationKey, locationName}),
            fetchWeatherForecast({authorizationKey, cityName}),
        ]);

        console.log('currentWeather:',currentWeather);
        console.log('weatherForecast:',weatherForecast);


        setWeatherElement({
            ...currentWeather,
            ...weatherForecast,
            isLoading:false,
        });
    },[ locationName, cityName, authorizationKey ]);

        
    useEffect(()=>{
        fetchData();
    },[fetchData]);


  return [weatherElement,fetchData]
}

export default useWeatherAPI