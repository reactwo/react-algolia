import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from '@material-ui/core/AppBar';
import Tabs from "@material-ui/core/Tabs";
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import { inject, observer } from "mobx-react";
import track from "lib/tracking/track";
import Breadcrumbs from "components/Breadcrumbs";
import ProductDetailAddToCart from "components/ProductDetailAddToCart";
import ProductDetailTitle from "components/ProductDetailTitle";
import VariantList from "components/VariantList";
import ProductDetailVendor from "components/ProductDetailVendor";
import ProductDetailDescription from "components/ProductDetailDescription";
import ProductDetailPrice from "components/ProductDetailPrice";
import MediaGallery from "custom/components/MediaGallery";
import { Router } from "routes";
import priceByCurrencyCode from "lib/utils/priceByCurrencyCode";
import variantById from "lib/utils/variantById";
import trackProduct from "lib/tracking/trackProduct";
import TRACKING from "lib/tracking/constants";
import trackCartItems from "lib/tracking/trackCartItems";
import ReactImageMagnify from "react-image-magnify";
import ReactSlick from "react-slick";

const { CART_VIEWED, PRODUCT_ADDED, PRODUCT_VIEWED } = TRACKING;

const styles = (theme) => ({
  section: {
    marginBottom: theme.spacing.unit * 2
  },
  breadcrumbGrid: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  info: {
    marginBottom: theme.spacing.unit
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Product detail component
 * @name ProductDetail
 * @param {Object} props Component props
 * @returns {React.Component} React component node that represents a product detail view
 */
@withWidth({ initialWidth: "md" })
@withStyles(styles, { withTheme: true, name: "SkProductDetail" })
@inject("routingStore", "uiStore")
@track()
@observer
class ProductDetail extends Component {


  state = {
    value: 0,
  };


  handleChange = (event, value) => {
    this.setState({ value });
  };


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
    currencyCode: PropTypes.string.isRequired,
    product: PropTypes.object,
    routingStore: PropTypes.object.isRequired,
    shop: PropTypes.object.isRequired,
    theme: PropTypes.object,
    uiStore: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { product } = this.props;

    // Select first variant by default
    this.selectVariant(product.variants[0]);
  }

  selectVariant(variant, optionId) {
    const { product, uiStore } = this.props;

    // Select the variant, and if it has options, the first option
    const variantId = variant._id;
    let selectOptionId = optionId;
    if (!selectOptionId && variant.options && variant.options.length) {
      selectOptionId = variant.options[0]._id;
    }

    this.trackAction({ variant, optionId, action: PRODUCT_VIEWED });

    uiStore.setPDPSelectedVariantId(variantId, selectOptionId);

    Router.pushRoute("product", {
      slugOrId: product.slug,
      variantId: selectOptionId || variantId
    }, { replace: true });

  }

  @trackProduct()
  trackAction(data) {
    //console.log('tract',data, this.props.shop)
    fetch('http://localhost:5000/event', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        TrackingId: 1,
        StoreId: 2,
        StoreDomain: window.location.hostname,
        CustomerIPAddress: "12.123.232.1",
        EventType: 9,
        isDeleted: false

      })
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Created Gist:', data.html_url);
    });

  }

  @trackCartItems()
  trackCartItems() {}

  /**
   * @name handleSelectVariant
   * @summary Called when a variant is selected in the variant list
   * @private
   * @ignore
   * @param {Object} variant The variant object that was selected
   * @returns {undefined} No return
   */
  handleSelectVariant = (variant) => {
    this.selectVariant(variant);
  };

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
      currencyCode,
      product,
      uiStore: { openCartWithTimeout, pdpSelectedOptionId, pdpSelectedVariantId },
      width
    } = this.props;

    // Get selected variant or variant option
    const selectedVariant = variantById(product.variants, pdpSelectedVariantId);
    const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
    const selectedVariantOrOption = selectedOption || selectedVariant;

    if (selectedVariantOrOption) {
      // Get the price for the currently selected variant or variant option
      const price = priceByCurrencyCode(currencyCode, selectedVariantOrOption.pricing);

      // Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
      const { data } = await addItemsToCart([
        {
          price: {
            amount: price.price,
            currencyCode
          },
          productConfiguration: {
            productId: product.productId, // Pass the productId, not to be confused with _id
            productVariantId: selectedVariantOrOption.variantId // Pass the variantId, not to be confused with _id
          },
          quantity
        }
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
            quantity
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
    if (isWidthUp("md", width)) {
      // Open the cart, and close after a 3 second delay
      openCartWithTimeout(3000);
    }
  };

  /**
   * @name handleSelectOption
   * @summary Called when an option is selected in the option list
   * @private
   * @ignore
   * @param {Object} option The option object that was selected
   * @returns {undefined} No return
   */
  handleSelectOption = (option) => {
    const { product, uiStore } = this.props;

    // If we are clicking an option, it must be for the current selected variant
    const variant = product.variants.find((vnt) => vnt._id === uiStore.pdpSelectedVariantId);

    this.selectVariant(variant, option._id);
  };

  /**
   * @name determineProductPrice
   * @description Determines a product's price given the shop's currency code. It will
   * use the selected option if available, otherwise it will use the selected variant.
   * @returns {Object} An pricing object
   */
  determineProductPrice() {
    const { currencyCode, product } = this.props;
    const { pdpSelectedVariantId, pdpSelectedOptionId } = this.props.uiStore;
    const selectedVariant = variantById(product.variants, pdpSelectedVariantId);
    let productPrice = {};

    if (pdpSelectedOptionId && selectedVariant) {
      const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
      productPrice = priceByCurrencyCode(currencyCode, selectedOption.pricing);
    } else if (!pdpSelectedOptionId && selectedVariant) {
      productPrice = priceByCurrencyCode(currencyCode, selectedVariant.pricing);
    }

    return productPrice;
  }

  imageHover=(item) => {
    return (
      <ReactImageMagnify
        {...{
          smallImage: {
            isFluidWidth: true,
            src: item.thumbnail
          },
          largeImage: {
            width: 450,
            height: 450,
            src: item.original
          },
          lensStyle: { backgroundColor: "rgba(0,0,0,.6)" }
        }}
        {...{
          isHintEnabled: false,
          enlargedImageContainerDimensions: { width: "100%", height: "100%" },
          // shouldHideHintAfterFirstActivation: true,
          enlargedImagePosition: "over",
          enlargedImageContainerStyle: { Index: 1000 }
        }}
      />
    );
  }


  render() {
    const {
      classes,
      currencyCode,
      product,
      routingStore,
      theme,
      uiStore: { pdpSelectedOptionId, pdpSelectedVariantId },
      width
    } = this.props;

    // Set the default media as the top-level product's media
    // (all media on all variants and objects)
    let pdpMediaItems = product.media;

    // If we have a selected variant (we always should)
    // check to see if media is available, and use this media instead
    // Revert to original media if variant doesn't have specific media
    const selectedVariant = product.variants.find((variant) => variant._id === pdpSelectedVariantId);
    if (selectedVariant) {
      if (selectedVariant.media && selectedVariant.media.length) {
        pdpMediaItems = selectedVariant.media;
      }

      // If we have a selected option, do the same check
      // Will revert to variant check if no option media is available
      if (Array.isArray(selectedVariant.options) && selectedVariant.options.length) {
        const selectedOption = selectedVariant.options.find((option) => option._id === pdpSelectedOptionId);
        if (selectedOption) {
          if (selectedOption.media && selectedOption.media.length) {
            pdpMediaItems = selectedOption.media;
          }
        }
      }
    }

    const { value } = this.state;
    const productPrice = this.determineProductPrice();
    const compareAtDisplayPrice = (productPrice.compareAtPrice && productPrice.compareAtPrice.displayAmount) || null;

    const product_images =  pdpMediaItems.map((src, index) => {
      let small_image = src.URLs.medium;
      //small_image = small_image.replace('http://localhost/', 'http://development-back.apps.ivfuture.tk/');
      let large_image = src.URLs.large;
      //large_image = large_image.replace('http://localhost/', 'http://development-back.apps.ivfuture.tk/');
      return <div key={index} className="product_image">
        <ReactImageMagnify
          {...{
            smallImage: {
              //alt: '',
              isFluidWidth: true,
              //src: src.URLs.medium,
              src: small_image,
              //srcSet: src.URLs.medium + '100vw',
              //sizes: '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'
            },
            largeImage: {
              //src: src.URLs.large,
              src: large_image,
              width: 1000,
              height: 1000
            },
            lensStyle: {backgroundColor: 'rgba(0,0,0,.6)'}
          }}
          {...{
            isHintEnabled: false,
            enlargedImageContainerDimensions: {width: "100%", height: "100%"},
            // shouldHideHintAfterFirstActivation: true,
            enlargedImagePosition: "over",
            enlargedImageContainerStyle: {Index: 1000},
            enlargedImageContainerClassName: "zoomed_image_container",
            enlargedImageClassName: "zoomed_image"
          }}
        />
      </div>
    });

    // Phone size
    if (isWidthDown("sm", width)) {
      return (
        <Fragment>
          <div className="product-details">
            <Grid style={{width:"calc(85.66vw + 40px)", margin:"0 auto"}}>
              <div className={classes.section}>

                <Grid className="media-gallery-column">
                  <div className={classes.section}>
                    {/*<MediaGallery mediaItems={pdpMediaItems} />*/}
                    <ReactSlick  {...{
                      dots: true,
                      infinite: true,
                      speed: 500,
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: false,
                    }}
                    >
                      {product_images}
                      {/*{pdpMediaItems.map((src, index) => (*/}
                        {/*<div key={index} className="product_image">*/}
                          {/*<ReactImageMagnify*/}
                            {/*{...{*/}
                              {/*smallImage: {*/}
                                {/*alt: 'Wristwatch by Versace',*/}
                                {/*isFluidWidth: true,*/}
                                {/*src: src.URLs.medium,*/}
                                {/*//srcSet: src.URLs.medium + '100vw',*/}
                                {/*//sizes: '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'*/}
                              {/*},*/}
                              {/*largeImage: {*/}
                                {/*src: src.URLs.large,*/}
                                {/*width: 1000,*/}
                                {/*height: 1000*/}
                              {/*},*/}
                              {/*lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' }*/}
                            {/*}}*/}
                            {/*{...{*/}
                              {/*isHintEnabled: false,*/}
                              {/*enlargedImageContainerDimensions: { width: "100%", height: "100%" },*/}
                              {/*// shouldHideHintAfterFirstActivation: true,*/}
                              {/*enlargedImagePosition: "over",*/}
                              {/*enlargedImageContainerStyle: { Index: 1000 },*/}
                              {/*enlargedImageContainerClassName: "zoomed_image_container",*/}
                              {/*enlargedImageClassName: "zoomed_image"*/}
                            {/*}}*/}
                          {/*/>*/}
                        {/*</div>*/}
                      {/*))}*/}
                    </ReactSlick>

                  </div>
                  {/*<a className="fav-btn" href="#"><i className="far fa-heart"></i></a>*/}
                </Grid>
                <ProductDetailTitle pageTitle={product.pageTitle} title={product.title} />
                <div className={classes.info}>
                  <ProductDetailVendor>{product.vendor}</ProductDetailVendor>
                </div>
                <div className={classes.info}>
                  <ProductDetailPrice compareAtPrice={compareAtDisplayPrice} isCompact price={productPrice.displayPrice} />
                </div>
              </div>
              <div className={classes.section}>
                <VariantList
                  onSelectOption={this.handleSelectOption}
                  onSelectVariant={this.handleSelectVariant}
                  product={product}
                  selectedOptionId={pdpSelectedOptionId}
                  selectedVariantId={pdpSelectedVariantId}
                  currencyCode={currencyCode}
                  variants={product.variants}
                />

                <div className="quantity" >
                  <ProductDetailAddToCart
                    onClick={this.handleAddToCartClick}
                    selectedOptionId={pdpSelectedOptionId}
                    selectedVariantId={pdpSelectedVariantId}
                    variants={product.variants}
                  />
                </div>
                <div className="rating-btn">
                  <div className="rating">
                    <i className="zmdi zmdi-star"></i>
                    <i className="zmdi zmdi-star"></i>
                    <i className="zmdi zmdi-star"></i>
                  </div>
                  <p>30 reviews</p>
                </div>
                <p className="product-details-p">Order by 9pm to get it tomorrow</p>
              </div>
            </Grid>
          </div>
          <Grid container className="product-offer">
            <Grid item xs={6} sm={6}>
              <img src="/static/images/prod18.jpg"/>
            </Grid>
            <Grid item xs={6} sm={6}>
              <p>Westlab Cleanse Bathing Salts 1000g</p>
              <p>(Free Gift)</p>
              <p>Worth &#163;3</p>
            </Grid>
          </Grid>
          <Grid container spacing={theme.spacing.unit * 5} style={{width:"calc(85.66vw + 40px)", margin:"0 auto"}} className="nav-tabs-prod">
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Product Info" />
                <Tab label="Delivery & Returns" />
              </Tabs>
            </AppBar>
            {value === 0 && <TabContainer>
              <table className="table-prod-details">
                <tbody>
                <tr>
                  <td><strong>Description</strong></td>
                  <td><ProductDetailDescription>{product.description}</ProductDetailDescription></td>
                </tr>
                <tr>
                  <td><strong>Brand</strong></td>
                  <td><ProductDetailVendor>{product.vendor}</ProductDetailVendor></td>
                </tr>
                <tr>
                  <td><strong>Ingredients</strong></td>
                  <td>Rich and luxurious, Decleor Systeme Corps 400ml (Super Size) provides your skin with intensive moisture, whilst enhancing the general appearance of your skin. Formulated with coconut oil, meadowfoam oil, vitamin E ester, D panthenol and moisturising agents, this multi-tasking lotion improves your skin's elasticity and firmness, leaving it with a soft, velvety texture.</td>
                </tr>
                <tr>
                  <td><strong>Application</strong></td>
                  <td>
                    <ul>
                      <li>Apply in gentle massaging motions after a bath or shower</li>
                      <li>Concentrate on areas of extreme dryness</li>
                      <li>Use daily</li>
                    </ul>
                  </td>
                </tr>
                </tbody>
              </table>
            </TabContainer>}
            {value === 1 && <TabContainer>
              <p>Next day delivery available on orders placed before 11pm 7 days a week. Applies to most UK addresses, restrictions apply, no deliveries take place on Bank Holidays.</p>
            </TabContainer>}

          </Grid>
        </Fragment>
      );
    }


    return (
      <Fragment>
        <Grid container spacing={theme.spacing.unit * 5} style={{width:"calc(85.66vw + 40px)", margin:"0 auto"}}>
          <Grid item className={classes.breadcrumbGrid} xs={12}>
            <Breadcrumbs isPDP tagId={routingStore.tagId} product={product} />
          </Grid>
          <Grid item xs={12} sm={6} className="left-prod-col">
            <div className="media-gallery-column">
            <div className={classes.section}>
              {/*<MediaGallery mediaItems={pdpMediaItems} />*/}
              <ReactSlick  {...{
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
              }}
              >
                {product_images}
                  {/*{pdpMediaItems.map((src, index) => (*/}
                    {/*<div key={index} className="product_image">*/}
                      {/*<ReactImageMagnify*/}
                        {/*{...{*/}
                          {/*smallImage: {*/}
                            {/*alt: 'Wristwatch by Versace',*/}
                            {/*isFluidWidth: true,*/}
                            {/*src: src.URLs.medium,*/}
                            {/*//srcSet: src.URLs.medium + '100vw',*/}
                            {/*//sizes: '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'*/}
                          {/*},*/}
                          {/*largeImage: {*/}
                            {/*src: src.URLs.large,*/}
                            {/*width: 1000,*/}
                            {/*height: 1000*/}
                          {/*},*/}
                          {/*lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' }*/}
                        {/*}}*/}
                        {/*{...{*/}
                          {/*isHintEnabled: false,*/}
                          {/*enlargedImageContainerDimensions: { width: "100%", height: "100%" },*/}
                          {/*// shouldHideHintAfterFirstActivation: true,*/}
                          {/*enlargedImagePosition: "over",*/}
                          {/*enlargedImageContainerStyle: { Index: 1000 },*/}
                          {/*enlargedImageContainerClassName: "zoomed_image_container",*/}
                          {/*enlargedImageClassName: "zoomed_image"*/}
                        {/*}}*/}
                      {/*/>*/}
                    {/*</div>*/}
                  {/*))}*/}
              </ReactSlick>
            </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className="product-details">
            <ProductDetailTitle pageTitle={product.pageTitle} title={product.title} />
            <div className={classes.info}>
              <ProductDetailVendor>{product.vendor}</ProductDetailVendor>
            </div>

            <VariantList
              onSelectOption={this.handleSelectOption}
              onSelectVariant={this.handleSelectVariant}
              product={product}
              selectedOptionId={pdpSelectedOptionId}
              selectedVariantId={pdpSelectedVariantId}
              currencyCode={currencyCode}
              variants={product.variants}
            />
            <div className="rating">
              <i className="zmdi zmdi-star"></i>
              <i className="zmdi zmdi-star"></i>
              <i className="zmdi zmdi-star"></i>
              <p>30 reviews</p>
            </div>

            {/*<a className="fav-btn" href="#"><i className="far fa-heart"></i></a> <p>Add to wishlist</p>*/}
            <div className={classes.info}>
              <div className="price" >
                <ProductDetailPrice className={classes.bottomMargin} compareAtPrice={compareAtDisplayPrice} price={productPrice.displayPrice} />
                <p>Order by 9pm to get it tomorrow</p>
              </div>
            </div>

            <div className="quantity" >
              <ProductDetailAddToCart
                onClick={this.handleAddToCartClick}
                selectedOptionId={pdpSelectedOptionId}
                selectedVariantId={pdpSelectedVariantId}
                variants={product.variants}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container className="product-offer">
            <Grid item xs={6} sm={6}>
              <img src="/static/images/prod18.jpg"/>
            </Grid>
            <Grid item xs={6} sm={6}>
                <p>Westlab Cleanse Bathing Salts 1000g</p>
                <p>(Free Gift)</p>
                <p>Worth &#163;3</p>
            </Grid>
        </Grid>
        <Grid container spacing={theme.spacing.unit * 5} style={{width:"calc(85.66vw + 40px)", margin:"0 auto"}}>
          <Grid item xs={6} sm={6}>
            <h2>Product Info</h2>
            <table className="table-prod-details">
              <tbody>
              <tr>
                <td><strong>Description</strong></td>
                <td><ProductDetailDescription>{product.description}</ProductDetailDescription></td>
              </tr>
              <tr>
                <td><strong>Brand</strong></td>
                <td><ProductDetailVendor>{product.vendor}</ProductDetailVendor></td>
              </tr>
              <tr>
                <td><strong>Ingredients</strong></td>
                <td>Rich and luxurious, Decleor Systeme Corps 400ml (Super Size) provides your skin with intensive moisture, whilst enhancing the general appearance of your skin. Formulated with coconut oil, meadowfoam oil, vitamin E ester, D panthenol and moisturising agents, this multi-tasking lotion improves your skin's elasticity and firmness, leaving it with a soft, velvety texture.</td>
              </tr>
              <tr>
                <td><strong>Application</strong></td>
                <td>
                  <ul>
                    <li>Apply in gentle massaging motions after a bath or shower</li>
                    <li>Concentrate on areas of extreme dryness</li>
                    <li>Use daily</li>
                  </ul>
                </td>
              </tr>
              </tbody>
            </table>

          </Grid>
          <Grid item xs={6} sm={6}>
            <h2>Delivery & Returns</h2>
            <p>Next day delivery available on orders placed before 11pm 7 days a week. Applies to most UK addresses, restrictions apply, no deliveries take place on Bank Holidays.</p>
          </Grid>
        </Grid>

      </Fragment>
    );
  }
}

export default ProductDetail;
