
import './App.css';
import styled from '@emotion/styled';
import { useMemo,  useEffect, useState } from 'react';
import useWeatherAPI from './hooks/useWeatherAPI';
import { ThemeProvider } from '@emotion/react';

import { getMoment, availableLocations , findLocation} from './utils/helper';
import WeatherSetting from './views/WeatherSetting';
import WeatherCard from './views/WeatherCard';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const AUTHORIZATION_KEY = 'CWA-1223661D-5204-4FA8-8BAD-594EEFDB4820';
// const LOCATION_NAME = '高雄';
// const LOCATION_NAME_FORECAST = '高雄市';


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {

  //設定區域
   const storageCity = localStorage.getItem('cityName') || "高雄市"  ;



  const [currentCity,setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(()=>
    findLocation(currentCity)
    ,[currentCity]
  );
  //解構賦值
  const   { cityName, locationName, sunriseCityName } = currentLocation;

  const handleCurrentCityChange = (currentCity) => {setCurrentCity(currentCity)};






  //預設主題為dark
  const [currentTheme,setCurrentTheme] = useState('dark');
  
  //使用custom hook，傳入參數為: {授權碼、地區、觀測站地區}，即可獲得各種氣象資訊
  const [weatherElement,fetchData] = useWeatherAPI({
    locationName:locationName,
    cityName:cityName ,
    authorizationKey:AUTHORIZATION_KEY,
  });
  
  //設定分頁
  const [currentPage,setCurrentPage] = useState('WeatherCard');
  
  const handleCurrentPageChange = (currentPage) => {setCurrentPage(currentPage)};
  
  const moment = useMemo(()=>getMoment(sunriseCityName),[sunriseCityName]);

  useEffect(()=>{
    setCurrentTheme(moment === 'day' ? 'light':'dark' );
  },[moment]);

  return (
    
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          handleCurrentPageChange ={handleCurrentPageChange}
        />
        < WeatherSetting /> */}
        {/* {
          currentPage === 'WeatherCard' &&
            <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange ={handleCurrentPageChange}
            />  
        }
        {
          currentPage === 'WeatherSetting' &&
            < WeatherSetting handleCurrentPageChange ={handleCurrentPageChange} />
        } */}

        {
          currentPage === 'WeatherCard' ?
            <WeatherCard
              cityName={cityName}
              weatherElement={weatherElement}
              moment={moment}
              fetchData={fetchData}
              handleCurrentPageChange ={handleCurrentPageChange}
            
            />  :
            < WeatherSetting 
              cityName = {cityName}
              handleCurrentPageChange ={handleCurrentPageChange}
              handleCurrentCityChange = {handleCurrentCityChange}
            />


        }


            
       
      </Container>
    </ThemeProvider>
  );
}

export default App;
