import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import CustomProductList from "custom/components/CustomProductList";

class ProductList extends Component {
  static propTypes = {

    shop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      currency: PropTypes.shape({
        code: PropTypes.string.isRequired
      })
    })
  };


  render() {
    const {  shop } = this.props;

    return (
      <Fragment>
        <Helmet
          title={`Product List | ${shop && shop.name}`}
        />
      <CustomProductList/>
      </Fragment>
    );
  }
}

export default ProductList;
