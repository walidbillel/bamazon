var mysql = require("mysql");
var inquirer = require("inquirer");

// Connecting to the database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// When Connected print connection id then display inventory
connection.connect(function (err) {
    if (err) throw err;
    console.log("\nconnected as id " + connection.threadId + "\n");

    console.log("Loding All The Available Products..........\n");

    setTimeout(displayInventory, 2000);

});


// Function that Prompt the Manager
function promptManager() {

    inquirer.prompt([
        {
            type: "list",
            message: "Here are the options Manager, what would you like to do?",
            name: "thingToDo",
            choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answer) {

        // storing the manager selection 
        var managerPick = answer.thingToDo;

        // Applying the switch method for each case
        switch (managerPick) {

            case "View Products For Sale":
                displayInventory();
                break;

            case "View Low Inventory":
                displayLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            default: console.log("Hey Manager!");
        }

    });
}

// Function That displays Inventory
function displayInventory() {

   

    // Selecting the items
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;

        // Looping over the results to print things neatly
        console.log('------------------------------------------------------------------------------------\n');

        var logVar = '';
        for (var i = 0; i < res.length; i++) {
            logVar = '';
            logVar += 'Item ID: ' + res[i].item_id + '  || ';
            logVar += 'Product Name: ' + res[i].product_name + '  || ';
            logVar += 'Price: $' + res[i].price + '  || ';
            logVar += 'Stock Quantity: ' + res[i].stock_quantity + '\n';

            console.log(logVar);
        }
        console.log("--------------------------------------------------------------------------------------\n");

        // Prompting the manager again
        setTimeout(promptManager, 2000);
    });
}

// Function that displays low inventory
function displayLowInventory() {

    // Selecting from database inventory where stock_quntity is <= 5
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {

        if (err) throw err;

        console.log("\nHere Are All The Products with Inventory lower than 5 ...\n");

        console.log('------------------------------------------------------------------------------------\n');

        // Looping over for a neat print
        var logVar = '';
        for (var i = 0; i < res.length; i++) {
            logVar = '';
            logVar += 'Item ID: ' + res[i].item_id + '  || ';
            logVar += 'Product Name: ' + res[i].product_name + '  || ';
            logVar += 'Price: $' + res[i].price + '  || ';
            logVar += 'Stock Quantity: ' + res[i].stock_quantity + '\n';

            console.log(logVar);

        }

        // Prompting the manager again
        console.log("--------------------------------------------------------------------------------------\n");
        setTimeout(promptManager, 2000);
    });


}

// Function that adds inventory
function addInventory() {

    // Prompting the manager for the item_id and quantity
    inquirer.prompt([
        {
            type: "input",
            name: 'productID',
            message: 'Please Enter the product ID that you would like to add Inventory to?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: 'quantity',
            message: 'How many would you like to add?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
    ]).then(function (input) {

        // storing answers
        var inventoryID = input.productID;
        var inventoryWillingToAdd = input.quantity;

        // Selecting the item-id we want to do updates on
        connection.query('SELECT * FROM products WHERE item_id = ' + inventoryID, function (err, res) {

            if (err) throw err;

            // Adding up to the stock inventory
            var newInventoryQuantity = res[0].stock_quantity + parseFloat(inventoryWillingToAdd);
            

            // Log Results to the Manager Then Prompting again
            for (var i = 0; i < res.length; i++) {
                logVar = '';
                logVar += 'Item ID: ' + res[i].item_id + '  || ';
                logVar += 'Product Name: ' + res[i].product_name + '  || ';
                logVar += 'New Stock Quantity: ' + newInventoryQuantity + '\n';

                console.log('\n------------------------------------------------------------------------------------');
                console.log("You Successfully Added " + inventoryWillingToAdd + " " + res[i].product_name + " To The Stock.\n");
                console.log(logVar);

                setTimeout(promptManager, 2000);
            }

             // Updating Database
            connection.query("UPDATE products SET ? WHERE ?", [
                { stock_quantity: newInventoryQuantity },
                { item_id: inventoryID }
            ], function (err, res) {
                if (err) throw err;

            });
        });
    });


}


function addNewProduct() {

    inquirer.prompt([

        {
            type: 'input',
            name: 'product_name',
            message: 'What is the product name?',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Which department does the new product belong to?',
        },
        {
            type: 'input',
            name: 'price',
            message: 'What is the price per unit?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many items are in stock?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function (input) {

        console.log("\n--------------------------------------------------------------------------------------\n");
        console.log("Adding a New Product");
        console.log('product_name: ' + input.product_name + '\n' + 'department_name: ' + input.department_name + '\n' + 'price: $' + input.price + '\n' + 'stock_quantity: ' + input.stock_quantity + '\n');

        connection.query("INSERT INTO products SET ?",
            {
                product_name: input.product_name,
                department_name: input.department_name,
                price: input.price,
                stock_quantity: input.stock_quantity
            }, function (err, res) {

                if (err) throw err;
                console.log("The New Product Was Successfully Added, You Will See it under Item ID: " + res.insertId + "\n");
                setTimeout(displayInventory, 2000);

            });

    });
}

