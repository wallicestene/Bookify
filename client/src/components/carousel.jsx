import { CCarousel, CCarouselCaption, CCarouselItem, CImage } from '@coreui/react';
import React from 'react';

import image from "../assets/loginFormImages/Bookify (200 x 200 px) (Website) (2).svg"
const Carousel = () => {
  return (
    <CCarousel controls indicators dark>
      <CCarouselItem>
        <CImage className="d-block w-100" src="/images/react.jpg" alt="slide 1" />
        <CCarouselCaption className="d-none d-md-block">
          <h5>First slide label</h5>
          <p>Some representative placeholder content for the first slide.</p>
        </CCarouselCaption>
      </CCarouselItem>
      <CCarouselItem>
        <CImage className="d-block w-100" src={image} alt="slide 2" />
        <CCarouselCaption className="d-none d-md-block">
          <h5>Second slide label</h5>
          <p>Some representative placeholder content for the second slide.</p>
        </CCarouselCaption>
      </CCarouselItem>
      <CCarouselItem>
        <CImage className="d-block w-100" src="/images/angular.jpg" alt="slide 3" />
        <CCarouselCaption className="d-none d-md-block">
          <h5>Third slide label</h5>
          <p>Some representative placeholder content for the third slide.</p>
        </CCarouselCaption>
      </CCarouselItem>
    </CCarousel>
  );
};

export default Carousel;
