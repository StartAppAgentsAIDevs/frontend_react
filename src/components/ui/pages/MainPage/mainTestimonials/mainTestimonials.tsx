import React, { useState, useRef, useEffect } from 'react';

import Down from './icons/down-arrow.svg';

import './mainTestimonials.scss';

const MainTestimonials: React.FC = () => {
    return (
        <section className="main-testimonials">
            <article className="main-testimonials-title">
                <h1 className="main-testimonials-text">
                    WHAT THEY SAY
                </h1>
                <p className="main-testimonials-description">
                    OUR CLIENTS ARE AT THE HEART OF EVERYTHING WE DO. HEAR FROM THE VISIONARIES, INNOVATORS, AND LEADERS WHO&aposVE PARTNERED WITH SCHRIFT TO BRING BOLD IDEAS TO LIFE THROUGH PRECISE, IMPACTFUL DESIGN.
                </p>
            </article>
            <article className="main-testimonials-list-items">
                <div className="main-testimonials-list-item">
                    <div className="main-testimonials-list-item-text">
                        <h1 className="main-testimonials-list-item-title">SOPHIA NGUYEN</h1>
                        <h2 className="main-testimonials-list-item-pre-title">Founder of Lumina Tech</h2>
                    </div>
                    <p className="main-testimonials-list-item-description">
                        Schrift brought our brand to life with a design that perfectly captures our identity. Their bold approach and attention to detail exceeded our expectations!
                    </p>
                </div>
                <div className="main-testimonials-list-item">
                    <div className="main-testimonials-list-item-text">
                        <h1 className="main-testimonials-list-item-title">ISABELLE MARTINEZ</h1>
                        <h2 className="main-testimonials-list-item-pre-title">Director at GreenSphere</h2>
                    </div>
                    <p className="main-testimonials-list-item-description">
                        Working with Schrift was seamless and inspiring. Their creativity and dedication made our rebranding process a complete success.
                    </p>
                </div>
                <div className="main-testimonials-list-item">
                    <div className="main-testimonials-list-item-text">
                        <h1 className="main-testimonials-list-item-title">LIAM CARTER</h1>
                        <h2 className="main-testimonials-list-item-pre-title">Co-founder of VentureStudio</h2>
                    </div>
                    <p className="main-testimonials-list-item-description">
                        Schrift&aposs designs are both innovative and purposeful. They helped us create a website that truly stands out and resonates with our audience.
                    </p>
                </div>
                <div className="main-testimonials-list-item">
                    <div className="main-testimonials-list-item-text">
                        <h1 className="main-testimonials-list-item-title">AMARA OKAFOR</h1>
                        <h2 className="main-testimonials-list-item-pre-title">CEO of NovaEdge</h2>
                    </div>
                    <p className="main-testimonials-list-item-description">
                        The Schrift team transformed our vision into a sleek and modern digital experience. The precision in their work is unmatched!
                    </p>
                </div>
                <div className="main-testimonials-list-item">
                    <div className="main-testimonials-list-item-text">
                        <h1 className="main-testimonials-list-item-title">PRIYA MEHTA</h1>
                        <h2 className="main-testimonials-list-item-pre-title">COO of Elevate Systems</h2>
                    </div>
                    <p className="main-testimonials-list-item-description">
                        Their commitment to excellence is inspiring. Schrift’s work was pivotal in helping us stand out in a competitive market.
                    </p>
                </div>
                <div className="main-testimonials-list-item">
                    <div className="main-testimonials-list-item-text">
                        <h1 className="main-testimonials-list-item-title">CARLOS RIVERA</h1>
                        <h2 className="main-testimonials-list-item-pre-title">Founder of Arc & Co</h2>
                    </div>
                    <p className="main-testimonials-list-item-description">
                        From start to finish, Schrift’s professionalism and creativity shined through. They’ve helped us establish a powerful and cohesive brand identity.
                    </p>
                </div>
            </article>
            <article className="main-testimonials-more">
                <h1 className="main-testimonials-more-title">SEE MORE</h1>
                <img
                    className=""
                    src={Down}
                    alt="Code"
                />
            </article>
        </section>
    );
}

export default MainTestimonials;