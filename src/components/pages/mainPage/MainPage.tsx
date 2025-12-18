import React, { useState, useRef, useEffect } from 'react';
import Code from '../../assets/images/code.svg';

import Arrow from '../../assets/icons/arrow-bottom.svg';

import './MainPage.scss';
import Header from "../../widgets/header/header";
import MainAbout from "../../ui/pages/MainPage/mainAbout/mainAbout";
import MainServices from "../../ui/pages/MainPage/mainServices/mainSevices";
import MainPortfolio from "../../ui/pages/MainPage/mainPortfolio/mainProtfolio";
import MainTestimonials from "../../ui/pages/MainPage/mainTestimonials/mainTestimonials";
import Footer from "../../widgets/footer/footer";

function MainPage() {
    return (
        <div className="wrapper">
            <Header />
            <main className="main">
                <section className="main-art">

                    <div className="clouds-container">
                        <div className="cloud cloud-1"></div>
                        <div className="cloud cloud-2"></div>
                        <div className="cloud cloud-3"></div>
                        <div className="cloud cloud-4"></div>
                        <div className="cloud cloud-5"></div>
                        <div className="cloud-overlay"></div>
                    </div>

                    <section className="main-section">
                        <article className="main-article">
                            <h1 className="main-article-title">EST 21.12.24</h1>
                            <p className="main-article-description">A place where design philosophy blends innovation and clarity to create impactful solutions</p>
                        </article>
                        <img
                            className="main-section-image"
                            src={Code}
                            alt="Code"
                        />
                    </section>
                    <section className="main-center-section">
                        <article className="main-center-article">
                            <h1 className="main-center-article-title">The Art of Bold Precision</h1>
                        </article>
                    </section>
                    <section className="main-bottom-section">
                        <article className="main-bottom-article">
                            <h1 className="main-bottom-article-title">Bold Visions. Precise Execution</h1>
                        </article>
                        <div className="line"></div>
                        <button className="main-bottom-button">
                            DISCOVER OUR WORK
                            <img
                                className="main-bottom-section-icon"
                                src={Arrow}
                                alt="Code"
                            />
                        </button>
                    </section>
                </section>
                <MainAbout />
                <MainServices />
                <MainPortfolio />
                <MainTestimonials />
            </main>
            <Footer />
        </div>
    );
}

export default MainPage;