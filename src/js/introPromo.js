import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash';
import { convertRemToPixels } from './utils';

import { Swiper, Navigation, Pagination, EffectFade } from 'swiper';
gsap.registerPlugin(ScrollTrigger);

Swiper.use([Navigation, EffectFade, Pagination]);

export default function introPromo() {
    const intro = document.querySelector('.intro');

    const checkIntroHeight = () => {
        const introNotFullscreen = intro.offsetHeight < document.documentElement.clientHeight;

        if (introNotFullscreen) {
            document.body.classList.add('intro-not-fullscreen');
        } else {
            document.body.classList.remove('intro-not-fullscreen');
        }

        console.log(introNotFullscreen, {
            introHeight: intro.offsetHeight,
            limit: document.documentElement.clientHeight
        });

        return introNotFullscreen;
    };

    if (intro) {
        checkIntroHeight();
        window.addEventListener('resize', debounce(checkIntroHeight), 300);
    }

    const elements = Array.from(document.querySelectorAll('.js-intro-promo'));

    // return;

    elements.forEach(element => {
        const slider = element.querySelector('.intro__promo-slider');
        const container = element.querySelector('.swiper');
        const navLinks = Array.from(element.querySelectorAll('.intro__promo-nav-link'));

        const instance = new Swiper(container, {
            effect: 'fade',
            speed: 500,
            pagination: {
                el: element.querySelector('.intro__promo-slider-progress'),
                type: 'progressbar'
            },
            fadeEffect: {
                crossFade: true
            },
            init: false,
            on: {
                init: swiper => {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLinks[swiper.activeIndex].classList.add('active');
                },
                slideChange: swiper => {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLinks[swiper.activeIndex].classList.add('active');
                }
            }
        });

        instance.init();

        navLinks.forEach((link, linkIndex) => {
            link.addEventListener('click', event => {
                event.preventDefault();
                instance.slideTo(linkIndex);
            })
            
        })
        ScrollTrigger.matchMedia({
            '(min-width: 641px)': function() {
                if (!intro) return;
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.intro',
                        start: () => `top top`,
                        end: () => element.offsetHeight,
                        scrub: true,
                        pin: checkIntroHeight() ? false : true,
                        pinSpacing: true,
                        toggleClass: 'expanded'
                    }
                });

                tl.to(element, {
                    y: () => slider.offsetHeight * -1,
                    duration: 0.5
                })
                    .to(
                        '.intro__promo-slider',
                        {
                            autoAlpha: 1,
                            duration: 0.5
                        },
                        0
                    )
                    .to(
                        '.intro__promo .icon-arrow-down',
                        {
                            rotation: 180,
                            duration: 0.2
                        },
                        0
                    );
            }
        });
    });
}
