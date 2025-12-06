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
                <h1 className="about-schrift-title">ABOUT SCHRIFT</h1>
                <div className="about-schrift-block-image">
                    <div className="about-schrift-image"></div>
                </div>
            </section>
            <section className="about-content">
                <article className="about-content-description">
                    <p>SCHRIFT IS A GRAPHIC DESIGN AGENCY FOCUSED ON CLARITY,IMPACT,AND PURPOSE.WE DELIVER DESIGNS THAT COMMUNICATE POWERFULLY AND AUTHENTICALLY</p>
                </article>
                <article className="about-content-items">
                    <div className="about-content-item">
                        <img
                            className="about-content-item-icon"
                            src={Block}
                            alt="Block"
                        />
                        <article className="about-content-item-article">
                            <h1 className="about-content-item-title">PRECISION</h1>
                            <p className="about-content-item-description">Every detail counts at Schrift. We believe in designing with intention, where every element serves a purpose.</p>
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
                            <h1 className="about-content-item-title">BOLD</h1>
                            <p className="about-content-item-description">Our style is modern, sleek, and minimal, using clean lines and bold choices that make a statement.</p>
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
                            <h1 className="about-content-item-title">CLIENT - CENTERED</h1>
                            <p className="about-content-item-description">Your vision is our priority. We work closely with clients, valuing open communication and feedback at every step.</p>
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
                            <h1 className="about-content-item-title">CREATIVE EXCELLENCE</h1>
                            <p className="about-content-item-description">Our team is composed of experienced designers who bring fresh, innovative perspectives to each project</p>
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