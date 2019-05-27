import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {Highlight} from "react-instantsearch-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { inject, observer } from "mobx-react";
import variantById from "lib/utils/variantById";
import priceByCurrencyCode from "lib/utils/priceByCurrencyCode";
import withCart from "containers/cart/withCart";
import withShop from "containers/shop/withShop";
import trackProduct from "lib/tracking/trackProduct";
import TRACKING from "lib/tracking/constants";
import trackCartItems from "lib/tracking/trackCartItems";
import {base64EncodeId} from "../../../lib/utils/encoding";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import Link from "components/Link";

const { CART_VIEWED, PRODUCT_ADDED, PRODUCT_VIEWED } = TRACKING;
// This is a temporary cartItem object to be used for testing
// pending the GraphQL endpoint being hooked up
// Remove the code between these comments when live data is available

const styles = (theme) => ({
  addToCartButton: {
    "padding": theme.spacing.unit,
    "backgroundColor": theme.palette.primary.main,
    "borderRadius": theme.palette.reaction.buttonBorderRadius,
    "minWidth": "66%",
    "&:hover": {
      borderColor: theme.palette.reaction.activeElementBorderColor
    },
    "&:focus": {
      outline: "auto 5px -webkit-focus-ring-color"
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  addToCartText: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600
  },
  addToCartErrorText: {
    color: theme.palette.primary.coolGray500,
    fontWeight: 600,
    marginTop: "20px"
  }
});

@withCart
@withWidth({ initialWidth: "md" })
@withStyles(styles, { name: "SkProductDetailAddToCart" })
@inject("uiStore")
@observer
class Hit extends React.Component{
  static propTypes = {
    /**
     * Function to add items to a cart.
     * Implementation may be provided by addItemsToCart function from the @withCart decorator
     *
     * @example addItemsToCart(CartItemInput)
     * @type Function
     */
    addItemsToCart: PropTypes.func,
    classes: PropTypes.object,
    //currencyCode: PropTypes.string.isRequired,
    product: PropTypes.object,
    //routingStore: PropTypes.object.isRequired,
    shop: PropTypes.object.isRequired,
    theme: PropTypes.object,
    uiStore: PropTypes.shape({
      openCartWithTimeout: PropTypes.func
    }).isRequired,
    width: PropTypes.string.isRequired
  };

  @trackProduct()
  trackAction() {}

  @trackCartItems()
  trackCartItems() {}
  /**
   * @name handleAddToCartClick
   * @summary Called when the add to cart button is clicked
   * @private
   * @ignore
   * @param {Number} quantity - A positive integer from 0 to infinity, representing the quantity to add to cart
   * @returns {undefined} No return
   */
  handleAddToCartClick = async (quantity) => {
    const {
      addItemsToCart,
      uiStore: { openCartWithTimeout, pdpSelectedOptionId, pdpSelectedVariantId },
      width
    } = this.props;

    const product = this.props.hit;
    const currencyCode = this.props.shop.currency.code;
    // Get selected variant or variant option
    let productId = product['product-id'];
    let variantId = product['variant-id'];
    quantity = 1;

    const selectedVariant = variantId;
    const selectedOption = selectedVariant.options && variantById(selectedVariant.options, pdpSelectedOptionId);
    const selectedVariantOrOption = selectedOption || selectedVariant;

    if (selectedVariantOrOption) {
      // Get the price for the currently selected variant or variant option
      //const price = priceByCurrencyCode(currencyCode, selectedVariantOrOption.pricing);
      const price = product['price'];

      // Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
      let dataGraph = {
        price: {
          //amount: price.price,
          amount: price,
          currencyCode: currencyCode,
        },
        productConfiguration: {
          productId: productId, // Pass the productId, not to be confused with _id
          productVariantId: variantId// Pass the variantId, not to be confused with _id
        },
        quantity: quantity
      };

      const { data } = await addItemsToCart([
        dataGraph
      ]);

      // If no errors occurred, track action
      if (data) {
        // The response data will be in either `createCart` or `addCartItems` prop
        // depending on the type of user, either authenticated or anonymous.
        const { cart } = data.createCart || data.addCartItems;
        const { edges: items } = cart.items;

        this.trackAction({
          variant: {
            ...selectedVariant,
            cart_id: cart._id, // eslint-disable-line camelcase
            quantity: quantity
          },
          optionId: selectedOption ? selectedOption._id : null,
          action: PRODUCT_ADDED
        });

        // The mini cart popper will open automatically after adding an item to the cart,
        // therefore, a CART_VIEWED event is published.
        // debugger // eslint-disable-line
        this.trackCartItems({ cartItems: items, cartId: cart._id, action: CART_VIEWED }); // eslint-disable-line camelcase
      }
    }

    // Scroll to the top
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }

    if (isWidthUp("md", width)) {
      // Open the cart, and close after a 3 second delay
      openCartWithTimeout(3000);
    }
  };

  getImage(hit) {
    return hit['product-image'];
  }

  render(){
    const hit = this.props.hit;
    const {
      classes: {
        addToCartButton,
        addToCartText,
        addToCartErrorText,
      }
    } = this.props;

    let currencyCode = this.props.shop.currency.code;
    let currencySign = '';
    if (currencyCode == 'USD')
      currencySign ='&dollar;';
    else if (currencyCode == 'GBP')
      currencySign = "&pound;";

    return (
      <div className="product">
        <div className="hit-info">
          {/*<a className="fav-btn" href="#"><i className="far fa-heart"></i></a>*/}
          <Link className="product-name" to={`/product/${hit['slug']}`}>
            <div style={{fontSize: "0px"}} className="relative">
              <img src={this.getImage(hit)} alt="" className="product-image"/>
            </div>
          </Link>
          <div className="product-description">
            {/*<p>{hit["product-title"]}</p>*/}
            <Link className="product-name" to={`/product/${hit['slug']}`}>
              <Highlight style={{color: "#fff", marginBottom: "5px"}} attribute="product-title" hit={hit}/>
            </Link>
            <p className="free_sample">Free MAX Fix + Setting Spray Sample</p>
            <span className="hit-price">
                              {/*<p>&pound;{hit.price}</p>*/}
              <span dangerouslySetInnerHTML={{__html: currencySign}}/>
              <Highlight attribute="price" hit={hit}/>
                          </span>
            <div className="rating">
              <i className="zmdi zmdi-star"></i>
              <i className="zmdi zmdi-star"></i>
              <i className="zmdi zmdi-star"></i>
            </div>
            <Grid item xs={12}>
              <ButtonBase
                onClick={this.handleAddToCartClick}
                className={addToCartButton}
              >
                <Typography className={addToCartText} component="span" variant="body1">
                  Add to bag
                </Typography>
              </ButtonBase>
            </Grid>
          </div>
        </div>
      </div>
    );
  }


}

export default Hit;
