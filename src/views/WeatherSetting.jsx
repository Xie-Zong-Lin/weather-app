import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { availableLocations } from './../utils/helper';

const WeatherSettingWrapper = styled.div`
    position: relative;
    min-width: 360px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    background-color: ${({ theme }) => theme.foregroundColor};
    box-sizing: border-box;
    padding: 20px;
`;

const Title = styled.div`
    font-size: 28px;
    margin-bottom:20px;
    color:${({theme})=>theme.titleColor};
`;

const StyledLabel = styled.label`
    display:block;
    color:${({theme})=>theme.textColor};
    font-size:16px;
    margin-bottom:20px;
`;

const StyledSelect = styled.select`
    display: block;
    box-sizing: border-box;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.textColor};
    outline: none;
    width: 100%;
    max-width: 100%;
    color: ${({ theme }) => theme.textColor};
    font-size: 16px;
    padding: 7px 10px;
    margin-bottom: 40px;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;



const WeatherSetting = ({ handleCurrentPageChange, handleCurrentCityChange, cityName }) => {

  // Controlled寫法
  const [locationName,setLocationName] = useState(cityName);
  const handleChange = (e) => {
    console.log('選取',e.target.value);
    setLocationName(e.target.value);
  };
  const handleSave = () =>{
    handleCurrentCityChange(locationName);
    handleCurrentPageChange('WeatherCard');
    localStorage.setItem('cityName',locationName);
    console.log('儲存:',locationName);
  };

  // unControlled寫法 
  // const inputLocationRef = useRef(null);

  // const handleSave = () => {
  //   console.log("value",inputLocationRef.current.value);
  // };


  return (
    <WeatherSettingWrapper>
        <Title>設定</Title>
        <StyledLabel  htmlFor="location">地區</StyledLabel >
        <StyledSelect id="location" name="location" onChange={handleChange} value={locationName}>
            { availableLocations.map((location) => (
                <option value={location.cityName} key={location.cityName}>
                    {location.cityName}
                </option>

            ))}
        </StyledSelect>
        <ButtonGroup>
            <Back onClick={()=>handleCurrentPageChange('WeatherCard')}>返回</Back>
            <Save onClick={handleSave} >儲存</Save>
         </ButtonGroup>
    </WeatherSettingWrapper>
    
    
  )
}

export default WeatherSetting;