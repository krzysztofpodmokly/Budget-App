import UIController from '../view/view';
import budgetController from '../model/model';
import '../../styles/style.css';

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