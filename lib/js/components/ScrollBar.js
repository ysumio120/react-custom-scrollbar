"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _util = require("../util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollBar = function (_React$Component) {
  _inherits(ScrollBar, _React$Component);

  function ScrollBar(props) {
    _classCallCheck(this, ScrollBar);

    var _this = _possibleConstructorReturn(this, (ScrollBar.__proto__ || Object.getPrototypeOf(ScrollBar)).call(this, props));

    _this.state = {
      isDragging: false,
      isHovering: false,
      verticalThickness: 0,
      horizontalThickness: 0
    };

    _this.onDragY = _this.onDragY.bind(_this);
    _this.onDragX = _this.onDragX.bind(_this);
    _this.onDragStop = _this.onDragStop.bind(_this);
    _this.fadeOutTimeout = _this.props.fadeOutTimeout;
    return _this;
  }

  _createClass(ScrollBar, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {

      var verticalThickness = this.verticalScroll ? this.verticalScroll.getBoundingClientRect().width : 0;
      var horizontalThickness = this.horizontalScroll ? this.horizontalScroll.getBoundingClientRect().height : 0;

      if (this.state.verticalThickness !== verticalThickness || this.state.horizontalThickness !== horizontalThickness) {
        this.setState({ verticalThickness: verticalThickness, horizontalThickness: horizontalThickness });
      }
    }
  }, {
    key: "onDragStart",
    value: function onDragStart(e) {
      e.preventDefault(); // Prevent text selection while dragging

      if (e.target == this.verticalScroll) document.addEventListener("mousemove", this.onDragY);else if (e.target == this.horizontalScroll) document.addEventListener("mousemove", this.onDragX);

      document.addEventListener("mouseup", this.onDragStop);
      this.setState({
        cursorX: e.pageX,
        cursorY: e.pageY,
        isDragging: true,
        currentScrollTop: this.props.scrollY,
        currentScrollLeft: this.props.scrollX
      });
    }
  }, {
    key: "onDragStop",
    value: function onDragStop(e) {
      document.removeEventListener("mouseup", this.onDragStop);
      document.removeEventListener("mousemove", this.onDragX);
      document.removeEventListener("mousemove", this.onDragY);

      this.setState({ isDragging: false });
    }
  }, {
    key: "onDragX",
    value: function onDragX(e) {
      var cursorDiff = e.pageX - this.state.cursorX;
      var scrollBarLengthX = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      var maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
      var scrollX = cursorDiff / (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
      this.props.onDragScrollX(this.state.currentScrollLeft + scrollX);
    }
  }, {
    key: "onDragY",
    value: function onDragY(e) {
      var cursorDiff = e.pageY - this.state.cursorY;
      var scrollBarLengthY = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
      var maxScrollDistY = this.props.visibleHeight - scrollBarLengthY;
      var scrollY = cursorDiff / (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
      this.props.onDragScrollY(this.state.currentScrollTop + scrollY);
    }
  }, {
    key: "getVerticalWidth",
    value: function getVerticalWidth() {
      return this.verticalTrack.offsetWidth;
    }
  }, {
    key: "getHorizontalWidth",
    value: function getHorizontalWidth() {
      return this.horizontalTrack.offsetHeight;
    }
  }, {
    key: "getFadeDuration",
    value: function getFadeDuration() {
      var _props$options = this.props.options,
          fadeInDuration = _props$options.fadeInDuration,
          fadeOutDuration = _props$options.fadeOutDuration;

      var duration = 0;

      if (this.props.showScroll || this.state.isHovering) {
        if (fadeInDuration && fadeInDuration > 0) duration = fadeInDuration / 1000;
      } else if (fadeOutDuration && fadeOutDuration > 0) {
        duration = fadeOutDuration / 1000;
      }

      return duration;
    }
  }, {
    key: "onScrollBarEnter",
    value: function onScrollBarEnter(e) {
      if (!this.props.options.stayVisible) {
        clearTimeout(this.fadeOutTimeout);
        this.setState({ isHovering: true });
      }
    }
  }, {
    key: "onScrollBarLeave",
    value: function onScrollBarLeave(e) {
      var _this2 = this;

      if (!this.props.options.stayVisible) {
        clearTimeout(this.fadeOutTimeout);
        this.fadeOutTimeout = setTimeout(function () {
          _this2.setState({ isHovering: false });
        }, this.props.options.autoFadeOut);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _util$calcX$call = _util2.default.calcX.call(this),
          left = _util$calcX$call.left,
          scrollBarLengthX = _util$calcX$call.scrollBarLengthX,
          offsetX = _util$calcX$call.offsetX;

      var _util$calcY$call = _util2.default.calcY.call(this),
          top = _util$calcY$call.top,
          scrollBarLengthY = _util$calcY$call.scrollBarLengthY,
          offsetY = _util$calcY$call.offsetY;

      var options = this.props.options;

      var containerStyle = {
        position: "relative",
        top: -1 * this.props.visibleHeight + "px",
        opacity: this.props.showScroll || this.state.isHovering || this.state.isDragging ? "1.0" : options.stayVisible ? "1.0" : "0.0",
        transition: "opacity " + this.getFadeDuration() + "s"
      };

      var xScrollBar = _util2.default.merge({ height: options.horizontalThickness }, options.horizontalScrollStyle, {
        position: "absolute",
        width: scrollBarLengthX + "px",
        left: left
      });

      var xTrack = _util2.default.merge({ height: this.state.horizontalThickness }, options.horizontalTrackStyle, {
        position: "absolute",
        width: this.props.visibleWidth - (!options.offsetScroll && scrollBarLengthY > 0 ? this.state.verticalThickness : 0) + "px",
        left: "0",
        top: this.props.visibleHeight + offsetX + "px"
      });

      xTrack = scrollBarLengthX <= 0 ? _util2.default.merge(xTrack, { height: 0 }) : xTrack;

      var yScrollBar = _util2.default.merge({ width: options.verticalThickness }, options.verticalScrollStyle, {
        position: "absolute",
        height: scrollBarLengthY + "px",
        top: top,
        right: "0"
      });

      var yTrack = _util2.default.merge({ width: this.state.verticalThickness }, options.verticalTrackStyle, {
        position: "absolute",
        height: this.props.visibleHeight - (!options.offsetScroll && scrollBarLengthX > 0 ? this.state.horizontalThickness : 0) + "px",
        top: "0",
        right: offsetY + "px"
      });

      yTrack = scrollBarLengthY <= 0 ? _util2.default.merge(yTrack, { width: 0 }) : yTrack;

      return _react2.default.createElement(
        "div",
        { style: containerStyle },
        _react2.default.createElement(
          "div",
          { style: yTrack, ref: function ref(verticalTrack) {
              return _this3.verticalTrack = verticalTrack;
            }, className: options.verticalTrackClassNames, onMouseEnter: this.onScrollBarEnter.bind(this), onMouseLeave: this.onScrollBarLeave.bind(this) },
          _react2.default.createElement("div", {
            className: options.verticalScrollClassNames,
            style: yScrollBar,
            ref: function ref(verticalScroll) {
              return _this3.verticalScroll = verticalScroll;
            },
            onMouseDown: this.onDragStart.bind(this)
          })
        ),
        _react2.default.createElement(
          "div",
          { style: xTrack, ref: function ref(horizontalTrack) {
              return _this3.horizontalTrack = horizontalTrack;
            }, className: options.horizontalTrackClassNames, onMouseEnter: this.onScrollBarEnter.bind(this), onMouseLeave: this.onScrollBarLeave.bind(this) },
          _react2.default.createElement("div", {
            className: options.horizontalScrollClassNames,
            style: xScrollBar,
            ref: function ref(horizontalScroll) {
              return _this3.horizontalScroll = horizontalScroll;
            },
            onMouseDown: this.onDragStart.bind(this)
          })
        )
      );
    }
  }]);

  return ScrollBar;
}(_react2.default.Component);

exports.default = ScrollBar;