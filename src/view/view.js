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

        // budget: data.budget =>
        // totalIncome: data.totals.income,
        // totalExpense: data.totals.expense,
        // percentage: data.percentage
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

export default UIController;