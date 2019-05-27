import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import track from "lib/tracking/track";
import {
  ClearRefinements,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  Configure,
  RangeInput,
  NumericMenu
} from "react-instantsearch-dom";
import algoliasearch from 'algoliasearch/lite';
import Hit from "./Hit";
import Accordion from "@reactioncommerce/components/Accordion/v1";
import Typography from "@material-ui/core/Typography";
import Slider from "react-slick";

const styles = (theme) => ({
  filters: {
    justifyContent: "flex-end",
    marginBottom: theme.spacing.unit * 2
  }
});
const searchClient = algoliasearch(
  'B3Q4ZBV3QG',
  '91a14dabec5820dcaf93142978ecae6e'
);

@withStyles(styles, { name: "SkProductGrid" })
@track()



export default class CustomProductList extends Component {
  state = { filtersEnabled: false, fullDescription: false };

  handleFiltersToggle = () => {
    this.setState({ filtersEnabled: !this.state.filtersEnabled });
  }

  handleCloseFilters = () => {
    this.setState({ filtersEnabled: false });
  }

  showDescription = (e) => {
    e.preventDefault();
    setTimeout (() => {
      this.setState({ fullDescription: true });
    });
  }

  hideDescription = (e) => {
    e.preventDefault();
    setTimeout (() => {
      this.setState({ fullDescription: false });
    });
  }

  render(){
      const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        arrows: false,
        className: "slider variable-width",
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 7,
              slidesToScroll: 1,

              infinite: false,
              centerPadding: 0,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
              infinite: false,
              centerPadding: 0,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: false,
              centerPadding: 0,
            }
          }
        ]
      };

      return(
        <div className="ais-InstantSearch container-main">
          <div className="category_image">
            <img src="/static/images/E-Retailbanner2.jpg" alt=""/>
            <img className="mobile-version" src="/static/images/E-Retailbanner-mobile.png" alt=""/>
          </div>
          {/*<Slider {...settings} className="subcategories">*/}
              {/*<div className="subcategory-btn active">All</div>*/}
              {/*<div className="subcategory-btn">New In</div>*/}
              {/*<div className="subcategory-btn">Face</div>*/}
              {/*<div className="subcategory-btn">Lips</div>*/}
              {/*<div className="subcategory-btn">Eyes</div>*/}
              {/*<div className="subcategory-btn">Primers</div>*/}
              {/*<div className="subcategory-btn">Skincare</div>*/}
              {/*<div className="subcategory-btn">Brushes</div>*/}
              {/*<div className="subcategory-btn">Tools</div>*/}
              {/*<div className="subcategory-btn">Kits</div>*/}
              {/*<div className="subcategory-btn">Bestsellers</div>*/}
              {/*<div className="subcategory-btn">Trending</div>*/}
          {/*</Slider>*/}
          <InstantSearch indexName="dev_lookfantastic" searchClient={searchClient}>
              <div className="columns-container">
                  <div className="left-panel">
                    <Button type="button" className="toggle_filters" onClick={this.handleFiltersToggle}>
                      <i className="fas fa-sliders-h"></i>Filter & Sort Products
                    </Button>
                    <div className={this.state.filtersEnabled ? "filters active" : "filters"}>
                      <IconButton className="close_filters" onClick={this.handleCloseFilters}>
                        <i className="fas fa-times "></i>
                      </IconButton>
                      <ClearRefinements className="clear-filters"/>
                      <Accordion label="Range" className="filter" isExpanded={true}>
                          <RefinementList className="filters-list" attribute="range" />
                      </Accordion>
                      <Accordion label="Brand" className="filter" isExpanded={true}>
                        <RefinementList className="filters-list" attribute="brand" />
                      </Accordion>
                      <Accordion label="Hair Product" className="filter" isExpanded={true}>
                        <RefinementList className="filters-list" attribute="hair-product" />
                      </Accordion>
                      <Accordion label="Price" className="filter" isExpanded={true}>
                        <NumericMenu attribute="price" className="filters-list"
                        items={[
                                { label: '<= $10', end: 10 },
                                { label: '$10 - $100', start: 10, end: 100 },
                                { label: '$100 - $500', start: 100, end: 500 },
                            ]}
                        />
                      </Accordion>
                    </div>
                    <Configure hitsPerPage={20} />
              </div>
              <div className="right-panel">
                  <SearchBox className="search-box" />
                  <div className={this.state.fullDescription ? "category_details full" : "category_details"}>
                    <Typography className="category_desc">
                      MAC Cosmetics is one of the leading premium makeup and skincare brands in the beauty industry, and is loved by celebrities, bloggers and makeup artists all over the world.  With incredible formulations, colours and textures, each product works in synergy with your skin to create your best complexion, eye and lip look for complete beauty perfection.
                      One of the brand's best-selling products is the MAC Studio Fix Fluid Foundation. With a medium coverage finish, the base cleverly conceals all manner of imperfections without masking your naturally beautiful skin. It glides on and melts into the skin easily, blending in for a flawless look.
                      If you're new to the brand, or want to discover more about each product, take a look at our educational guides on the blog. They are filled with expert advice and tips on how to use the products, as well as ingredient and skin type guides so you can choose the right makeup and skincare for you.
                    </Typography>
                    <div className="fade"></div>
                    {/*<Button href="#" className="button read-more" onClick={(e) => this.showDescription(e)}>Read More</Button>*/}
                    {/*<Button href="#" className="button read-less" onClick={(e) => this.hideDescription(e)}>Read Less</Button>*/}
                    <a href="#" className="button read-more" onClick={(e) => this.showDescription(e)}>Read More</a>
                    <a href="#" className="button read-less" onClick={(e) => this.hideDescription(e)}>Read Less</a>
                  </div>
                  <Hits className="products-list" hitComponent={Hit}/>
                  <Pagination/></div>
              </div>
          </InstantSearch>
      </div>
      )
  }
}
