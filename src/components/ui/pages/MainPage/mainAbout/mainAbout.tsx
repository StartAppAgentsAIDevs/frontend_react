import React, { useState, useRef, useEffect } from 'react';

import CodeItem from './images/code-item.svg';

import Block from './icons/block.svg';
import Light from './icons/lightning.svg';
import Circle from './icons/circle.svg';
import Star from './icons/star.svg';


import './mainAbout.scss';

const MainAbout: React.FC = () => {
    return (
        <section className="main-about" id='about'>
            <section className="about-schrift">
                <h1 className="about-schrift-title">О SCHRIFT</h1>
                <div className="about-schrift-block-image">
                    <div className="about-schrift-image"></div>
                </div>
            </section>
            <section className="about-content">
                <article className="about-content-description">
                    <p>SCHRIFT - ЭТО АГЕНТСТВО АЙТИ УСЛУГ, СОСРЕДОТОЧЕННОЕ НА ЯСНОСТИ, ВОЗДЕЙСТВИИ И ЦЕЛЕСООБРАЗНОСТИ.</p>
                </article>
                <article className="about-content-items">
                    <div className="about-content-item">
                        <img
                            className="about-content-item-icon"
                            src={Block}
                            alt="Block"
                        />
                        <article className="about-content-item-article">
                            <h1 className="about-content-item-title">ТОЧНОСТЬ</h1>
                            <p className="about-content-item-description">В Schrift важна каждая деталь. Мы верим, что каждый элемент служит цели.</p>
                        </article>
                        <img
                            className="about-content-item-code"
                            src={CodeItem}
                            alt="Light"
                        />
                    </div>
                    <div className="about-content-item">
                        <img
                            className="about-content-item-icon"
                            src={Light}
                            alt="Block"
                        />
                        <article className="about-content-item-article">
                            <h1 className="about-content-item-title">СМЕЛОСТЬ</h1>
                            <p className="about-content-item-description">Наша архитектура современная, с использованием новейших моделей AI.</p>
                        </article>
                        <img
                            className="about-content-item-code"
                            src={CodeItem}
                            alt="Light"
                        />
                    </div>
                    <div className="about-content-item">
                        <img
                            className="about-content-item-icon"
                            src={Circle}
                            alt="Block"
                        />
                        <article className="about-content-item-article">
                            <h1 className="about-content-item-title">КЛИЕНТОЦЕНТРИЧНОСТЬ</h1>
                            <p className="about-content-item-description">Ваше видение - наш приоритет. Мы тесно сотрудничаем с клиентами и ценим обратную связь.</p>
                        </article>
                        <img
                            className="about-content-item-code"
                            src={CodeItem}
                            alt="Light"
                        />
                    </div>
                    <div className="about-content-item">
                        <img
                            className="about-content-item-icon"
                            src={Star}
                            alt="Block"
                        />
                        <article className="about-content-item-article">
                            <h1 className="about-content-item-title">СОВЕРШЕНСТВО</h1>
                            <p className="about-content-item-description">Schrift состоит из опытных разработчиков, которые привносят инновационные решения в ваши проекты.</p>
                        </article>
                        <img
                            className="about-content-item-code"
                            src={CodeItem}
                            alt="Light"
                        />
                    </div>
                </article>
            </section>
        </section>
    );
}

export default MainAbout;