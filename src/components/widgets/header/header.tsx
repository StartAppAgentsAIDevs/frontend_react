'use client';

import React from "react";
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import BigArrowRight from './icons/big-arrow-right.svg';
import LittleArrowRight from './icons/down-arrow.svg';
import './header.scss';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header__title">
                <h2 className="header__title__text">SCHRIFT</h2>
                <img
                    className="header__title__icon"
                    src={BigArrowRight}
                    alt="Arrow Right"
                />
            </div>
            <nav className="header__nav">
                <ul className="header__list">
                    <h2 className="header__item">
                        <ScrollLink
                            to="about"
                            smooth={true}
                            duration={500}
                            className="header__link"
                        >
                            О НАС
                        </ScrollLink>
                    </h2>
                    <h2 className="header__item">
                        <ScrollLink
                            to="services"
                            smooth={true}
                            duration={500}
                            className="header__link"
                        >
                            УСЛУГИ
                        </ScrollLink>
                    </h2>
                    <h2 className="header__item">
                        <ScrollLink
                            to="portfolio"
                            smooth={true}
                            duration={500}
                            className="header__link"
                        >
                            ПОРТФОЛИО
                        </ScrollLink>
                    </h2>
                </ul>
                <Link to={'/auth'} className="header__second__title">
                    <h2 className="header__second__title__text">ВХОД
                    </h2>
                    <img
                        className="header__title__icon__second"
                        src={LittleArrowRight}
                        alt="Arrow Right"
                    />
                </Link>
            </nav>
        </header>
    );
}

export default Header;