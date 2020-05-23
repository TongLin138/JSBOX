$app.validEnv = $env.app;
var pageTitle = "BUS";
var mainColor = "#508AEB";
var screenHeight = $device.info.screen.height - 75;
getLocation();
function getLocation() {
  $location.fetch({
    handler: function(resp) {
      let lat = resp.lat;
      let lng = resp.lng;
      $location.stopUpdates();
      getCity(lat, lng);
    }
  });
}
async function getCity(lat, lng) {
  let resp = await $http.get(
    `https://api.chelaile.net.cn/goocity/city!localCity.action?s=IOS&gpsAccuracy=65.000000&gpstype=wgs&push_open=1&vc=10554&lat=${lat}&lng=${lng}`
  );
  let data = JSON.parse(resp.data.replace("**YGKJ", "").replace("YGKJ##", ""));
  let cityId = data.jsonr.data.localCity.cityId;
    
  let cityName = $text.URLEncode(data.jsonr.data.localCity.cityName);
  renderMap(lat, lng, cityId, cityName);
}
function renderMap(lat, lng, cityId, cityName) {
  const url = `http://web.chelaile.net.cn/ch5/index.html?showFav=1&switchCity=0&utm_source=webapp_meizu_map&showTopLogo=0&gpstype=wgs&src=webapp_meizu_map&utm_medium=menu&showHeader=1&hideFooter=1&cityName=${cityName}&cityId=${cityId}&supportSubway=1&cityVersion=0&lat=${lat}&lng=${lng}#!/linearound`;
  $ui.render({
    props: {
      type: "view",
      navBarHidden: true,
      bgcolor: $color(mainColor)
    },
    views: [
      {
        type: "label",
        props: {
          text: "",
          id: "close"
        },
        layout: function(make) {
          make.top.inset(30);
          make.right.inset(0);
          make.height.equalTo(30);
          make.width.equalTo(80);
        },
        events: {
          tapped: function() {
            $app.close(0);
          }
        }
      },
      {
        type: "button",
        props: {
          title: pageTitle,
          id: "cityName",
          textColor: $color("#fff"),
          bgcolor: $color("clear"),
          align: $align.center,
          font: $font(20)
        },
        layout: function(make) {
          make.top.inset(30);
          make.centerX.equalTo(0);
          make.height.equalTo(30);
        },
        events: {
          tapped: function() {
            getLocation();
          }
        }
      },
      {
        type: "web",
        props: {
          url: url,
          id: "webView",
          style: `.detail__bottom.show-fav .swap-container, .detail__bottom.show-fav .fav-container, .detail__bottom.show-fav .ads, .detail__bottom.show-fav .same-station-container, .detail__bottom.show-fav .refresh-container{background-color:transparent !important}.container{max-width:none}.page-list .switch-city{display:none;}.page-list .div-imitate-search-ui{padding:9px;}.around-refresh{background-color: ${mainColor}}.page-list .div-imitate-input{text-align: center;}`
        },
        layout: function(make, view) {
          make.top.equalTo($("cityName").bottom);
          make.left.right.equalTo(0);
          make.height.equalTo(screenHeight);
        },
        events: {
          didFinish: function(sender) {
            $delay(1, function() {
              sender.transparent = true;
            });
          }
        }
      }
    ]
  });
}
