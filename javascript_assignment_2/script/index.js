const menuItems = [
    { "id" : 1, "name" : "Veg Biryani", "type" : "Main-course", "price" : 250, "isAvailable" : true},
    { "id" : 2, "name" : "Chicken Biryani", "type" : "Main-course", "cost" : 350, "isAvailable" : false},
    { "id" : 3, "name" : "Lassi", "type" : "beverages", "price" : 50, "isAvailable" : true},
    { "id" : 4, "name" : "Tea", "type" : "beverages", "price" : 30, "isAvailable" : true},
    { "id" : 5, "name" : "Khubani ka Meetha", "type" : "desserts", "price" : 120, "isAvailable" : true},
    { "id" : 6, "name" : "Shahi Tukda", "type" : "desserts", "price" : 100, "isAvailable" : true},
    { "id" : 7, "name" : "Paneer 65 Recipe", "type" : "appetizers", "price" : 180, "isAvailable" : true},
    { "id" : 8, "name" : "French Fries", "type" : "appetizers", "price" : 100, "isAvailable" : true},
    { "id" : 9, "name" : "French Toast", "type" : "appetizers", "price" : 90, "isAvailable" : true},
    { "id" : 10, "name" : "Paneer butter masala + 2 rotis", "type" : "entrees", "price" : 180, "isAvailable" : true},
    { "id" : 11, "name" : "Chicken Pizza", "type" : "Main-course", "price" : 300, "isAvailable" : true},
    { "id" : 12, "name" : "French Fries with Cheese & Jalapenos", "type" : "appetizers", "price" : 120 , "isAvailable" : true}
];

const tables = [
    { "id" : 1 },
    { "id" : 2 },
    { "id" : 3 }
];

class Table{
    constructor(id, orderedItems ) {
        this.id = id;
        this.orderedItems = orderedItems ? orderedItems : new Map();
    }

    renderTable(event) {
        const tableContainer = document.querySelector(".table-container");
        let tableDiv = document.createElement("div");
        tableDiv.classList.add("table-div");
        tableDiv.setAttribute("id", "table" + this.id);
        tableContainer.appendChild(tableDiv);
        tableDiv.addEventListener("dragover", event => this.#dragOverHandler(event));
        tableDiv.addEventListener("drop", (event) => this.#dropHandler(event));
        tableDiv.addEventListener("dragleave", event => this.#dragLeaveHandler(event));
        tableDiv.addEventListener("click", event => this.#showModal(event));
    
        let nameDiv = document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.textContent = "Table-" + this.id;
        tableDiv.appendChild(nameDiv); 

        let summaryDiv = document.createElement("div");
        summaryDiv.classList.add("summary");
        tableDiv.appendChild(summaryDiv); 
        this.#updateSummary(tableDiv);
    }

    #dragOverHandler(event){
        event.preventDefault();
        event.target.classList.add("drag-over");
    }

    #dragLeaveHandler(event){
        event.target.classList.remove("drag-over");
    }

    #dropHandler(event){
        event.target.classList.remove("drag-over");
        let orderedMenuItemJSON  = event.dataTransfer.getData("item");
        const orderedMenuItem = JSON.parse(orderedMenuItemJSON);
        if(orderedMenuItem){
            this.#addOrderedItem(orderedMenuItem);
            this.#updateSummary(event.target);
        }
    }

    #getTotalPrice(){
        let totalPrice = 0;
        for( let [item, quanity] of this.orderedItems.entries()){
            let menuItem = JSON.parse(item);
            totalPrice += menuItem.price * quanity;
        }
        return totalPrice;
    }

    #getTotalItems(){
        let itemsCount = 0;
        let itemsQuantity = this.orderedItems.values();
        for( let itemQuantity of itemsQuantity){
            itemsCount += itemQuantity;
        }
        return itemsCount;
    }

    #updateSummary(tableDiv){
        let summaryDiv = tableDiv.lastElementChild;
        if(!summaryDiv){
            return;
        }
        summaryDiv.textContent = "Rs." + this.#getTotalPrice();
        summaryDiv.textContent += " | Total items: " + this.#getTotalItems();
    }

    #addOrderedItem(orderedItem){
        let currentQuantity = 0;
        const key = JSON.stringify(orderedItem);
        if(this.orderedItems.has(key)){
            currentQuantity = this.orderedItems.get(key);
        }
        this.orderedItems.set(key, ++currentQuantity);
        this.#updateStorage();
    }

    #updateOrderedItem(orderedItem, quanity){
        const key = JSON.stringify(orderedItem);
        this.orderedItems.set(key, quanity);
        this.#updateStorage();
    }

    #generateBill(event){
        if(this.orderedItems){
            let totalBill = this.#getTotalPrice();
            this.orderedItems.clear();
            this.#updateStorage();
            this.#closeModal(event);
            this.#updateSummary(document.getElementById("table"+this.id));
            alert("Bill for table-"+ this.id + " is "+ totalBill.toFixed(2));
        }
    }

    #updateStorage(){
        let jsonString ="";
        if(this.orderedItems){
            jsonString = JSON.stringify([...this.orderedItems]);
        }
        sessionStorage.setItem("table"+this.id, jsonString);
    }

    #showModal(event){
        if(!this.orderedItems || this.orderedItems.size === 0){
            alert("No orders for this table yet!!");
            return;
        }
        let modalContainer = document.querySelector(".modal-container");
        let modalWindow = document.querySelector(".modal-window");
        let generateButton = document.querySelector(".genreate-bill");
        let targetDiv = event.target;
    
        modalWindow.style.transition = "none";
        modalWindow.style.transform = "scale(0,0)";
    
        requestAnimationFrame(function(){
            modalWindow.style.transition = "all 0.5s ease";
            modalWindow.style.transform = "scale(1,1)";
        });
    
        modalContainer.style.pointerEvents = "auto";
        modalContainer.style.opacity = 1;
        let closeButton = document.querySelector(".close");
        closeButton.addEventListener("click", event => {
            this.#closeModal(event);
            this.#updateSummary(targetDiv);
        });
        this.#showModalData();
    }

    #showModalData(){
        let modalTitle = document.querySelector(".modal-title");
        modalTitle.textContent = "Table-" + this.id + " | " + "Order details" ;

        let total = 0;
        let counter = 0;
        if(this.orderedItems){
            for( let [item, quanity] of this.orderedItems.entries()){
                let menuItem = JSON.parse(item);
                this.#showRowData(++counter, menuItem, quanity);
                total += menuItem.price * quanity;
            }
        }
        let dataDiv = document.querySelector(".modal-content");
        if(!dataDiv){
            return;
        }
        let totalDiv = document.createElement("div");
        totalDiv.classList.add("modal-content-row");
        dataDiv.appendChild(totalDiv);      
        
        let orderTotalDiv = document.createElement("div");
        orderTotalDiv.classList.add("order-total");
        totalDiv.appendChild(orderTotalDiv);

        let totalLabelDiv = document.createElement("div");
        totalLabelDiv.classList.add("order-total-label");
        totalLabelDiv.textContent = "Total:";
        orderTotalDiv.appendChild(totalLabelDiv);    
        
        let totalDataDiv = document.createElement("div");
        totalDataDiv.classList.add("order-total-data");
        totalDataDiv.textContent = Number(total).toFixed(2);
        orderTotalDiv.appendChild(totalDataDiv);   

        let billingDiv = document.createElement("div");
        billingDiv.classList.add("modal-content-row");
        dataDiv.appendChild(billingDiv);  

        let billingLabelDiv = document.createElement("div");
        billingLabelDiv.classList.add("billing-label");
        billingLabelDiv.textContent = "Close session (Generate Bill)";
        billingDiv.appendChild(billingLabelDiv);   
        billingLabelDiv.addEventListener("click", event => this.#generateBill(event));
    }

    #showRowData(rowId, menuItem, quanity){
        let dataDiv = document.querySelector(".modal-content");
        if(!dataDiv){
            return;
        }
        let orderItemDiv = document.createElement("div");
        orderItemDiv.classList.add("modal-content-row");
        dataDiv.appendChild(orderItemDiv);

        let rowIdDiv = document.createElement("div");
        rowIdDiv.classList.add("modal-item-id");
        rowIdDiv.textContent = rowId;
        orderItemDiv.appendChild(rowIdDiv);

        let nameDiv = document.createElement("div");
        nameDiv.classList.add("modal-item-name");
        nameDiv.textContent = menuItem.name;
        orderItemDiv.appendChild(nameDiv);

        let priceDiv = document.createElement("div");
        priceDiv.classList.add("modal-item-price");
        priceDiv.textContent = menuItem.price.toFixed(2);
        orderItemDiv.appendChild(priceDiv);

        let quantityDiv = document.createElement("div");
        quantityDiv.classList.add("modal-item-quantity-box");
        orderItemDiv.appendChild(quantityDiv);

        let priceLabelDiv = document.createElement("div");
        priceLabelDiv.classList.add("modal-item-quantity-label");
        priceLabelDiv.textContent = "Number of Servings";
        quantityDiv.appendChild(priceLabelDiv);

        let quantityDataDiv = document.createElement("input");
        quantityDataDiv.classList.add("modal-item-quantity");
        quantityDataDiv.type = "number";
        quantityDataDiv.min = 1;
        quantityDataDiv.max = 10;
        quantityDataDiv.step = 1;
        quantityDataDiv.value = quanity;
        quantityDiv.appendChild(quantityDataDiv);
        quantityDataDiv.addEventListener("input", event => {
            this.#updateOrderedItem(menuItem, Number.parseInt(quantityDataDiv.value));
            this.#updateTotal();
        });

        let deleteItemButton = document.createElement("i");
        deleteItemButton.classList.add("item-delete");
        deleteItemButton.classList.add("fa");
        deleteItemButton.innerHTML = "&#xf014";
        orderItemDiv.appendChild(deleteItemButton);
        deleteItemButton.addEventListener("click", event => this.#deleteOrderedItem(event, menuItem));
    }

    #deleteOrderedItem(event, menuItem){
        if(this.orderedItems){
            this.orderedItems.delete(JSON.stringify(menuItem));
            this.#updateStorage();

            if(this.orderedItems.size === 0){
                this.#closeModal(null);
                this.#updateSummary(document.getElementById("table"+this.id));
                alert("No orders to update!!");
                return;
            }else{
                event.target.closest(".modal-content-row").remove();
            }
            this.#updateTotal();
        }
    }

    #updateTotal(){
        let orderTotalDiv = document.querySelector(".modal-window .order-total-data");
        if(orderTotalDiv){
            orderTotalDiv.innerHTML = this.#getTotalPrice().toFixed(2);
        }
    }

    #closeModal(event){
        let modalContainer = document.querySelector(".modal-container");

        let dataDiv = document.querySelector(".modal-content");
        if(dataDiv){
            dataDiv.innerHTML="";
        }
        modalContainer.style.pointerEvents = "none";
        modalContainer.style.opacity = 0;
        if(event){
            event.preventDefault();
        }
    }
}

class MenuItem{
    constructor(id, name, type, price, isAvailable){
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.isAvailable = isAvailable;
    }
    
    renderMenuItem(event) {
        if(!this.isAvailable){
            return;
        }

        const menuContainer = document.querySelector(".menu-container");
        let menuItemDiv = document.createElement("div");
        menuItemDiv.classList.add("menu-item-div");
        menuItemDiv.classList.add(this.type);
        menuItemDiv.setAttribute("item-div-id", this.id);
        menuItemDiv.setAttribute("draggable", true);
        menuContainer.appendChild(menuItemDiv);
        menuItemDiv.addEventListener("dragstart", event => this.dragStart(event));
        menuItemDiv.addEventListener("dragend", event => this.dragEnd(event));
    
        let nameDiv = document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.textContent = this.name;
        menuItemDiv.appendChild(nameDiv); 

        let priceDiv = document.createElement("div");
        priceDiv.classList.add("price");
        priceDiv.textContent = Number(this.price).toFixed(2).toString();
        menuItemDiv.appendChild(priceDiv); 
    }

    dragStart(event){
        event.dataTransfer.setData("item", JSON.stringify(this));
    }

    dragEnd(event){
        event.dataTransfer.clearData();
    }
}
function renderTables(event){
    Object.values(tables).forEach(item => {
        let storedItems = sessionStorage.getItem("table"+item.id);
        if(storedItems){
            storedItems = new Map(JSON.parse(storedItems));
        }
        let table = new Table(item.id, storedItems);
        table.renderTable(event);
    });
}

function renderMenu(event){
    Object.values(menuItems).forEach(item => {
        let menuItem = new MenuItem(item.id, item.name, item.type, item.price, item.isAvailable);
        menuItem.renderMenuItem();
    });
}

document.addEventListener("DOMContentLoaded", event => {
    renderTables();
    renderMenu();
    activateSearch();
});

const tableSearchField = document.querySelector(".table-search");
const menuSearchField = document.querySelector(".menu-search");
function activateSearch(){
    tableSearchField.addEventListener("keyup", searchTables);
    tableSearchField.addEventListener("search", clearTableSearch);
    menuSearchField.addEventListener("keyup", searchMenu);
    menuSearchField.addEventListener("search", clearMenuSearch);
    tableSearchField.focus();
}

function searchTables(event){
    let searchString = tableSearchField.value.toLowerCase();
    const tableDivs = document.querySelectorAll(".table-div");

    for( let tableDiv of tableDivs){
        let nameNode = tableDiv.querySelector(".name");
        if( nameNode && nameNode.textContent.toLowerCase().includes(searchString)){
            tableDiv.style.display = "block";
        }else{
            tableDiv.style.display = "none";
        }
    }
}

function clearTableSearch(event){
    const tableDivs = document.querySelectorAll(".table-div");

    for( let tableDiv of tableDivs){
        tableDiv.style.display = "block";
    }
}

function searchMenu(event){
    let searchString = menuSearchField.value.toLowerCase();
    const itemDivs = document.querySelectorAll(".menu-item-div");
    for( let itemDiv of itemDivs){
        itemDiv.style.display = "block";
        let nameNode = itemDiv.querySelector(".name");
        if( nameNode && nameNode.textContent.toLowerCase().includes(searchString)){
            itemDiv.style.display = "block";
        }else{
            let isfound;
            for( let nameClass of itemDiv.classList){
                if(nameClass.toLowerCase().includes(searchString)){
                    isfound = true;
                    break;
                }  
            }
            if(isfound){
                itemDiv.style.display = "block";
            }else{
                itemDiv.style.display = "none";
            }
        }
    }
}

function clearMenuSearch(event){
    const itemDivs = document.querySelectorAll(".menu-item-div");
    for( let itemDiv of itemDivs){
        itemDiv.style.display = "block";
    }
}


