import React,  { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {styles} from './styles';
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import Slider from "react-slick";
import Link from "components/Link";

@withWidth({ initialWidth: "md" })
@withStyles(styles, { name: "SkOffer" })

class Offers extends Component {
  static propTypes = {
    classes: PropTypes.object,

  };

  static defaultProps = {
    classes: {}
  };


  render() {
    const { classes, width } = this.props;
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      className: "slider-offers"
    };

    return (
      isWidthDown('sm', width) ?
        <div className="offers-section">
          <h1>Offers</h1>
          <Slider {...settings} className="slider">
            <div className="column-1">
              <div className="section-card">
                <img src="/static/images/offers/Cleansing-Treat.png" alt=""/>
                <h2>Cleansing Treat.</h2>
                <p>Receive a <span>FREE</span> bareMinerals Pure Plush Cleansing Foam when you <span>spend &pound;40.</span></p>
                <Link className="white-btn" to="/product/dermalogica-prisma-protect-spf-30-50ml">Shop now</Link>
                {/*<a href="#" className="white-btn">Shop now</a>*/}
              </div>
            </div>
            <div className="column-2">
              <div className="section-card">
                <img src="/static/images/offers/Agifttoyou.png" alt=""/>
                <h2>A gift to you! <img src="/static/images/smile-icon.png" alt=""/></h2>
                <p>Enjoy your <span>FREE</span> Travel Size Avant Skincare Deluxe Hyaluronic Acid Cream when you <span>spend &pound;55</span> on your order.</p>
                <Link className="white-btn" to="/product/filorga-oxygen-glow-eye-cream-15ml">Shop now</Link>
                {/*<a href="#" className="white-btn">Shop now</a>*/}
              </div>
            </div>
          </Slider>
          <div className="discount-card">
            <div className="overlay-text">
              <img src="/static/images/offers/pink-nail-polish.jpg" alt=""/>
              <p>up to</p>
              <h3>15%</h3>
              <p>Student Discount</p>
              <a href="/product-list" className="white-btn">Shop now</a>
            </div>
          </div>
          <div className="column-3">
            <div className="bg2">
              <img src="/static/images/offers/kerestase.png" alt=""/>
              <h3>
                <div className="bonus-product">
                  <div className="free">FREE</div>
                  <img src="/static/images/offers/AuraBotanica.png" alt=""/>
                  <div className="rating">
                    <i className="zmdi zmdi-star"></i>
                    <i className="zmdi zmdi-star"></i>
                    <i className="zmdi zmdi-star"></i>
                    <i className="zmdi zmdi-star"></i>
                    <i className="zmdi zmdi-star"></i>
                  </div>
                  <div className="tag">Save up to 30%</div>
                </div>
                Save up to 30% on Kerastase
              </h3>
              <p>and receive a FREE Full Size Kerastase Aura Botanica Baume Miracle 50ml when you spend &pound;40.</p>

              <a href="/product-list" className="black-btn">Shop Kerastase</a>
            </div>
          </div>
        </div> :
    <div className="offers-section">

      <div className="column-1">
          <h1>Offers</h1>
          <div className="section-card">
              <img src="/static/images/offers/Cleansing-Treat.png" alt=""/>
              <h2>Cleansing Treat.</h2>
              <p>Receive a <span>FREE</span> bareMinerals Pure Plush Cleansing Foam when you <span>spend &pound;40.</span></p>
              <Link className="white-btn" to="/product/dermalogica-prisma-protect-spf-30-50ml">Shop now</Link>
               {/*<a href="#" className="white-btn">Shop now</a>*/}
          </div>

          <a href="/product-list" className="black-btn">Shop all Offers</a>
      </div>

      <div className="column-2">
          <div className="section-card">
              <img src="/static/images/offers/Agifttoyou.png" alt=""/>
              <h2>A gift to you! <img src="/static/images/smile-icon.png" alt=""/></h2>
              <p>Enjoy your <span>FREE</span> Travel Size Avant Skincare Deluxe Hyaluronic Acid Cream when you <span>spend &pound;55</span> on your order.</p>
              <Link className="white-btn" to="/product/filorga-oxygen-glow-eye-cream-15ml">Shop now</Link>
              {/*<a href="#" className="white-btn">Shop now</a>*/}
          </div>
          <div className="discount-card">
              <div className="overlay-text">
                  <img src="/static/images/offers/pink-nail-polish.jpg" alt=""/>
                  <p>up to</p>
                  <h3>15%</h3>
                  <p>Student Discount</p>
                  <a href="#" className="white-btn">Shop now</a>
              </div>
          </div>
      </div>

      <div className="column-3">
          <div className="bg2">
              <img src="/static/images/offers/kerestase.png" alt=""/>
              <h3>
                <div className="bonus-product">
                    <div className="free">FREE</div>
                    <img src="/static/images/offers/AuraBotanica.png" alt=""/>
                    <div className="rating">
                      <i className="zmdi zmdi-star"></i>
                      <i className="zmdi zmdi-star"></i>
                      <i className="zmdi zmdi-star"></i>
                      <i className="zmdi zmdi-star"></i>
                      <i className="zmdi zmdi-star"></i>
                    </div>
                    <div className="tag">Save up to 30%</div>
                </div>
                Save up to 30% on Kerastase
              </h3>
              <p>and receive a FREE Full Size Kerastase Aura Botanica Baume Miracle 50ml when you spend &pound;40.</p>

              <a href="/product-list" className="black-btn">Shop Kerastase</a>
          </div>
      </div>

    </div>
    );
  }
}

export default Offers;
