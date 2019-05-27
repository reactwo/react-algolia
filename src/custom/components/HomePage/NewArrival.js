import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import CatalogGrid from "@reactioncommerce/components/CatalogGrid/v1";
import withCatalogItems from "containers/catalog/withCatalogItems";
import track from "lib/tracking/track";
import trackProductClicked from "lib/tracking/trackProductClicked";
import PageLoading from "components/PageLoading";
import PageStepper from "components/PageStepper";
import PageSizeSelector from "components/PageSizeSelector";
import SortBySelector from "components/SortBySelector";
import ProductGridEmptyMessage from "custom/components/ProductGrid/ProductGridEmptyMessage";
import ProductGrid from "custom/components/ProductGrid";

const styles = (theme) => ({
  filters: {
    justifyContent: "flex-end",
    marginBottom: theme.spacing.unit * 2
  }
});

withCatalogItems
@withStyles(styles, { name: "SkProductGrid" })
@track()
 export default class NewArrival extends Component {
  static propTypes = {
    catalogItems: PropTypes.array,
    catalogItemsPageInfo: PropTypes.object,
    initialGridSize: PropTypes.object,
    isLoadingCatalogItems: PropTypes.bool,
    routingStore: PropTypes.object,
    shop: PropTypes.shape({
      currency: PropTypes.shape({
        code: PropTypes.string.isRequired
      })
    }),
    tag: PropTypes.object,
    uiStore: PropTypes.shape({
      pageSize: PropTypes.number.isRequired,
      setPageSize: PropTypes.func.isRequired,
      setSortBy: PropTypes.func.isRequired,
      sortBy: PropTypes.string.isRequired
    })
  };


  @trackProductClicked()
  onItemClick = (event, product) => {} // eslint-disable-line no-unused-vars

  render() {
    const { catalogItems, currencyCode, initialSize, isLoadingCatalogItems, pageInfo, pageSize,setPageSize, setSortBy, sortBy } = this.props;
    return (
      <div className="new-arrivals">
    <div className="top-new-arrivals">
        <h1>New Arrivals</h1>
        <a href="#">Shop all new arrivals <span className="half-arrow"></span></a>
    </div>


      <ProductGrid
        catalogItems={catalogItems}
        currencyCode={currencyCode}
        initialSize={initialSize}
        isLoadingCatalogItems={isLoadingCatalogItems}
        pageInfo={pageInfo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setSortBy={setSortBy}
        sortBy={sortBy}
        slides={7}
        responsive={[
          {
            breakpoint: 1950,
            settings: {
              slidesToShow: 6
            }
          }, {
            breakpoint: 1700,
            settings: {
              slidesToShow: 5
            }
          }, {
            breakpoint: 1400,
            settings: {
              slidesToShow: 4
            }
          }, {
            breakpoint: 1100,
            settings: {
              slidesToShow: 3
            }
          }, {
            breakpoint: 991,
            settings: {
              slidesToShow: 3.4,
              variableWidth: false,
              infinite: false,
              arrows: false
            }
          }, {
            breakpoint: 800,
            settings: {
              slidesToShow: 2.8,
              variableWidth: false,
              infinite: false,
              arrows: false
            }
          }, {
            breakpoint: 600,
            settings: {
              slidesToShow: 2.5,
              variableWidth: false,
              infinite: false,
              arrows: false
            }
          }, {
            breakpoint: 575,
            settings: {
              slidesToShow: 2.1,
              variableWidth: false,
              infinite: false,
              arrows: false
            }
          }, {
            breakpoint: 500,
            settings: {
              slidesToShow: 1.6,
              variableWidth: false,
              infinite: false,
              arrows: false
            }
          }, {
            breakpoint: 410,
            settings: {
              slidesToShow: 1.3,
              variableWidth: false,
              infinite: false,
              arrows: false
            }
          }]
        }
        className="featured-slick-slider2"
      />

</div>






    );
  }
}








