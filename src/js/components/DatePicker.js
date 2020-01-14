import BaseWidget from './BaseWidget';
import utils from '../utils.js';
import { select, settings } from '../settings.js';


class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = thisWidget.minDate + settings.datePicker.maxDaysInFuture;

    // TODO initiate plugin flatpickr
  }

  parseValue(value) {
    return value;
  }




}
