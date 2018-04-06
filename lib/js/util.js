"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var util = {
  // Object.assign() substitute
  merge: function merge() {

    var target = {};

    for (var _len = arguments.length, src = Array(_len), _key = 0; _key < _len; _key++) {
      src[_key] = arguments[_key];
    }

    for (var ob = 0; ob < src.length; ob++) {
      for (var prop in src[ob]) {
        target[prop] = src[ob][prop];
      }
    }

    return target;
  },
  calcScrollBarWidth: function calcScrollBarWidth() {
    // Default Browser ScrollBar Width
    // Chrome, FF, IE ~ 17px  
    // Edge ~ 12px
    // Safari ~ ?
    // Opera ~ ?
    var computedStyle = window.getComputedStyle(this.scrollAreaContent, null);

    // Return values in pixels
    var topBorder = computedStyle.getPropertyValue("border-top-width");
    var bottomBorder = computedStyle.getPropertyValue("border-bottom-width");
    var leftBorder = computedStyle.getPropertyValue("border-left-width");
    var rightBorder = computedStyle.getPropertyValue("border-right-width");

    // Remove 'px' to obtain only number value
    topBorder = parseInt(topBorder.substring(0, topBorder.length - 2), 10);
    bottomBorder = parseInt(bottomBorder.substring(0, bottomBorder.length - 2), 10);
    leftBorder = parseInt(leftBorder.substring(0, leftBorder.length - 2), 10);
    rightBorder = parseInt(rightBorder.substring(0, rightBorder.length - 2), 10);

    var rightScrollWidth = this.scrollAreaContent.offsetWidth - this.scrollAreaContent.clientWidth - leftBorder - rightBorder;
    var bottomScrollWidth = this.scrollAreaContent.offsetHeight - this.scrollAreaContent.clientHeight - topBorder - bottomBorder;

    if (rightScrollWidth == 0) rightScrollWidth = this.state.rightScrollWidth;

    if (bottomScrollWidth == 0) bottomScrollWidth = this.state.bottomScrollWidth;

    return { rightScrollWidth: rightScrollWidth, bottomScrollWidth: bottomScrollWidth };
  },
  calcX: function calcX() {
    var left = void 0,
        scrollBarLengthX = void 0,
        maxScrollDistX = void 0,
        offsetX = void 0;

    var _props$options = this.props.options,
        minHorizontalLength = _props$options.minHorizontalLength,
        offsetScroll = _props$options.offsetScroll;


    minHorizontalLength = minHorizontalLength > 0 ? minHorizontalLength : 20;

    if (this.props.visibleWidth == 0 || this.props.contentWidth == 0 || this.props.visibleWidth >= this.props.contentWidth) {
      scrollBarLengthX = 0;
      left = 0;
      offsetX = 0;
    } else {
      var calcLength = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      scrollBarLengthX = calcLength < minHorizontalLength ? minHorizontalLength : calcLength;
      scrollBarLengthX = scrollBarLengthX >= this.props.visibleWidth ? this.props.visibleWidth : scrollBarLengthX;
      maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
      if (!offsetScroll) {
        offsetX = -1 * this.state.horizontalThickness;
        if (scrollBarLengthX > this.props.visibleWidth - this.state.verticalThickness) {
          scrollBarLengthX = this.props.visibleWidth - this.state.verticalThickness;
        }
        if (this.props.visibleHeight < this.props.contentHeight) {
          maxScrollDistX -= this.state.verticalThickness;
        }
      } else {
        offsetX = 1;
      }

      maxScrollDistX = maxScrollDistX < 0 ? 0 : maxScrollDistX;

      left = this.props.scrollX * (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    }

    return { left: left, scrollBarLengthX: scrollBarLengthX, offsetX: offsetX };
  },
  calcY: function calcY() {
    var top = void 0,
        scrollBarLengthY = void 0,
        maxScrollDistY = void 0,
        offsetY = void 0;

    var _props$options2 = this.props.options,
        minVerticalLength = _props$options2.minVerticalLength,
        offsetScroll = _props$options2.offsetScroll;


    minVerticalLength = minVerticalLength > 0 ? minVerticalLength : 20;

    if (this.props.visibleHeight == 0 || this.props.contentHeight == 0 || this.props.visibleHeight >= this.props.contentHeight) {
      scrollBarLengthY = 0;
      top = 0;
      offsetY = 0;
    } else {
      var calcLength = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
      scrollBarLengthY = calcLength < minVerticalLength ? minVerticalLength : calcLength;
      scrollBarLengthY = scrollBarLengthY >= this.props.visibleHeight ? this.props.visibleHeight : scrollBarLengthY;
      maxScrollDistY = this.props.visibleHeight - scrollBarLengthY;
      if (!offsetScroll) {
        offsetY = 0;
        if (scrollBarLengthY > this.props.visibleHeight - this.state.horizontalThickness) {
          scrollBarLengthY = this.props.visibleHeight - this.state.horizontalThickness;
        }
        if (this.props.visibleWidth < this.props.contentWidth) {
          maxScrollDistY -= this.state.horizontalThickness;
        }
      } else {
        offsetY = -1 * this.state.verticalThickness - 1;
      }

      maxScrollDistY = maxScrollDistY < 0 ? 0 : maxScrollDistY;

      top = this.props.scrollY * (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    }

    return { top: top, scrollBarLengthY: scrollBarLengthY, offsetY: offsetY };
  }
};

exports.default = util;