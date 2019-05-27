import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@reactioncommerce/components/Button/v1";
import { Router } from "routes";

export default class CheckoutButtons extends Component {
  static propTypes = {
    /**
     * Set to `true` to prevent the button from calling `onClick` when clicked
     */
    isDisabled: PropTypes.bool,
    /**
     * The NextJS route name for the primary checkout button.
     */
    primaryButtonRoute: PropTypes.string,
    /**
     * Text to display inside the button
     */
    primaryButtonText: PropTypes.string,
    /**
     * className for primary checkout button
     */
    primaryClassName: PropTypes.string
  }

  static defaultProps = {
    primaryButtonRoute: "/cart/checkout",
    primaryButtonText: "Checkout"
  };

  handleOnClick = async () => {
    const { primaryButtonRoute, cart: {checkout: {summary}, items} } = this.props;
      
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
   // Router.pushRoute(primaryButtonRoute);
  }

  render() {
    const {
      isDisabled,
      primaryClassName,
      primaryButtonText
    } = this.props;
   

    return (
      <Button
        actionType="important"
        className={primaryClassName}
        isDisabled={isDisabled}
        isFullWidth
        onClick={this.handleOnClick}
      >
        {primaryButtonText}
      </Button>
    );
  }
}
