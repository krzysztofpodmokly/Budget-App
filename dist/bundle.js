/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*=================================================================
                        BUDGET CONTROLLER
===================================================================*/
var budgetController = function () {
    var Expense = function () {
        function Expense(id, description, category, value) {
            _classCallCheck(this, Expense);

            this.id = id;
            this.description = description;
            this.category = category;
            this.value = value;
            this.percentage = -1;
        }

        _createClass(Expense, [{
            key: 'calcPercentage',
            value: function calcPercentage(totalIncome) {

                if (totalIncome > 0) {
                    this.percentage = Math.round(this.value / totalIncome * 100);
                } else {
                    this.percentage = -1;
                }
            }
        }, {
            key: 'getPercentage',
            value: function getPercentage() {
                return this.percentage;
            }
        }]);

        return Expense;
    }();

    var Income = function Income(id, description, category, value) {
        _classCallCheck(this, Income);

        this.id = id;
        this.description = description;
        this.category = category;
        this.value = value;
    };

    //function to support calculating total budget (calculateBudget)


    var calculateTotal = function calculateTotal(type) {
        var sum = 0;
        data.allItems[type].forEach(function (el) {
            return sum += el.value;
        });
        data.totals[type] = sum;
    };

    //Object for storing all incomes and expenses which user submits - structure to receive data
    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function addItem(type, desc, cat, val) {
            var newItem = void 0,
                ID = void 0;

            //condition to check if either EXPENSE or INCOME array from allItems is not empty
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //user submits either Income or Expense
            //UICtrl.getDataInput() type / description / category / value
            if (type === 'income') {
                newItem = new Income(ID, desc, cat, val);
            } else if (type === 'expense') {
                newItem = new Expense(ID, desc, cat, val);
            }

            data.allItems[type].push(newItem);

            //Return new element to be able to save it in a variable and use it in testing
            return newItem;
        },
        deleteItem: function deleteItem(type, id) {
            // id = 6
            // data.allItems[type][id];
            // ids = [1, 2, 4, 6, 8]
            // index = 3

            var ids = data.allItems[type].map(function (el) {
                return el.id;
            });
            var index = ids.indexOf(id); //can be -1 if the value was not found

            if (index > -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function calculateBudget() {

            // 1. Calculate total income and expense
            calculateTotal('expense');
            calculateTotal('income');

            // 2. Calculate the budget: income - expense
            data.budget = data.totals.income - data.totals.expense;

            // 3. Calculate the percentage of income that we spent
            if (data.totals.income > 0) {
                data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function calculatePercentages() {
            data.allItems.expense.forEach(function (el) {
                return el.calcPercentage(data.totals.income);
            });
        },
        getPercentages: function getPercentages() {
            var allPercentages = data.allItems.expense.map(function (el) {
                return el.getPercentage();
            });
            return allPercentages;
        },
        returnBudget: function returnBudget() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            };
        },
        testing: function testing() {
            console.log(data);
        }
    };
}();

exports.default = budgetController;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*=================================================================
                        UI CONTROLLER
===================================================================*/

var UIController = function () {

    var DOMStrings = {
        calculationType: '.calc-type',
        productDescription: '.product-description',
        productCategory: '.category',
        productValue: '.product-value',
        submitBtn: '.submit-btn',
        incomeList: '.income-list',
        expenseList: '.expense-list',
        budgetTotal: '.budget-panel__total',
        budgetIncome: '.budget-panel__income--value',
        budgetExpense: '.budget-panel__expense--value',
        budgetPercentage: '.budget-panel__expense--percentage',
        itemPercentage: '.expense__percentage',
        expenseContainer: '.expense-list',
        incomeContainer: '.income-list',
        dateLabel: '.budget-panel__date',
        confirmIcon: '.confirm-icon'

    };

    var formatNumber = function formatNumber(num, type) {
        var numSplit;
        /*
            + or - before number
            2 decimal points
            
            2310.4567 => + 2 310,46
            2000 => + 2 000,00
        */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        var _numSplit = numSplit,
            _numSplit2 = _slicedToArray(_numSplit, 2),
            int = _numSplit2[0],
            dec = _numSplit2[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ' ' + int.substr(int.length - 3, 3); //input 23510, output 23 510
        }

        var mark = type === 'income' ? '+' : '-';

        return mark + ' ' + int + ',' + dec;
    };

    var nodeListForEach = function nodeListForEach(list, callback) {
        list.forEach(function (el, index) {
            return callback(el, index);
        });
    };

    //Exposing METHODS to the public to use them in GLOBAL CONTROLLER
    return {
        getDataInput: function getDataInput() {

            return {
                type: document.querySelector(DOMStrings.calculationType).value, //Expense or Income
                description: document.querySelector(DOMStrings.productDescription).value,
                category: document.querySelector(DOMStrings.productCategory).value,
                value: parseFloat(document.querySelector(DOMStrings.productValue).value)
            };
        },
        addListItem: function addListItem(obj, type) {
            var html = void 0,
                element = void 0;
            // 1. Create HTML string with placeholder text

            if (type === 'income') {
                element = DOMStrings.incomeList;

                html = '<div class="item" id="income-' + obj.id + '">\n                            <div class="item__description">' + obj.description + '</div>\n                            <div class="item__category">' + obj.category + '</div>\n                            <div class="item__content-box">\n                                <div class="item__value income">' + obj.value + '</div>\n                                <div class="item-remove">\n                                    <button class="delete-btn income">\n                                        <i class="fas fa-trash-alt"></i>\n                                    </button>\n                                </div>\n                            </div>\n                        </div>';
            } else if (type === 'expense') {
                element = DOMStrings.expenseList;

                html = '<div class="item" id="expense-' + obj.id + '">\n                            <div class="item__description">' + obj.description + '</div>\n                            <div class="item__category">' + obj.category + '</div>\n                            <div class="item__content-box">\n                                <div class="item__value expense">' + obj.value + '</div>\n                                <div class="expense__percentage">100%</div>\n                                <div class="item-remove">\n                                    <button class="delete-btn expense">\n                                        <i class="fas fa-trash-alt"></i>\n                                    </button>\n                                </div>\n                            </div>\n                        </div>';
            }

            // 3. Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        clearInputFields: function clearInputFields() {
            var fields = document.querySelectorAll(DOMStrings.productDescription + ', ' + DOMStrings.productValue); //fields is not an array (its a list) that is why it must be changed to an array with slice method

            var fieldsArray = Array.from(fields);
            fieldsArray.forEach(function (el) {
                return el.value = '';
            });

            //document.querySelector(DOMStrings.productDescription).focus();
            fieldsArray[0].focus(); //setting focus to description input
            document.querySelector(DOMStrings.productCategory).value = 'initial'; //setting category value to CHOOSE after every submit
        },


        // budget: data.budget =>
        // totalIncome: data.totals.income,
        // totalExpense: data.totals.expense,
        // percentage: data.percentage
        showBudget: function showBudget(obj) {
            var type = void 0;

            obj.budget > 0 ? type = 'income' : type = 'expense';

            document.querySelector(DOMStrings.budgetTotal).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.budgetIncome).textContent = formatNumber(obj.totalIncome, 'income');
            document.querySelector(DOMStrings.budgetExpense).textContent = formatNumber(obj.totalExpense, 'expense');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetPercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.budgetPercentage).textContent = '-';
            }
        },
        showPercentages: function showPercentages(percentages) {

            //Node list - forEach method does not work for lists
            var fields = document.querySelectorAll(DOMStrings.itemPercentage); //cannot use querySelector because I dont know how many items will be submitted
            console.log(fields);
            nodeListForEach(fields, function (el, index) {
                if (percentages[index] > 0) {
                    el.textContent = percentages[index] + '%';
                } else {
                    el.textContent = '-';
                }
            });
        },
        deleteItem: function deleteItem(id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el); //it is only possible to remove child
        },
        showDate: function showDate() {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function changedType() {

            var fields = document.querySelectorAll(DOMStrings.calculationType + ', \n                ' + DOMStrings.productDescription + ', \n                ' + DOMStrings.productValue + ', \n                ' + DOMStrings.productCategory);

            nodeListForEach(fields, function (el) {
                el.classList.toggle('red-border');
                el.classList.toggle('highlighted-red');
            });

            document.querySelector(DOMStrings.confirmIcon).classList.toggle('red');
        },
        returnStrings: function returnStrings() {
            return DOMStrings;
        }
    };
}();

exports.default = UIController;

/***/ },
/* 2 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _view = __webpack_require__(1);

var _view2 = _interopRequireDefault(_view);

var _model = __webpack_require__(0);

var _model2 = _interopRequireDefault(_model);

__webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*=================================================================
                        GLOBAL CONTROLLER
===================================================================*/

var controller = function (UICtrl, budgetCtrl) {

    var eventListeners = function eventListeners() {
        var allStrings = UICtrl.returnStrings(); //Importing string values from UI Controller

        //MOUSE CLICK
        document.querySelector(allStrings.submitBtn).addEventListener('click', validateData);

        //ENTER CLICK
        document.addEventListener('keypress', function (event) {
            if (event.code === 'Enter') {
                validateData();
            }
        });

        document.querySelector(allStrings.incomeContainer).addEventListener('click', removeItem);
        document.querySelector(allStrings.expenseContainer).addEventListener('click', removeItem);

        document.querySelector(allStrings.calculationType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function updateBudget() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.returnBudget();

        // 3. Display the budget on the UI
        UICtrl.showBudget(budget);
    };

    var updatePercentages = function updatePercentages() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.showPercentages(percentages);
    };

    var validateData = function validateData() {
        // 1. Get input data
        var userInput = UICtrl.getDataInput();

        if (userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0 && userInput.category !== 'initial') {
            // 2. Add the item to the budget controller
            //addItem: function(type, desc, cat, val)
            var newItem = budgetCtrl.addItem(userInput.type, userInput.description, userInput.category, userInput.value);

            //budgetCtrl.testing(newItem)

            // 3. Add the item to the UI
            //addListItem: function(obj, type)
            UICtrl.addListItem(newItem, userInput.type);

            // 4. Clear the fields
            UICtrl.clearInputFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();

            // 6. Return the budget

            // 7. Display the budget on the UI
        }
    };

    var removeItem = function removeItem(event) {
        var itemID = void 0,
            splitID = void 0;

        var isFirefox = typeof InstallTrigger !== 'undefined'; //check browser type

        if (isFirefox) {
            itemID = event.target.parentNode.parentNode.parentNode.id;
        } else {
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        }

        if (itemID) {
            //income-1
            splitID = itemID.split('-'); //[income, 0]

            var _splitID = splitID,
                _splitID2 = _slicedToArray(_splitID, 2),
                type = _splitID2[0],
                ID = _splitID2[1];

            ID = parseInt(ID);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function init() {
            console.log('Application started');
            UICtrl.showDate();
            UICtrl.showBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0
            });
            eventListeners();
        }
    };
}(_view2.default, _model2.default);

controller.init();

/***/ }
/******/ ]);