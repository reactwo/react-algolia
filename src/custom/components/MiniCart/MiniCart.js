import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import MiniCartComponent from "@reactioncommerce/components/MiniCart/v1";
import CartItems from "custom/components/CartItems";
import CartEmptyMessage from "@reactioncommerce/components/CartEmptyMessage/v1";
import IconButton from "@material-ui/core/IconButton";
import CartIcon from "mdi-material-ui/Cart";
import { Router } from "routes";
import Badge from "@material-ui/core/Badge";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import withCart from "containers/cart/withCart";
import withShop from "containers/shop/withShop";
import trackCartItems from "lib/tracking/trackCartItems";
import track from "lib/tracking/track";
import variantById from "lib/utils/variantById";
import TRACKING from "lib/tracking/constants";

const { CART_VIEWED, PRODUCT_REMOVED } = TRACKING;

const styles = ({ palette, zIndex }) => ({
  popper: {
    marginTop: "0.5rem",
    marginRight: "1rem",
    zIndex: zIndex.modal
  },
  utilsItem: {
    display: "inline-block",
    marginLeft: "15px"
  },
  cart: {
    backgroundColor: palette.common.white
  },
  emptyCart: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 360,
    height: 320,
    border: palette.borders.default
  },
  badge: {
    width: 20,
    height: 20,
    top: 10,
    left: 20
  }
});

@withStyles(styles, { name: "SkMiniCart" })
@withShop
@withCart
@inject("uiStore")
@track()
@observer
export default class MiniCart extends Component {
  static propTypes = {
    cart: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
      checkout: PropTypes.shape({
        itemTotal: PropTypes.shape({
          displayAmount: PropTypes.string
        }),
        taxTotal: PropTypes.shape({
          displayAmount: PropTypes.string
        })
      })
    }),
    classes: PropTypes.object.isRequired,
    hasMoreCartItems: PropTypes.bool,
    loadMoreCartItems: PropTypes.func,
    onChangeCartItemsQuantity: PropTypes.func,
    onRemoveCartItems: PropTypes.func,
    uiStore: PropTypes.shape({
      isCartOpen: PropTypes.bool.isRequired,
      openCart: PropTypes.func.isRequired,
      closeCart: PropTypes.func.isRequired
    })
  }

  constructor(props) {
    super(props);

    this.setPopoverAnchorEl = (element) => {
      this.anchorElement = element;
    };
  }

  state = {
    anchorElement: null
  };

  anchorElement = null

  handlePopperOpen = () => {
    const { cart, uiStore: { openCart } } = this.props;
    openCart();

    // Track a cart view event, only if the cart contains items
    if (cart && Array.isArray(cart.items) && cart.items.length) {
      this.trackAction({ cartItems: cart.items, cartId: cart._id, action: CART_VIEWED });
    }
  }

  handleClick = () => Router.pushRoute("/");

  handleCheckoutButtonClick = async () => {
    this.handleLeavePopper();
    const { checkout: {summary}, items} = this.props.cart
    
    let orderItems = []
    items.map((item, index) => {
      let skuId = Math.floor(Math.random() * (+1 + +10000)) + +1;
      const itemObj = {
        sku: skuId,
        quantity: item.quantity,
        product_name: item.title,
        image_url: item.imageURLs.thumbnail,
        list_price: item.price.amount,
        sale_price: item.price.amount,
        line_total: item.quantity * item.price.amount
    
      }
    
      orderItems.push(itemObj)
      
    })
   
    let randomOrderId = Math.floor(Math.random() * (+1 + +10000)) + +1;

      const orderObj = {
        fascia_id: 1,
        channel_id: 2,
        customer: {
          customer_id: 1,
          session_state: "CUSTOMER_ANONYMOUS",
          email: "chewie100@example.com",
          firstname: "John",
          lastname: "Doe",
          addresses: [
            {
              address_id: "3",
              address_name: "John-HA8 7EL",
              title: "Mr",
              firstname: "John111",
              surname: "Wes",
              address1: "88 Empire Court......", 
              address2: "North End Road",
              town: "WEMBLEY",
              postcode: "HA8 7EL",
              country: "United Kingdom",
              country_id: "GB",
              phone: "020020202",
              mobile: "078888", 
              email: "dfdfdf@dfdfd.com",
              date_created: "07/02/2008 09:44:19", 
              date_modified: "20/12/2017 12:04:19",
              default_address: "1"
            }
          ]
        },
        basket: {
          currency_code: "GBP",
          basket_id: randomOrderId,
          subtotal: summary.itemTotal.amount,   
          subtotal_net: summary.itemTotal.amount,  
          subtotal_vat: 0,
          items: orderItems,    
          shipping_details: {
            address_name: "sd-HA8 7EL",   
            address_id: "20987",
            firstname: "sd",
            surname: "sdfgdfg",  
            title: "Mr",
            phone: "535345435435",  
            fax: "",
            email: "",
            address1: "Paraspar Ltd", 
            address2: "Equity House, 128-136 High Street",
            city: "Edgware",
            county: "",
            postcode: "HA8 7EL",
            country_id: "GB",
            country_name: "United Kingdom"
          }, 
          billing_details: {
            address_name: "John-HA8 7EL",
            address_id: "3",
            firstname: "John111",
            surname: "Wes",
            title: "Mr",
            phone: "020020202",  
            fax: "",
            email: "dfdfdf@dfdfd.com",
            address1: "88 Empire Court......",
            address2: "North End Road", 
            city: "WEMBLEY",
            county: "",
            postcode: "HA8 7EL",
            country_id: "GB",
            country_name: "United Kingdom"        
          }
        }
      }
      const resp = await fetch('http://ec2-18-196-102-59.eu-central-1.compute.amazonaws.com/api/v1/basket', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(orderObj), // body data type must match "Content-Type" header
      }).then(resp => resp.json())
      .then(json => {
       
        if(json.status == "success") {
          window.location = `http://checkout.usingimagination.co.uk.s3-website.eu-west-2.amazonaws.com/?checkoutSessionId=${json.checkoutSessionId}`
        }
      })
    //Router.pushRoute("/cart/checkout");
  }

  handlePopperClose = () => {
    const { closeCart } = this.props.uiStore;
    closeCart(0);
  }

  handleEnterPopper = () => {
    const { openCart } = this.props.uiStore;
    openCart();
  }

  handleLeavePopper = () => {
    const { closeCart } = this.props.uiStore;
    closeCart();
  }

  handleOnClick = () => {
    const { closeCart } = this.props.uiStore;
    closeCart();
    Router.pushRoute("cart");
  }

  handleItemQuantityChange = (quantity, cartItemId) => {
    const { onChangeCartItemsQuantity } = this.props;

    onChangeCartItemsQuantity({ quantity, cartItemId });
  }

  @trackCartItems()
  trackAction() {}

  handleRemoveItem = async (itemId) => {
    const { cart: { items }, onRemoveCartItems } = this.props;
    const { data, error } = await onRemoveCartItems(itemId);

    if (data && !error) {
      const { cart: { _id } } = data.removeCartItems;
      const removedItem = { cart_id: _id, ...variantById(items, itemId) }; // eslint-disable-line camelcase

      // Track removed item
      this.trackAction({ cartItems: removedItem, action: PRODUCT_REMOVED });
    }
  };

  renderMiniCart() {
    const { cart, classes, hasMoreCartItems, loadMoreCartItems } = this.props;
  
    if (cart && Array.isArray(cart.items) && cart.items.length) {
      return (
        <MiniCartComponent
          cart={cart}
          onCheckoutButtonClick={this.handleCheckoutButtonClick}
          components={{
            QuantityInput: "div",
            CartItems: (cartItemProps) => (
              <CartItems
                {...cartItemProps}
                hasMoreCartItems={hasMoreCartItems}
                onRemoveItemFromCart={this.handleRemoveItem}
                onChangeCartItemQuantity={this.handleItemQuantityChange}
                onLoadMoreCartItems={loadMoreCartItems}
              />
            )
          }}
        />
      );
    }

    return (
      <div className={classes.emptyCart}>
        <div>
          <CartEmptyMessage onClick={this.handleClick} />
        </div>
      </div>
    );
  }

  render() {
    const { cart, classes, uiStore } = this.props;
    const { isCartOpen } = uiStore;
    const id = (isCartOpen) ? "simple-popper" : null;

    return (
      <Fragment>
        <li className={classes.utilsItem} ref={this.setPopoverAnchorEl}>
          <IconButton color="inherit"
            onMouseEnter={this.handlePopperOpen}
            onMouseLeave={this.handlePopperClose}
            onClick={this.handleOnClick}
            className="menu-shopping-cart-icon"
          >
            {(cart && cart.totalItemQuantity > 0)
              ? (
                <Badge
                  badgeContent={cart.totalItemQuantity}
                  color="primary"
                  className="counter-bag"
                >
                  <div className="shopping-bag">BAG</div>
                </Badge>
              )
              :
              <div className="no-item-container">
                <span className="no-item-cart">0</span>
                <div className="shopping-bag">BAG</div>
            </div>
            }
          </IconButton>
        </li>

        <Popper
          className={classes.popper}
          id={id}
          open={isCartOpen}
          anchorEl={this.anchorElement}
          transition
          onMouseEnter={this.handleEnterPopper}
          onMouseLeave={this.handleLeavePopper}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <div className={classes.cart}>
                {this.renderMiniCart()}
              </div>
            </Fade>
          )}
        </Popper>
      </Fragment>
    );
  }
}
