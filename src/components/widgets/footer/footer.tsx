'use client';

import React from "react";
import { Link } from 'react-router-dom';

import Ellipse from './images/Ellipse.png';

import ArrowUP from './icons/up-arrow.svg';

import './footer.scss';

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <footer className="footer">
            <nav className="footer__nav">
                <ul className="footer__list">
                    <h2 className="footer__item">
                        <Link to="/" className="footer__link">DRIBBLE</Link>
                    </h2>
                    <h2 className="footer__item">
                        <Link to="/" className="footer__link">BEHANCE</Link>
                    </h2>
                    <h2 className="footer__item">
                        <Link to="/" className="footer__link">INSTAGRAM</Link>
                    </h2>
                    <h2 className="footer__item">
                        <Link to="/" className="footer__link">TWITTER</Link>
                    </h2>
                </ul>
                <ul className="footer__second__title">
                    <h2 className="footer__second__title__text">SCHRIFT</h2>
                </ul>
            </nav>
            <article className="footer__text">
                <h1 className="footer__text__title">
                    CREATE BOLD IDEAS TOGETHER
                </h1>
                <p className="footer__text__mail">
                    HELLO@SCHRIFT.COM
                </p>
            </article>
            <article className="footer__up">
                <h1 className="footer__up__text">
                    © Copyright Schrift 2024
                </h1>
                <img
                    className="arrow__up"
                    src={ArrowUP}
                    alt="ellipse"
                    onClick={scrollToTop}
                />
            </article>
            <img
                className="ellipse__back"
                src={Ellipse}
                alt="ellipse"
            />
        </footer>
    );
}

export default Footer;