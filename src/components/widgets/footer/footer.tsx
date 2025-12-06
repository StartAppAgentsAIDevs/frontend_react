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
            <nav className="footer-nav">
                <ul className="footer-list">
                    <h2 className="footer-item">
                        <Link to="/" className="footer-link">DRIBBLE</Link>
                    </h2>
                    <h2 className="footer-item">
                        <Link to="/" className="footer-link">BEHANCE</Link>
                    </h2>
                    <h2 className="footer-item">
                        <Link to="/" className="footer-link">INSTAGRAM</Link>
                    </h2>
                    <h2 className="footer-item">
                        <Link to="/" className="footer-link">TWITTER</Link>
                    </h2>
                </ul>
                <ul className="footer-second-title">
                    <h2 className="footer-second-title-text">SCHRIFT</h2>
                </ul>
            </nav>
            <article className="footer-text">
                <h1 className="footer-text-title">
                    CREATE BOLD IDEAS TOGETHER
                </h1>
                <p className="footer-text-mail">
                    HELLO@SCHRIFT.COM
                </p>
            </article>
            <article className="footer-up">
                <h1 className="footer-up-text">
                    © Copyright Schrift 2024
                </h1>
                <img
                    className="arrow-up"
                    src={ArrowUP}
                    alt="ellipse"
                    onClick={scrollToTop}
                />
            </article>
            <img
                className="ellipse-back"
                src={Ellipse}
                alt="ellipse"
            />
        </footer>
    );
}

export default Footer;