import React from "react";

import './mainServices.scss';

const MainServices: React.FC = () => {
    return (
        <section className="main-services" id="services">
            <article className="main-services-title">
                <h1 className="main-services-text">
                    WHAT WE PROVIDE
                </h1>
                <p className="main-services-description">
                    WE TRANSFORM IDEAS INTO IMPACTFUL DESIGNS. FROM BRAND IDENTITIES TO DIGITAL EXPERIENCES, OUR SERVICES BLEND CREATIVITY AND STRATEGY TO MAKE YOUR VISION STAND OUT.
                </p>
            </article>
            <article className="main-services-hover">
                <div className="main-services-frame">
                    <div className="main-services-frame-items">
                        <div className="main-services-frame-item-first">
                            <h1 className="main-services-frame-item-count">
                                01
                            </h1>
                            <h2 className="main-services-frame-item-title">
                                Brand Identity Design
                            </h2>
                            <p className="main-services-frame-item-description">
                                We create memorable brand identities that resonate with your audience. From logos to complete visual systems, we ensure your brand stands out with clarity and impact.
                            </p>
                        </div>
                        <div className="main-services-frame-item-second">
                            <h1 className="main-services-frame-item-count">
                                02
                            </h1>
                            <h2 className="main-services-frame-item-title">
                                Web Design & Development
                            </h2>
                            <p className="main-services-frame-item-description">
                                Your website is your digital storefront. We design and develop websites that combine bold aesthetics with functionality, ensuring an intuitive experience for your users.
                            </p>
                        </div>
                        <div className="main-services-frame-item-third">
                            <h1 className="main-services-frame-item-count">
                                03
                            </h1>
                            <h2 className="main-services-frame-item-title">
                                Motion Graphics & Animation
                            </h2>
                            <p className="main-services-frame-item-description">
                                Bring your brand to life with dynamic animations and motion graphics. We create captivating visuals that engage and leave a lasting impression.
                            </p>
                        </div>
                        <div className="main-services-frame-item-fourth">
                            <h1 className="main-services-frame-item-count">
                                04
                            </h1>
                            <h2 className="main-services-frame-item-title">
                                Creative Consultation
                            </h2>
                            <p className="main-services-frame-item-description">
                                Have a vision but not sure how to bring it to life? Our creative experts collaborate with you to develop bold and precise strategies tailored to your brand goals.                            
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}

export default MainServices;