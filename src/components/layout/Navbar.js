import React, { Component, Fragment } from 'react';


class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <div class="w3-top">
        <div class="w3-bar w3-theme-l2 w3-left-align w3-large">
          <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large  w3-hover-white w3-large w3-theme-l1"  onclick="openNav()"><i class="fa fa-bars"></i></a>
          <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Home"><i class="fa fa-home"></i></a>
          <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Account Settings"><i class="fa fa-user"></i></a>
          <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Messages"><i class="fa fa-envelope"></i></a>
          <div class="w3-dropdown-hover w3-hide-small">
            <button class="w3-button w3-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">3</span></button>     
            <div class="w3-dropdown-content  w3-bar-block" style="width:300px">
              <a href="#" class="w3-bar-item w3-button">johndoe21 sent you an invitation 
                <span class="w3-right w3-small w3-opacity">12 seconds ago</span></a>
              <a href="#" class="w3-bar-item w3-button">janedoe44 replied to your post
                <span class="w3-right w3-small w3-opacity">22 minutes ago</span></a>
              <a href="#" class="w3-bar-item w3-button">fediuser98 replied to your post
                <span class="w3-right w3-small w3-opacity">45 minutes ago</span></a>
            </div>
          </div>
          <div class="w3-dropdown-hover w3-hide-small w3-right"> 
            <div class="w3-dropdown-content head_menu  w3-bar-block" style="width:100px"><h4> </h4>
              <button class="w3-button w3-block w3-theme-l2 w3-section" title="Decline"><i class="fa fa-wrench"></i> Settings</button>
              <hr>
              <button class="w3-button w3-block w3-theme-d2 w3-section" title="Decline"><i class="fa fa-sign-out"></i> Logout</button>
            </hr></div>
          </div>
          <a href="#" class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white" title="Search"><i class="fa fa-search"></i></a>
        </div>
      </div>
    );
  }
}


export default Navbar;
