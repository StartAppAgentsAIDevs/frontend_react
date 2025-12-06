"use client";

import React, { useState, useRef, useEffect } from 'react';

import Code from './images/code.svg';
import Ellipse from './images/ellipse.svg';


import './mainPortfolio.scss';

const MainPortfolio: React.FC = () => {

    const [hoverText, setHoverText] = useState<string>("HOVER ON THE LIST");

    const handleMouseEnter = (count: string) => {
        setHoverText(count);
    };

    const handleMouseLeave = () => {
        setHoverText("HOVER ON THE LIST");
    };

    return (
        <section className="main-portfolio" id='portfolio'>
            <article className="main-portfolio-text">
                <h1 className="main-portfolio-title">FEATURED PORTFOLIO</h1>
                <p className="main-portfolio-description">EXPLORE HOW SCHRIFT TRANSFORMS BOLD IDEAS INTO IMPACTFUL DESIGNS. FROM BRANDING TO DIGITAL EXPERIENCES, OUR WORK REFLECTS PRECISION, CLARITY, AND PURPOSE.</p>
            </article>
            <article className="main-portfolio-block">
                <img
                    className="ellipse-image"
                    src={Ellipse}
                    alt="Code"
                />
                <div className="main-portfolio-hover-pictures">
                    <h1 className="main-portfolio-hover-pictures-text">
                        {hoverText}
                    </h1>
                </div>
                <div className="main-portfolio-list-items">
                    {["01", "02", "03", "04"].map((count, index) => (
                        <div
                            key={index}
                            className="main-portfolio-list-item"
                            onMouseEnter={() => handleMouseEnter(count)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="main-portfolio-list-item-text">
                                <h1 className="main-portfolio-list-item-count">{count}</h1>
                                <p className="main-portfolio-list-item-name">
                                    {count === "01" ? "CASPIAN FOREST" : count === "02" ? "ALCHEMED" : count === "03" ? "CAPSULE" : "SWOOSH!"}
                                </p>
                            </div>
                            <img
                                className=""
                                src={Code}
                                alt="Code"
                            />
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
}

export default MainPortfolio;