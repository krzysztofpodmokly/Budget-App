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

export default budgetController;