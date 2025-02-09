
import PropertyContainer from "../components/PropertyContainer";
import Carousel from '../components/carousel.jsx';
const HomePage = () => {
  return (
    <section>
      <div>
      <Carousel />
        <div>
          <PropertyContainer />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
