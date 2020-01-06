class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new Product', thisProduct);
  }
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    app.cart.add(thisProduct);
  }

  renderInMenu() {
    const thisProduct = this;

    const generetedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generetedHTML);

    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */

    const clickableTrigger = thisProduct.accordionTrigger;
    //console.log('TCL: Product -> initAccordion -> clickableTrigger', clickableTrigger);

    /* START: click event listener to trigger */

    clickableTrigger.addEventListener('click', function (event) {
      //console.log('TCL: Product -> initAccordion ->', 'click');

      /* prevent default action for event */

      event.preventDefault();

      /* toggle active class on element of thisProduct */

      thisProduct.element.classList.toggle('active');

      /* find all active products */

      const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);
      //console.log('TCL: Product -> initAccordion -> allActiveProducts', allActiveProducts);

      /* START LOOP: for each active product */

      for (let activeProduct of allActiveProducts) {

        /* START: if the active product isn't the element of thisProduct */

        if (activeProduct !== thisProduct.element) {

          /* remove class active for the active product */

          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);

          /* END: if the active product isn't the element of thisProduct */
        }

        /* END LOOP: for each active product */
      }

      /* END: click event listener to trigger */
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      console.log('Subimited');
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
        console.log('Change in form');
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      //console.log('button clicked');
    });
  }

  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });
  }

  processOrder() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);
    console.log(' : formData', formData);
    thisProduct.params = {};
    let price = thisProduct.data.price;


    // START loop for every "params" elements
    for (let productParam in thisProduct.data.params) {
      //console.log(' : productParam', productParam);
      const param = thisProduct.data.params[productParam];
      //console.log(' : param', param);

      // START loop for every options in param element
      for (let productOption in param.options) {
        const option = param.options[productOption];
        //console.log(' : option', option);

        // Rise price if not default option is checked
        if (formData.hasOwnProperty(productParam) && formData[productParam].indexOf(productOption) > -1) {
          if (!option.default) {
            price = price + option.price;
            console.log(price);
          }
        }

        // Reduce price if default option is not checked
        else if (option.default) {
          price = price - option.price;
          console.log(price);
        }

        // Select all images of selected ingredients
        const selectedElements = thisProduct.imageWrapper.querySelectorAll(`.${productParam}-${productOption}`);

        // Check if option is selected
        if (formData.hasOwnProperty(productParam) && formData[productParam].indexOf(productOption) > -1) {

          if (!thisProduct.params[productParam]) {
            thisProduct.params[productParam] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[productParam].options[productOption] = option.label;

          // add class "active" to html of image
          for (let key of selectedElements) {
            key.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          // remove class "active" to html of image

          for (let key of selectedElements) {
            key.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
        // END loop for every options in param element
      }
      // END loop for every "params" elements
    }
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }
}
