import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import { select, settings, classNames } from '../settings.js';


class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;

  }

  initPlugin() {
    const thisWidget = this;

    // eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input, {
      polyfill: true,     // Boolean, if true, custom markup will be created
      root: document,
      rangeClass: 'rangeSlider',
      disabledClass: 'rangeSlider--disabled',
      fillClass: 'rangeSlider__fill',
      bufferClass: 'rangeSlider__buffer',
      handleClass: 'rangeSlider__handle',
      startEvent: ['mousedown', 'touchstart', 'pointerdown'],
      moveEvent: ['mousemove', 'touchmove', 'pointermove'],
      endEvent: ['mouseup', 'touchend', 'pointerup'],
      vertical: false,    // Boolean, if true slider will be displayed in vertical orientation
      min: null,          // Number , 0
      max: null,          // Number, 100
      step: null,         // Number, 1
      value: null,        // Number, center of slider
      buffer: null,       // Number, in percent, 0 by default
      stick: null,        // [Number stickTo, Number stickRadius] : use it if handle should stick to stickTo-th value in stickRadius
      borderRadius: 10,   // Number, if you use buffer + border-radius in css for looks good,
      // onInit: function () {
      //   console.info('onInit');
      //   this.onSlideStart();
      // },
      onSlideStart: function (position, value) {
        console.info('onSlideStart', 'position: ' + position, 'value: ' + value);

      },
    });


    const tables = document.querySelectorAll(select.booking.tables);

    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;

      for (const table of tables) {
        table.classList.remove(classNames.booking.active);
      }
    });
  }

  updatePlugin() {
    const thisWidget = this;

    // eslint-disable-next-line no-undef
    thisWidget.dom.input.rangeSlider.update({


    }, true);
  }

  parseValue(value) {
    return utils.numberToHour(value);
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}

export default HourPicker;
