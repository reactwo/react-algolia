import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
const styles = (theme) => ({

});

@inject("navItems")
@withStyles(styles, { name: "SkNavigation" })
export class NavigationMobile extends Component {
  static propTypes = {
    classes: PropTypes.object,
    navItems: PropTypes.object
  };

  static defaultProps = {
    classes: {},
    navItems: {}
  };
  state = { mobileMenuEnabled: false };
  // renderNavItem(navItem, index) {
  //   return <NavigationItemDesktop key={index} navItem={navItem} />;
  // }
  handleOutsideClick = () => {

  }

  componentDidMount = () => {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleMobileMenuToggle = () => {
    this.setState({ mobileMenuEnabled: !this.state.mobileMenuEnabled });
  }

  handleMobileMenuClose = () => {
    this.setState({ mobileMenuEnabled: false });
  }

  render() {
    const { navItems, classes } = this.props;

    // if (navItems && navItems.items) {
    //   return  <ul className="menu">{navItems.items.map(this.renderNavItem)}</ul>;
    // }
    return <div>
      <button className="menu-btn-mobile" onClick={this.handleMobileMenuToggle}><img src="/static/images/menu-icon.png" alt=""/> <span>MENU</span></button>
      <div className={this.state.mobileMenuEnabled ? "menu-mobile active" : "menu-mobile"}>
        {/*<IconButton className="close_mobile_menu" onClick={this.handleMobileMenuClose}>*/}
          {/*<i className="fas fa-times "></i>*/}
        {/*</IconButton>*/}
        <ul className="menu">
          <li className="active"><a href="">Women</a>
            <ul className="submenu">
              <li><a href="#" className="parent">New In</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Trending Now</a>
                      <ul>
                        <li><a href="#">Beauty Studio</a></li>
                        <li><a href="#">Clean Beauty</a></li>
                        <li><a href="#">Korean Beauty</a></li>
                        <li><a href="#">Cruelty Free Beauty</a></li>
                        <li><a href="#">Organic & Natural</a></li>
                        <li><a href="#">Premium Beauty</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Beauty Box</a>
                      <ul>
                        <li><a href="#">#LFBEAUTYBOX</a></li>
                        <li><a href="#">Limited editions</a></li>
                        <li><a href="#">Advent Calendar</a></li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Top Brands</a>
                      <ul>
                        <li><a href="#">Burberry</a></li>
                        <li><a href="#">Hugo Boss</a></li>
                        <li><a href="#">Morphe</a></li>
                        <li><a href="#">Cover FX</a></li>
                        <li><a href="#">Lime Crime</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li><a href="#" className="parent">Hair</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                </div>
              </li>
              <li><a href="#" className="parent">Makeup</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Trending Now</a>
                      <ul>
                        <li><a href="#">Beauty Studio</a></li>
                        <li><a href="#">Clean Beauty</a></li>
                        <li><a href="#">Korean Beauty</a></li>
                        <li><a href="#">Cruelty Free Beauty</a></li>
                        <li><a href="#">Organic & Natural</a></li>
                        <li><a href="#">Premium Beauty</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Beauty Box</a>
                      <ul>
                        <li><a href="#">#LFBEAUTYBOX</a></li>
                        <li><a href="#">Limited editions</a></li>
                        <li><a href="#">Advent Calendar</a></li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Top Brands</a>
                      <ul>
                        <li><a href="#">Burberry</a></li>
                        <li><a href="#">Hugo Boss</a></li>
                        <li><a href="#">Morphe</a></li>
                        <li><a href="#">Cover FX</a></li>
                        <li><a href="#">Lime Crime</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li><a href="#" className="parent">Face</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Top Brands</a>
                      <ul>
                        <li><a href="#">Burberry</a></li>
                        <li><a href="#">Hugo Boss</a></li>
                        <li><a href="#">Morphe</a></li>
                        <li><a href="#">Cover FX</a></li>
                        <li><a href="#">Lime Crime</a></li>
                      </ul>
                    </li>
                  </ul>
                </div></li>
              <li><a href="#" className="parent">Body</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Trending Now</a>
                      <ul>
                        <li><a href="#">Beauty Studio</a></li>
                        <li><a href="#">Clean Beauty</a></li>
                        <li><a href="#">Korean Beauty</a></li>
                        <li><a href="#">Cruelty Free Beauty</a></li>
                        <li><a href="#">Organic & Natural</a></li>
                        <li><a href="#">Premium Beauty</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Beauty Box</a>
                      <ul>
                        <li><a href="#">#LFBEAUTYBOX</a></li>
                        <li><a href="#">Limited editions</a></li>
                        <li><a href="#">Advent Calendar</a></li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Top Brands</a>
                      <ul>
                        <li><a href="#">Burberry</a></li>
                        <li><a href="#">Hugo Boss</a></li>
                        <li><a href="#">Morphe</a></li>
                        <li><a href="#">Cover FX</a></li>
                        <li><a href="#">Lime Crime</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li><a href="#" className="parent">Fragrance</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Trending Now</a>
                      <ul>
                        <li><a href="#">Beauty Studio</a></li>
                        <li><a href="#">Clean Beauty</a></li>
                        <li><a href="#">Korean Beauty</a></li>
                        <li><a href="#">Cruelty Free Beauty</a></li>
                        <li><a href="#">Organic & Natural</a></li>
                        <li><a href="#">Premium Beauty</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Beauty Box</a>
                      <ul>
                        <li><a href="#">LFBEAUTYBOX</a></li>
                        <li><a href="#">Limited editions</a></li>
                        <li><a href="#">Advent Calendar</a></li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Top Brands</a>
                      <ul>
                        <li><a href="#">Burberry</a></li>
                        <li><a href="#">Hugo Boss</a></li>
                        <li><a href="#">Morphe</a></li>
                        <li><a href="#">Cover FX</a></li>
                        <li><a href="#">Lime Crime</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li><a href="#" className="parent">Dermalogica</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">Trending Now</a>
                      <ul>
                        <li><a href="#">Beauty Studio</a></li>
                        <li><a href="#">Clean Beauty</a></li>
                        <li><a href="#">Korean Beauty</a></li>
                        <li><a href="#">Cruelty Free Beauty</a></li>
                        <li><a href="#">Organic & Natural</a></li>
                        <li><a href="#">Premium Beauty</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Beauty Box</a>
                      <ul>
                        <li><a href="#">LFBEAUTYBOX</a></li>
                        <li><a href="#">Limited editions</a></li>
                        <li><a href="#">Advent Calendar</a></li>
                      </ul>
                    </li>
                  </ul>
                </div></li>
              <li><a href="#" className="parent">Offers</a>
                <div className="dropdown-menu">
                  <ul>
                    <li><a className="submenu-title" href="#">View All</a></li>
                    <li><a className="submenu-title" href="#">New In</a>
                      <ul>
                        <li><a href="#">Makeup</a></li>
                        <li><a href="#">Skincare</a></li>
                        <li><a href="#">Haircare</a></li>
                        <li><a href="#">Bodycare</a></li>
                        <li><a href="#">Electricals</a></li>
                        <li><a href="#">Fragrance</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Vegan</a></li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Trending Now</a>
                      <ul>
                        <li><a href="#">Beauty Studio</a></li>
                        <li><a href="#">Clean Beauty</a></li>
                        <li><a href="#">Korean Beauty</a></li>
                        <li><a href="#">Cruelty Free Beauty</a></li>
                        <li><a href="#">Organic & Natural</a></li>
                        <li><a href="#">Premium Beauty</a></li>
                      </ul>
                    </li>
                    <li><a className="submenu-title" href="#">Beauty Box</a>
                      <ul>
                        <li><a href="#">#LFBEAUTYBOX</a></li>
                        <li><a href="#">Limited editions</a></li>
                        <li><a href="#">Advent Calendar</a></li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li><a className="submenu-title" href="#">Top Brands</a>
                      <ul>
                        <li><a href="#">Burberry</a></li>
                        <li><a href="#">Hugo Boss</a></li>
                        <li><a href="#">Morphe</a></li>
                        <li><a href="#">Cover FX</a></li>
                        <li><a href="#">Lime Crime</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
          <li><a href="#">Men</a></li>
          <li><a href="#">Brands</a></li>
          <li><a href="#">Beauty Box</a></li>
          <li><a href="#">Blog</a></li>
        </ul>

      </div>
    </div>
    {/* // If navItems.items aren't available, skip rendering of navigation
    // return null; */}
  }
}

export default NavigationMobile;
