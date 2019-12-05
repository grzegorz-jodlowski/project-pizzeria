/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

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

      // generate HTML based on template

      const generetedHTML = templates.menuProduct(thisProduct.data);

      // create element using utils.createElementFromHtml

      thisProduct.element = utils.createDOMFromHTML(generetedHTML);

      // find menu container

      const menuContainer = document.querySelector(select.containerOf.menu);

      // add element to menu

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
      //console.log(' : formData', formData);
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

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.value = settings.amountWidget.defaultValue;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();


      //console.log('amountWidget', thisWidget);
      //console.log('Constructor arguments', element);
    }

    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      // TODO: Add validation

      if (newValue !== thisWidget.input.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }

      thisWidget.input.value = thisWidget.value;

    }

    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element);
      //console.log('new Cart', thisCart);
      thisCart.initActions();
    }

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    }

    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }

    add(menuProduct) {
      const thisCart = this;

      const generetedHTML = templates.cartProduct(menuProduct);

      const generetedDOM = utils.createDOMFromHTML(generetedHTML);

      thisCart.dom.productList.appendChild(generetedDOM);
    }
  }

  const app = {
    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }

    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function () {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}
