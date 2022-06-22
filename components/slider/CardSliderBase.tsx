import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const defaultSettings: Settings = {
  arrows: true,
  dots: false,
  infinite: false,
  speed: 500,
  autoplay: false,
  autoplaySpeed: 8000,
  slidesToShow: 4,
  slidesToScroll: 1,
  pauseOnHover: true
};

interface CardSlideProps {
  children: Array<JSX.Element>;
  overwriteConfig?: Partial<Settings>;
}

const CardSliderBase = (props: CardSlideProps) => {
  const styles = {
    slider: `mt-[10px] w-full`
  };
  const { children, overwriteConfig } = props;
  const settings = Object.assign({}, defaultSettings, overwriteConfig);
  return (
    <Slider {...settings} className={styles.slider + " gemma-card-slider"}>
      {children}
    </Slider>
  );
};

export default CardSliderBase;
