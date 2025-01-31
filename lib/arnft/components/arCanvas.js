import "core-js/modules/es.symbol.js";
import "core-js/modules/es.array.index-of.js";
import "core-js/modules/es.function.bind.js";
import "core-js/modules/es.object.assign.js";
var _excluded = ["arEnabled", "interpolationFactor", "children"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-pascal-case */

import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import { ARNftProvider } from "../arnftContext";
var ARCanvas = function ARCanvas(_ref) {
  var _ref$arEnabled = _ref.arEnabled,
    arEnabled = _ref$arEnabled === void 0 ? true : _ref$arEnabled,
    _ref$interpolationFac = _ref.interpolationFactor,
    interpolationFactor = _ref$interpolationFac === void 0 ? 1 : _ref$interpolationFac,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded);
  var ref = useRef();
  return /*#__PURE__*/React.createElement(React.Fragment, null, arEnabled && /*#__PURE__*/React.createElement("video", {
    id: "ar-video",
    style: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      objectFit: "cover"
    },
    ref: ref,
    loop: true,
    autoPlay: true,
    muted: true,
    playsInline: true
  }), /*#__PURE__*/React.createElement(Canvas, _extends({
    camera: arEnabled ? {
      position: [0, 0, 0]
    } : props.camera
  }, props), /*#__PURE__*/React.createElement(ARNftProvider, {
    video: ref,
    interpolationFactor: interpolationFactor,
    arEnabled: arEnabled
  }, children)));
};
export default /*#__PURE__*/React.memo(ARCanvas);
//# sourceMappingURL=arCanvas.js.map