import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import { select, settings, classNames } from '../settings.js';


class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    const tables = document.querySelectorAll(select.booking.tables);

    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,

      disable: [
        function (date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      onChange: function (_, dateStr) {
        thisWidget.value = dateStr;
        for (const table of tables) {
          table.classList.remove(classNames.booking.active);
        }
      },
    });
  }

  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }
}

export default DatePicker;
