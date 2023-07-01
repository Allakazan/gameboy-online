import React, { useEffect, useState } from 'react'
import Moment from 'react-moment';
import { publish, subscribe, unsubscribe } from '../../utils/events';

import { ReactComponent as BackIcon } from "pixelarticons/svg/arrow-left.svg";
import { ReactComponent as GamepadIcon } from "pixelarticons/svg/gamepad.svg";
import { ReactComponent as SettingsIcon } from "pixelarticons/svg/sliders.svg";
import { ReactComponent as ListIcon } from "pixelarticons/svg/text-search.svg";
import "./styles.css"

const UIControls = (props) => {

    const [pageState, setPageState] = useState(0);
    const [uiState, setUiState] = useState('none');
    const [uiListDetail, setUiListDetail] = useState({});

    const goToHome = () => {
        setUiState('none');
        setPageState(0);
        publish('custom-GoToHome')
    }

    const goToList = () => {
        setUiState('list');
        setPageState(1);
        publish('custom-GoToList')
    }

    const backToList = () => {
        setUiState('list');
        setPageState(1);
        publish('custom-BackToList')
    }

    useEffect(() => {
        const onListDetail = ({detail}) => {
            setUiListDetail(detail);
            setUiState('detail');
        }
        
        subscribe('custom-GoToListDetail', onListDetail);

        return () => unsubscribe('custom-GoToListDetail', onListDetail);
    }, [])

    const RoundMenu = () => {
        return (
            <div className={`ui-round-menu ${pageState === 1 ? 'low' : ''}`}>
                {pageState === 0 ? (
                    <GamepadIcon className="menu-icon gamepadIcon" color='white'/>
                ) : (
                    <BackIcon className="menu-icon backIcon" color='white'/>
                )} 
                <SettingsIcon className="menu-icon settingsIcon" color='white'/>
                <ListIcon className="menu-icon listIcon" color='white'/>
                <svg className="menu-svg" width="283" height="141" viewBox="0 0 283 141" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        onClick={goToHome} className={(!pageState ? 'active' : '')} 
                        fill={(!pageState ? 'url(#paint0_linear_7_122)' : '#4840A6')}
                        d="M141.5 0C122.918 -2.21589e-07 104.518 3.66001 87.3503 10.771C70.1827 17.8821 54.5839 28.3049 41.4444 41.4444C28.3049 54.5839 17.8821 70.1827 10.771 87.3503C3.66 104.518 -2.80581e-06 122.918 0 141.5L70.75 141.5C70.75 132.209 72.58 123.009 76.1355 114.425C79.691 105.841 84.9024 98.0419 91.4722 91.4722C98.0419 84.9025 105.841 79.691 114.425 76.1355C123.009 72.58 132.209 70.75 141.5 70.75L141.5 0Z" />
                    <path 
                        onClick={goToList} className={(!!pageState ? 'active' : '')}
                        fill={(!!pageState ? 'url(#paint0_linear_7_122)' : '#4840A6')}
                        d="M283 141.5C283 122.918 279.34 104.518 272.229 87.3503C265.118 70.1827 254.695 54.5839 241.556 41.4444C228.416 28.3049 212.817 17.8821 195.65 10.771C178.482 3.66 160.082 -8.12247e-07 141.5 0L141.5 70.75C150.791 70.75 159.991 72.58 168.575 76.1355C177.159 79.691 184.958 84.9024 191.528 91.4722C198.098 98.0419 203.309 105.841 206.864 114.425C210.42 123.009 212.25 132.209 212.25 141.5H283Z" />
                    <circle cx="140.5" cy="142.5" r="73.5" fill="url(#paint1_radial_7_122)" />
                    <defs>
                        <linearGradient id="paint0_linear_7_122" x1="-5.43846e-07" y1="141" x2="141" y2="7.80102e-06" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#182B5D" />
                            <stop offset="0.589698" stopColor="#4F2397" />
                            <stop offset="1" stopColor="#6F10B9" />
                        </linearGradient>
                        <radialGradient id="paint1_radial_7_122" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 142) rotate(89.6129) scale(74.0017)">
                            <stop stopColor="#061438" />
                            <stop offset="0.711187" stopColor="#12073E" />
                            <stop offset="0.810151" stopColor="#160727" />
                            <stop offset="1" stopColor="#5E00A7" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        )
    }

    return (
        <div className="ui-wrapper">
            {uiState === 'list' ? (
                <div className='ui-list'>
                    <h1 className="ui-title">Search</h1>
                    <div className="ui-header">
                        <input type="text" placeholder="Search"/>
                        <div>
                            <select>
                                <option defaultValue="all">All Regions</option>
                                <option value="USA">USA</option>
                                <option value="Europe">Europe</option>
                                <option value="Japan">Japan</option>
                            </select>
                        </div>
                        <button type="button">+</button>
                    </div>
                </div>
            ) : ""}
            {uiState === 'detail' ? (
                <div className='ui-detail-wrapper'>
                    <div className='ui-detail' style={{color: 'white'}}>
                        <div className='ui-detail-section'>
                            Name: <span>{uiListDetail.name}</span>
                        </div>
                        {uiListDetail.genres && (
                            <div className='ui-detail-section'>
                                Genres: {uiListDetail.genres.join(', ')}
                            </div>)}
                        {uiListDetail.releaseDate && (
                            <div className='ui-detail-section'>
                                Release Date: <Moment interval={0} format="MM-DD-YYYY">{uiListDetail.releaseDate}</Moment>
                            </div>)}
                        {uiListDetail.countries && (
                            <div className='ui-detail-section'>
                                Reagions: {uiListDetail.countries.join(', ')}
                            </div>)}
                        {uiListDetail.companies && (
                            <>
                                <div className='ui-detail-section'>
                                    Developed By: {uiListDetail?.companies.filter(c => c.developer).map(c => c.name).join(', ')}
                                </div>
                                <div className='ui-detail-section'>
                                    Published By: {uiListDetail?.companies.filter(c => c.publisher).map(c => c.name).join(', ')}
                                </div>
                            </>
                        )}
                    </div>
                    <div className='ui-btn-group'>
                        <button onClick={() => backToList()}>Voltar</button>
                        <button>Jogar</button>
                    </div>
                </div>
            ) : ""}
            <RoundMenu/>
        </div>
    )
}

export default UIControls;