//budgetController & UIController are independent, standalone modules
//controller connects those modules

/*=================================================================
                        BUDGET CONTROLLER
===================================================================*/
const budgetController = (function () {

    class Expense {
        constructor(id, description, category, value) {
            this.id = id;
            this.description = description;
            this.category = category;
            this.value = value;
            this.percentage = -1;
        }

        calcPercentage(totalIncome) {

            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
        };

        getPercentage() {
            return this.percentage;
        }
    }

    class Income {
        constructor(id, description, category, value) {
            this.id = id;
            this.description = description;
            this.category = category;
            this.value = value;
        }
    }

    //function to support calculating total budget (calculateBudget)
    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach(el => sum += el.value);
        data.totals[type] = sum;
    }



    //Object for storing all incomes and expenses which user submits - structure to receive data
    const data = {
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
        addItem(type, desc, cat, val) {
            let newItem, ID;

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

        deleteItem(type, id) {
            // id = 6
            // data.allItems[type][id];
            // ids = [1, 2, 4, 6, 8]
            // index = 3

            const ids = data.allItems[type].map(el => el.id);
            const index = ids.indexOf(id); //can be -1 if the value was not found

            if (index > -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget() {

            // 1. Calculate total income and expense
            calculateTotal('expense');
            calculateTotal('income');

            // 2. Calculate the budget: income - expense
            data.budget = data.totals.income - data.totals.expense;

            // 3. Calculate the percentage of income that we spent
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages() {
            data.allItems.expense.forEach(el => el.calcPercentage(data.totals.income));
        },

        getPercentages() {
            const allPercentages = data.allItems.expense.map(el => el.getPercentage());
            return allPercentages;
        },

        returnBudget() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        },

        testing() {
            console.log(data);
        }
    }

})();

/*=================================================================
                        UI CONTROLLER
===================================================================*/

const UIController = (function () {

    const DOMStrings = {
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

    const formatNumber = (num, type) => {
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

        let [int, dec] = numSplit;
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ' ' + int.substr(int.length - 3, 3); //input 23510, output 23 510
        }

        const mark = (type === 'income' ? '+' : '-')

        return `${mark} ${int},${dec}`;

    };

    const nodeListForEach = (list, callback) => {
        list.forEach((el, index) => callback(el, index))
    };

    //Exposing METHODS to the public to use them in GLOBAL CONTROLLER
    return {
        getDataInput() {

            return {
                type: document.querySelector(DOMStrings.calculationType).value, //Expense or Income
                description: document.querySelector(DOMStrings.productDescription).value,
                category: document.querySelector(DOMStrings.productCategory).value,
                value: parseFloat(document.querySelector(DOMStrings.productValue).value)
            }
        },

        addListItem(obj, type) {
            let html, element;
            // 1. Create HTML string with placeholder text

            if (type === 'income') {
                element = DOMStrings.incomeList;

                html = `<div class="item" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="item__category">${obj.category}</div>
                            <div class="item__content-box">
                                <div class="item__value income">${obj.value}</div>
                                <div class="item-remove">
                                    <button class="delete-btn income">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`;

            } else if (type === 'expense') {
                element = DOMStrings.expenseList;

                html = `<div class="item" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="item__category">${obj.category}</div>
                            <div class="item__content-box">
                                <div class="item__value expense">${obj.value}</div>
                                <div class="expense__percentage">100%</div>
                                <div class="item-remove">
                                    <button class="delete-btn expense">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`;

            }

            // 3. Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        clearInputFields() {
            const fields = document.querySelectorAll(`${DOMStrings.productDescription}, ${DOMStrings.productValue}`); //fields is not an array (its a list) that is why it must be changed to an array with slice method

            const fieldsArray = Array.from(fields);
            fieldsArray.forEach(el => el.value = '');

            //document.querySelector(DOMStrings.productDescription).focus();
            fieldsArray[0].focus(); //setting focus to description input
            document.querySelector(DOMStrings.productCategory).value = 'initial'; //setting category value to CHOOSE after every submit

        },


        //        returnBudget => 
        //                budget: data.budget =>
        //                totalIncome: data.totals.income,
        //                totalExpense: data.totals.expense,
        //                percentage: data.percentage
        showBudget(obj) {
            let type;

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

        showPercentages(percentages) {

            //Node list - forEach method does not work for lists
            const fields = document.querySelectorAll(DOMStrings.itemPercentage); //cannot use querySelector because I dont know how many items will be submitted
            console.log(fields)
            nodeListForEach(fields, (el, index) => {
                if (percentages[index] > 0) {
                    el.textContent = percentages[index] + '%';
                } else {
                    el.textContent = '-';
                }

            });
        },

        deleteItem(id) {
            const el = document.getElementById(id);
            el.parentNode.removeChild(el); //it is only possible to remove child
        },

        showDate() {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();

            document.querySelector(DOMStrings.dateLabel).textContent = `${months[month]} ${year}`;

        },

        changedType() {

            const fields = document.querySelectorAll(
                `${DOMStrings.calculationType}, 
                ${DOMStrings.productDescription}, 
                ${DOMStrings.productValue}, 
                ${DOMStrings.productCategory}`);

            nodeListForEach(fields, el => {
                el.classList.toggle('red-border');
                el.classList.toggle('highlighted-red');
            });

            document.querySelector(DOMStrings.confirmIcon).classList.toggle('red');

        },

        returnStrings() {
            return DOMStrings;
        }
    }

})();

/*=================================================================
                        GLOBAL CONTROLLER
===================================================================*/

const controller = (function (UICtrl, budgetCtrl) {

    const eventListeners = function () {
        const allStrings = UICtrl.returnStrings(); //Importing string values from UI Controller

        //MOUSE CLICK
        document.querySelector(allStrings.submitBtn).addEventListener('click', validateData);

        //ENTER CLICK
        document.addEventListener('keypress', event => {
            if (event.code === 'Enter') {
                validateData();
            }
        });

        document.querySelector(allStrings.incomeContainer).addEventListener('click', removeItem);
        document.querySelector(allStrings.expenseContainer).addEventListener('click', removeItem);

        document.querySelector(allStrings.calculationType).addEventListener('change', UICtrl.changedType);


    }

    const updateBudget = () => {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        const budget = budgetCtrl.returnBudget();

        // 3. Display the budget on the UI
        UICtrl.showBudget(budget);

    };

    const updatePercentages = () => {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        const percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.showPercentages(percentages);
    };



    const validateData = () => {
        // 1. Get input data
        const userInput = UICtrl.getDataInput();

        if (userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0 && userInput.category !== 'initial') {
            // 2. Add the item to the budget controller
            //addItem: function(type, desc, cat, val)
            const newItem = budgetCtrl.addItem(userInput.type, userInput.description, userInput.category, userInput.value);

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

    const removeItem = event => {
        let itemID, splitID;

        const isFirefox = typeof InstallTrigger !== 'undefined'; //check browser type

        if (isFirefox) {
            itemID = event.target.parentNode.parentNode.parentNode.id;
        } else {
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        }

        if (itemID) {
            //income-1
            splitID = itemID.split('-'); //[income, 0]
            let [type, ID] = splitID;
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
        init() {
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


})(UIController, budgetController);

controller.init();