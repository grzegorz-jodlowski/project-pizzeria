/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      thisProduct.processOrder();
      console.log('new Product', thisProduct);


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
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */

      const clickableTrigger = thisProduct.accordionTrigger;
      console.log('TCL: Product -> initAccordion -> clickableTrigger', clickableTrigger);

      /* START: click event listener to trigger */

      clickableTrigger.addEventListener('click', function (event) {
        console.log('TCL: Product -> initAccordion ->', 'click');

        /* prevent default action for event */

        event.preventDefault();

        /* toggle active class on element of thisProduct */

        thisProduct.element.classList.toggle('active');

        /* find all active products */

        const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);
        console.log('TCL: Product -> initAccordion -> allActiveProducts', allActiveProducts);

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
        console.log('button clicked');
      });

    }

    processOrder() {
      const thisProduct = this;

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log(' : formData', formData);

      let price = thisProduct.data.price;

      // START loop for every "params" elements

      // START loop for every options in param element

      // Rise price if not default option is checked

      // Reduce price if default option is not checked

      // END loop for every options in param element

      // END loop for every "params" elements

      thisProduct.priceElem = price;

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
    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
