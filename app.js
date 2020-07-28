// Storage Controller
const StorageCtrl = (
    function () {

        // Public Methods
        return {
            storeItem: function (item) {
                let items = [];

                // Check If There Are Any Items In Local Storage
                if (localStorage.getItem('items') === null) {
                    items = [];
                    // Push New Item
                    items.push(item);

                    // Set Local Storage
                    localStorage.setItem('items', JSON.stringify(items));

                } else {
                    // Get What Is In The Local Storage
                    items = JSON.parse(localStorage.getItem('items'));

                    // Push New Item
                    items.push(item);

                    // Reset Local Storage
                    localStorage.setItem('items', JSON.stringify(items));
                }
            },
            getItemsFromStorage: function () {
                let items;
                if (localStorage.getItem('items') === null) {
                    items = [];
                } else {
                    items = JSON.parse(localStorage.getItem('items'));
                }
                return items;
            },
            updateItemStorage: function (updatedItem) {
                let items = JSON.parse(localStorage.getItem('items'));
                items.forEach((item, index) => {
                    if (updatedItem.id === item.id) {
                        items.splice(index, 1, updatedItem);
                    }
                });
                localStorage.setItem('items', JSON.stringify(items));
            },
            deleteItemFromStorage: function (id) {
                let items = JSON.parse(localStorage.getItem('items'));
                items.forEach((item, index) => {
                    if (id === item.id) {
                        items.splice(index, 1);
                    }
                });
                localStorage.setItem('items', JSON.stringify(items));
            },
            clearItemsFromStorage: function () {
                localStorage.removeItem('items');
            }
        }
    }
)();

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 600 },
        //     // { id: 1, name: 'Cookie', calories: 400 },
        //     // { id: 2, name: 'Eggs', calories: 100 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to Number
            calories = parseInt(calories);

            // Create New Item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            // Loop Through Items
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                } else {

                }
            });
            return found;
        },
        updateItem: function (name, calories) {
            // Calories To Number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;

        },
        deleteItem: function (id) {
            // Get IDs
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // Get Index
            const index = ids.indexOf(id);

            // Remove Item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            // Loop Through Items and Add Calories
            data.items.forEach(item => {
                total += item.calories;
            });
            // Set Total Calories In Data Structure
            data.totalCalories = total;

            // Return Total
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    // Public Methods
    return {
        populateItemList: function (items) {
            // Loop through the items -> each into li => ul
            let html = '';
            items.forEach(item => {
                html += `<li id='item-${item.id}' class='collection-item'> <strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">
                <i class=" edit-item fas fa-pencil-alt"></i>
            </a></li>`;
            });
            // Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            // Show The List
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // Create li Element & Add Class, ID
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">
            <i class=" edit-item fas fa-pencil-alt"></i>
        </a>`;

            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node List Into Array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content">
                    <i class=" edit-item fas fa-pencil-alt"></i>
                </a>`;
                } else {

                }
            });
        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node LIst Into Array
            listItems = Array.from(listItems);
            listItems.forEach(item => {
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }

    }
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // Load Event Listeners
    const LoadEventListeners = function () {
        // Get UI Selectors 
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable Submit On Enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            } else {

            }
        });

        // Edit Icon Click Event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update Item Event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete Item Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back Button Event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Clear Button Event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Add Item Submit
    const itemAddSubmit = function (e) {
        // Get Form Input from UI Controller
        const input = UICtrl.getItemInput();
        // Check The Input
        if (input.name !== '' && input.calories !== '') {
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add Item To UI List
            UICtrl.addListItem(newItem);

            // Get Total Calories & Show In UI
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // Store in Local Storage
            StorageCtrl.storeItem(newItem);

            // Clear Input Fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click Edit Item
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // Get List Item ID
            const listId = e.target.parentNode.parentNode.id;

            // Break Into Array
            const listIdArr = listId.split('-');

            // Get Actual ID
            const id = parseInt(listIdArr[1]);

            // Get Item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set Current Item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add Item To Form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Update Item Submit
    const itemUpdateSubmit = function (e) {
        // Get Item Input
        const input = UICtrl.getItemInput();

        // Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get Total Calories & Show In UI
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Update Local Storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete Button Event
    const itemDeleteSubmit = function (e) {
        // Get Current Item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete From Data Structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete From UI
        UICtrl.deleteListItem(currentItem.id);

        // Get Total Calories & Show In UI
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Delete From Local Storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear Items Event
    const clearAllItemsClick = function () {
        // Delete All Items From Data Structure
        ItemCtrl.clearAllItems();

        // Get Total Calories & Show In UI
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Remove From UI
        UICtrl.removeItems();

        // Clear From Local Storage
        StorageCtrl.clearItemsFromStorage();

        // Hide List
        UICtrl.hideList();
    }

    //Public Methods
    return {
        init: function () {
            // Clear Edit State / Set Initial State
            UICtrl.clearEditState();

            // Fetch Itemd From Data Structure
            const items = ItemCtrl.getItems();

            // Check If Any Items Exist
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate List With Items
                UICtrl.populateItemList(items);
            }

            // Get Total Calories & Show In UI
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // Load Event Listeners
            LoadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


// Initialize App
App.init();