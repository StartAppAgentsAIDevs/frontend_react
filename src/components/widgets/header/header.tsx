'use client';

import React from "react";
import { Link as ScrollLink } from 'react-scroll';
import BigArrowRight from './icons/big-arrow-right.svg';
import LittleArrowRight from './icons/down-arrow.svg';
import './header.scss';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-title">
                <h2 className="header-title-text">SCHRIFT</h2>
                <img
                    className="header-title-icon"
                    src={BigArrowRight}
                    alt="Arrow Right"
                />
            </div>
            <nav className="header-nav">
                <ul className="header-list">
                    <h2 className="header-item">
                        <ScrollLink
                            to="about"
                            smooth={true}
                            duration={500}
                            className="header-link"
                        >
                            ABOUT
                        </ScrollLink>
                    </h2>
                    <h2 className="header-item">
                        <ScrollLink
                            to="services"
                            smooth={true}
                            duration={500}
                            className="header-link"
                        >
                            SERVICES
                        </ScrollLink>
                    </h2>
                    <h2 className="header-item">
                        <ScrollLink
                            to="portfolio"
                            smooth={true}
                            duration={500}
                            className="header-link"
                        >
                            PORTFOLIO
                        </ScrollLink>
                    </h2>
                </ul>
                <ul className="header-second-title">
                    <h2 className="header-second-title-text">LET’S TALK
                    </h2>
                    <img
                        className="header-title-icon-second"
                        src={LittleArrowRight}
                        alt="Arrow Right"
                    />
                </ul>
            </nav>
        </header>
    );
}

export default Header;