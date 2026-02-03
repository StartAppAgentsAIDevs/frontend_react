'use client';

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import BigArrowRight from './icons/big-arrow-right.svg';
import LittleArrowRight from './icons/down-arrow.svg';
import './header.scss';
import { useAuth } from "../../api/Authorization/authContext";

const Header: React.FC = () => {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsAccountMenuOpen(false);
        navigate('/');
    };

    const handleAccountClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    const handleNavigateToAccount = () => {
        setIsAccountMenuOpen(false);
        navigate('/account');
    };

    // Закрытие меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

                {isAuthenticated ? (
                    <div className="header__account-container" ref={accountMenuRef}>
                        <div
                            className="header__account"
                            onClick={handleAccountClick}
                        >
                            <span className="header__account__text">АККАУНТ</span>
                            <img
                                className={`header__title__icon__second ${isAccountMenuOpen ? 'header__title__icon__second--rotated' : ''}`}
                                src={LittleArrowRight}
                                alt="Arrow Right"
                            />
                        </div>

                        {isAccountMenuOpen && (
                            <div className="account-dropdown">
                                <div className="account-dropdown__header">
                                    <div className="account-dropdown__user-info">
                                        <div className="account-dropdown__name">
                                            Иван Иванов
                                        </div>
                                        <div className="account-dropdown__email">
                                            ivan@example.com
                                        </div>
                                    </div>
                                </div>

                                <div className="account-dropdown__actions">
                                    <button
                                        className="account-dropdown__action account-dropdown__action--account"
                                        onClick={handleNavigateToAccount}
                                    >
                                        <span>Перейти в аккаунт</span>
                                        <img
                                            className="account-dropdown__action-icon"
                                            src={LittleArrowRight}
                                            alt="Arrow Right"
                                        />
                                    </button>

                                    <button
                                        className="account-dropdown__action account-dropdown__action--logout"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to={'/auth'} className="header__second__title">
                        <h2 className="header__second__title__text">ВХОД</h2>
                        <img className="header__title__icon__second" src={LittleArrowRight} alt="Arrow Right" />
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;