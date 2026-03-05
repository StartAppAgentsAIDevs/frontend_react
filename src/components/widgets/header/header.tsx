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
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            setIsAccountMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleAccountClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    const handleNavigateToAccount = () => {
        setIsAccountMenuOpen(false);
        navigate('/account');
    };

    const getUserDisplayName = () => {
        if (!user) return 'Загрузка...';

        const firstName = user.first_name || '';
        const lastName = user.last_name || '';

        if (firstName && lastName) {
            return `${lastName} ${firstName}`;
        } else if (firstName) {
            return firstName;
        } else if (lastName) {
            return lastName;
        } else {
            return 'Не указано';
        }
    };

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

    if (isLoading) {
        return (
            <header className="header">
                {/* Скелетон загрузки */}
                <div className="header__skeleton">
                    Загрузка...
                </div>
            </header>
        );
    }

    return (
        <header className="header">
            <div className="header__title">
                <Link to={'/'} className="header__title__text">SCHRIFT</Link>
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
                                            {getUserDisplayName()}
                                        </div>
                                        <div className="account-dropdown__email">
                                            {user?.email || 'Не указано'}
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
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? 'Выход...' : 'Выйти'}
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