'use strict';


/**
* @ngdoc service
* @name cart.module.CartService
* @requires ng.$q
* @requires dateService
* @description 
* This service class contains methods needed from add an item to the cart upto checkout with online purchase.
*/
angular
    .module('cart.module')
    .service('CartService', function ($q, $localStorage, dataService) {

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetShippingMethods
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns available shipping methods for the current cart and customer
         * 
         * @example
         <pre>
            CartService.GetShippingMethods().then(function (data) {
                $scope.shippingMethods = data;
            });
         </pre>
         Resolved Object
         <pre>
         [{
             "code":"flat.flat",
             "title":"Flat Shipping Rate",
             "cost":"5.00",
             "tax_class_id":"9",
             "text":"$5.00",
             "method":"flat",
             "main_title":"Flat Rate"
         }]
         </pre>
         * 
         * @returns {promise} Returns a promise of the array of shipping method objects
         */
        this.GetShippingMethods = function () {

            return dataService.apiSecuredGet('/cart/shipping').then(function (data) {
                if (!data) {
                    $q.reject(data.error);
                }

                var response = {};
                response.methods = [];
                response.choosen_method = data.choosen_method;

                angular.forEach(data.methods, function (value, key) {

                    var taxes = 0.0;
                    for (var i in value.taxes) {
                        taxes += value.taxes[i];
                    }
					if(key == "free_shipping:2"){
						value.id = "free_shipping:2";
						value.label = "Free Shipping";
						value.cost = 0;
						value.method_id = "free_shipping";
					}
                    response.methods.push({
                        code: value.id,
                        title: value.label,
                        cost: value.cost,
                        text: parseFloat(value.cost) + taxes,
                        method: value.method_id,
                        main_title: value.label
                    });

                });

                return $q.all(response);
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetPaymentMethods
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns available payment methods depending on the shipping selection
         * 
         * @example
         <pre>
            CartService.GetPaymentMethods().then(function (data) {
                $scope.paymentMethods = data;
            });
         </pre>
         *Resolved Object
         <pre>
         { 
            as_array : [{
                "code":"cod",
                "title":"Cash On Delivery",
                "terms":"",
                "sort_order":"5"
             }],
             settings : {
             }
         }
         </pre>
         * 
         * @returns {promise} Returns a promise of the array of payment method objects
         */
        this.GetPaymentMethods = function () {

            return dataService.apiSecuredGet('/cart/payment').then(function (data) {
                if (data.error) {
                    $q.reject(data.error);
                }

                var response = {};
                var array = [];

                angular.forEach(data, function (value, key) {
                    array.push({
                        code: key,
                        title: value.title
                    });
                });

                response.as_array = array;
                response.settings = data;

                return $q.all(response);
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#LoadZones
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns an array of zone objects relevent to a country
         * @param {String} country_id Selected country code
         * @returns {promise} Returns a promise of the array of zone objects
         */
        this.LoadZones = function (country_id) {
            return dataService.apiSecuredGet('/store/states', { cc: country_id }).then(function (data) {
                if (!data) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#AddOrder
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Adds a new order to with the current items in the cart session.
         * @param {object} order The order object
         * @param {number} order.shipping_method Shipping method if previously not set
         * @param {number} order.payment_method Payment method if previously not set
         * @param {string} order.order_comments Additional comment for the Order
         * @param {string} order.payment_method  Payment method
         * @param {string} order.shipping_method  Shipping method
         * @param {string} order.billing_first_name  First name
         * @param {string} order.billing_last_name  Last name
         * @param {string} order.billing_company  Company name
         * @param {string} order.billing_email  Email address
         * @param {string} order.billing_phone  Phone
         * @param {string} order.billing_country  Country
         * @param {string} order.billing_address_1  Address line 1
         * @param {string} order.billing_address_2  Address line 2
         * @param {string} order.billing_city  City
         * @param {string} order.billing_state  State
         * @param {string} order.billing_postcode  Postcode
         * @param {string} order.order_comments  Comments
         * 
         * @returns {promise} Promise of the API call
         */
        this.AddOrder = function (order) {

            return dataService.apiSecuredPost('/orders', order).then(function (data) {
                if (data.result && data.result == "failure") {
                    return $q.reject(data.messages);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SetShippingAddress
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Saves user shipping address
         * 
         * @param {object} address Personal info object with shipping address info
         * @param {string} address.city Address City. must be between 2 and 128 characters
         * @param {string} address.postcode Postal code
         * @param {number} address.country_id Country id
         * @param {number} address.state State
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SetShippingAddress = function (address) {

            return dataService.apiSecuredPost('/cart/address', address).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SaveShippingMethod
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Sets shipping method for the shopping cart
         * @param {object} info User selected shipping method
         * @param {string} info.shipping_method Shipping method code, ex : `flat_rate:1`
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SaveShippingMethod = function (info) {
            var shipping_array = {
                shipping_method: []
            };

            shipping_array.shipping_method['0'] = info['shipping_method'];
            return dataService.apiSecuredPost('/cart/shipping', shipping_array).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SavePaymentMethod
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Sets payment method for the shopping cart
         * @param {object} info User selected payment method
         * @param {string} info.payment_method Payment method code, ex : `bacs`
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SavePaymentMethod = function (info) {
            var payment_array = {
                payment_method: []
            };

            payment_array.payment_method['0'] = info['payment_method'];
            return dataService.apiSecuredPost('/cart/payment', payment_array).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#RemoveCartItem
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Removes an item from the cart
         * 
         * @param {number} id Cart item id. `cart_key` is the key given for each cart item. See `cart/` to find the `cart_key`
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.RemoveCartItem = function (id) {
            return dataService.apiSecuredPost('/cart/delete', { cart_key: id }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#UpdateCartItemQuantity
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Updates the item quantity of a cart item
         * 
         * @param {number} id Cart item id. `cart_key` is the key given for each cart item. See `cart/` to find the `cart_key`
         * @param {number} quantity New quantity of the item
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.UpdateCartItemQuantity = function (id, quantity) {
            return dataService.apiSecuredPost('/cart/update_quantity', { cart_key: id, quantity: quantity }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetCart
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns the cart object
         * 
         * @example
         <pre>
         CartService.GetCart().then(function (data) {
            $scope.cart = data;
         });
         </pre>
         *Resolved Object
         <pre>
         {
          "total_item_count": 2,
          "products": [
            {
              "0": "USD",
              "1": "USD",
              "cart_id": "7",
              "product_id": "43",
              "name": "MacBook",
              "model": "Product 16",
              "thumb": "full_image_path75x75.jpg",
              "option": [],
              "quantity": "2",
              "stock": true,
              "shipping": "0",
              "price": "$602.00",
              "total": "$1,204.00",
              "price_clean": 602,
              "total_clean": 1204,
              "reward": 1200
            }
          ],
          "vouchers": [],
          "totals": [
            {
              "title": "Sub-Total",
              "text": "$1,000.00"
            },
            {
              "title": "Eco Tax (-2.00)",
              "text": "$4.00"
            },
            {
              "title": "VAT (20%)",
              "text": "$200.00"
            },
            {
              "title": "Total",
              "text": "$1,204.00"
            }
          ],
          "currency": "USD",
          "total_amount" : "$1,204.00",
          "total_amount_clean" : 1204
         }
         </pre>
         * 
         * @returns {promise} Returns a promise of the cart object
         */
        this.GetCart = function () {
            var cart_object = {}, cart_total = 0, total_item_count = 0;
            cart_object.products = [];

            return dataService.apiSecuredGet('/cart').then(function (data) {


                for (var i in data.cart) {
                    var item = data.cart[i];
                    var temp_item = {};
                    temp_item.cart_id = i;
                    temp_item.name = item.product.name;
                    temp_item.quantity = item.quantity;
                    temp_item.model = "#" + item.product_id;
                    temp_item.price = item.product.price;
                    temp_item.sub_total = item.line_subtotal + item.line_subtotal_tax;
                    temp_item.total = item.product.price * parseFloat(item.quantity);
                    cart_total += temp_item.total;
                    total_item_count += parseFloat(item.quantity);
                    if (item.product && item.product.images[0] && item.product.images[0].shop_thumbnail)
                        temp_item.thumb = item.product.images[0].shop_thumbnail;

                    if (item.variation_id > 0 && item.product && item.product.attributes) {
                        temp_item.option = [];
                        for (var i in item.product.attributes) {
                            temp_item.option.push({
                                name: item.product.attributes[i].name,
                                value: item.product.attributes[i].option
                            });
                        }
                    }

                    cart_object.products.push(temp_item);
                }

                cart_object.total_amount_clean = data.cart_total;
                cart_object.total_amount = data.cart_total;
                cart_object.sub_total_amount = data.cart_subtotal;
                cart_object.total_item_count = total_item_count;
                cart_object.totals = [];

                // coupon discounts
                for (var i in data.coupon_discount_amounts) {
                    cart_object.totals.push({ title: "Coupon (" + i + ")", text: -data.coupon_discount_amounts[i] });
                }

                cart_object.totals.push({ title: "Sub-Total", text: data.subtotal_ex_tax });
                if (data.taxes_total > 0)
                    cart_object.totals.push({ title: "Taxes", text: data.taxes_total });
                if (data.shipping_total > 0)
                    cart_object.totals.push({ title: "Shipping", text: data.shipping_total });
                cart_object.totals.push({ title: "Total", text: data.cart_total });
                
                cart_object._wpnonce = data._wpnonce;

                return cart_object;
            }, function (data) {
                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#AddToCart
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Adds an item to the cart.
         * @param {number} product_id Product id
         * @param {number} quantity Quantity
         * @param {object} depricated Depricated field
         * @param {object} variation_object Variation object
         * 
         * @returns {promise} Returns a promise of the cart object 
         */
        this.AddToCart = function (product_id, quantity, depricated, variation_object) {

            return dataService.apiSecuredPost('/cart/add', { product_id: product_id, quantity: quantity, variation_id: variation_object ? variation_object.id : 0 }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name shop.module.CartService#ApplyCoupon
        * @methodOf cart.module.CartService
        * @kind function
        * 
        * @description
        * Apply coupon to the shopping cart
        * 
        * @param {string} coupon Coupon number or string
        * 
        * @returns {promise} Returns a promise of the update response
        */
        this.ApplyCoupon = function (coupon) {
            return dataService.apiSecuredPost('/cart/coupon', { coupon_code: coupon }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }
    })
