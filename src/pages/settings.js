import React, { Component } from 'react';

class settings extends Component {
  render (
  <script type="text/javascript" src="https://gnusocial.no/js/extlib/jquery.js?version=1.20.9-release"> </script>
  <script type="text/javascript" src="https://gnusocial.no/js/extlib/jquery.form.js?version=1.20.9-release"> </script>
  <script type="text/javascript" src="https://gnusocial.no/js/extlib/jquery-ui/jquery-ui.js?version=1.20.9-release"> </script>
  <script type="text/javascript" src="https://gnusocial.no/js/extlib/jquery.cookie.js?version=1.20.9-release"> </script>
  <script type="text/javascript" src="https://gnusocial.no/js/util.js?version=1.20.9-release"> </script>
  <script type="text/javascript" src="https://gnusocial.no/js/xbImportNode.js?version=1.20.9-release"> </script>
  <script type="text/javascript"> var _peopletagAC = "https://gnusocial.no/main/peopletagautocomplete"; </script>
  <script type="text/javascript"> SN.messages={"showmore_tooltip":"Show more","popup_close_button":"Close popup"} </script>
  <script type="text/javascript"> SN.V = {"urlNewNotice":"https:\/\/gnusocial.no\/notice\/new","xhrTimeout":300000}; </script>
  <script type="text/javascript"> if (window.top !== window.self) { document.write = ""; window.top.location = window.self.location; setTimeout(function () { document.body.innerHTML = ""; }, 1); window.self.onload = function () { document.body.innerHTML = ""; }; } /*]]>*/</script>
  <script type="text/javascript" src="https://gnusocial.no/plugins/OStatus/js/ostatus.js"> </script>
  <script type="text/javascript">
            $(function() {
                $("#mobile-toggle-disable").click(function() {
                    $.cookie("MobileOverride", "0", {path: "/"});
                    window.location.reload();
                    return false;
                });
                $("#mobile-toggle-enable").click(function() {
                    $.cookie("MobileOverride", "1", {path: "/"});
                    window.location.reload();
                    return false;
                });
                $("#navtoggle").click(function () {
                          $("#site_nav_local_views").fadeToggle();
                          var text = $("#navtoggle").text();
                          $("#navtoggle").text(
                          text == "Show Navigation" ? "Hide Navigation" : "Show Navigation");
                });
            }); </script>
  <script type="text/javascript">var maxNoticeLength = 1000 </script>
  <script type="text/javascript">var maxUrlLength = 100 </script>
  <script type="text/javascript" src="https://gnusocial.no/plugins/ClientSideShorten/shorten.js"> </script>
  <script type="text/javascript">$(document).ready(function() { var el = $("#fullname"); if (el.length) { el.focus(); } }); </script>
  );
}


const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(settings);
