function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.symbol.to-primitive.js";
import "core-js/modules/es.array.for-each.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.date.to-primitive.js";
import "core-js/modules/es.number.constructor.js";
import "core-js/modules/es.object.define-property.js";
import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.for-each.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/web.url.js";
import "core-js/modules/web.url.to-json.js";
import "core-js/modules/web.url-search-params.js";
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable camelcase */
import { isMobile, setMatrix } from "./utils";
var workerScript = "./worker/arnft.worker.js";
export var ARNft = /*#__PURE__*/function () {
  function ARNft(cameraParamUrl, video, renderer, camera, onLoaded, interpolationFactor) {
    var _this = this;
    _classCallCheck(this, ARNft);
    this.inputWidth = video.videoWidth;
    this.inputHeight = video.videoHeight;
    this.cameraParamUrl = cameraParamUrl;
    this.video = video;
    this.renderer = renderer;
    this.camera = camera;
    this.onLoaded = onLoaded;
    this.camera.matrixAutoUpdate = false;
    this.markers = [];
    this.canvasProcess = document.createElement("canvas");
    this.contextProcess = this.canvasProcess.getContext("2d");
    this.initRenderer();
    this.worker = new Worker(new URL(workerScript, import.meta.url));
    this.worker.onmessage = function (e) {
      return _this.onWorkerMessage(e);
    };
    this.worker.postMessage({
      type: "load",
      pw: this.pw,
      ph: this.ph,
      cameraParamUrl: this.cameraParamUrl,
      interpolationFactor: interpolationFactor
    });
  }
  return _createClass(ARNft, [{
    key: "initRenderer",
    value: function initRenderer() {
      var pScale = 320 / Math.max(this.inputWidth, this.inputHeight / 3 * 4);
      var sScale = isMobile() ? window.outerWidth / this.inputWidth : 1;
      var sw = this.inputWidth * sScale;
      var sh = this.inputHeight * sScale;
      this.w = this.inputWidth * pScale;
      this.h = this.inputHeight * pScale;
      this.pw = Math.max(this.w, this.h / 3 * 4);
      this.ph = Math.max(this.h, this.w / 4 * 3);
      this.ox = (this.pw - this.w) / 2;
      this.oy = (this.ph - this.h) / 2;
      this.canvasProcess.style.clientWidth = this.pw + "px";
      this.canvasProcess.style.clientHeight = this.ph + "px";
      this.canvasProcess.width = this.pw;
      this.canvasProcess.height = this.ph;
      console.log("processCanvas:", this.canvasProcess.width, this.canvasProcess.height);
      this.renderer.setSize(sw, sh, false); // false -> do not update css styles
    }
  }, {
    key: "loadMarkers",
    value: function loadMarkers(markers) {
      markers.forEach(function (marker) {
        return marker.root.matrixAutoUpdate = false;
      });
      this.markers = markers;
      this.worker.postMessage({
        type: "loadMarkers",
        markers: markers.map(function (marker) {
          return marker.url;
        })
      });
    }
  }, {
    key: "process",
    value: function process() {
      this.contextProcess.fillStyle = "black";
      this.contextProcess.fillRect(0, 0, this.pw, this.ph);
      this.contextProcess.drawImage(this.video, 0, 0, this.inputWidth, this.inputHeight, this.ox, this.oy, this.w, this.h);
      var imageData = this.contextProcess.getImageData(0, 0, this.pw, this.ph);
      this.worker.postMessage({
        type: "process",
        imagedata: imageData
      }, [imageData.data.buffer]);
    }
  }, {
    key: "onWorkerMessage",
    value: function onWorkerMessage(e) {
      var msg = e.data;
      switch (msg.type) {
        case "loaded":
          {
            var proj = JSON.parse(msg.proj);
            var ratioW = this.pw / this.w;
            var ratioH = this.ph / this.h;
            var f = 2000.0;
            var n = 0.1;
            proj[0] *= ratioW;
            proj[5] *= ratioH;
            proj[10] = -(f / (f - n));
            proj[14] = -(f * n / (f - n));
            setMatrix(this.camera.projectionMatrix, proj);
            this.onLoaded(msg);
            break;
          }
        case "markersLoaded":
          {
            if (msg.end === true) {
              console.log(msg);
            }
            this.process();
            break;
          }
        case "markerInfos":
          {
            this.onMarkerInfos(msg.markers);
            break;
          }
        case "found":
          {
            // console.log("found", msg)
            this.onFound(msg);
            break;
          }
        case "lost":
          {
            // console.log("lost", msg)
            this.onLost(msg);
            break;
          }
        case "processNext":
          {
            this.process();
            break;
          }
      }
    }
  }, {
    key: "onMarkerInfos",
    value: function onMarkerInfos(markerInfos) {
      var _this2 = this;
      // console.log("markerInfos", markerInfos)
      markerInfos.forEach(function (markerInfo) {
        _this2.markers[markerInfo.id].root.children[0].position.x = markerInfo.width / markerInfo.dpi * 2.54 * 10 / 2.0;
        _this2.markers[markerInfo.id].root.children[0].position.y = markerInfo.height / markerInfo.dpi * 2.54 * 10 / 2.0;
      });
    }
  }, {
    key: "onFound",
    value: function onFound(msg) {
      var matrix = JSON.parse(msg.matrixGL_RH);
      var index = JSON.parse(msg.index);
      setMatrix(this.markers[index].root.matrix, matrix);
      this.markers.forEach(function (marker, i) {
        marker.root.visible = i === index;
      });
    }
  }, {
    key: "onLost",
    value: function onLost(msg) {
      this.markers.forEach(function (marker) {
        marker.root.visible = false;
      });
    }
  }]);
}();
//# sourceMappingURL=arnft.js.map