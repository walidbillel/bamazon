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
    console.log("connected as id " + connection.threadId + "\n");

    displayInventory();


    setTimeout(promptUser, 2000);

});

function displayInventory() {

    console.log("Here Are All The Products Available ...\n");

    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        // Looping over the results to print things neatly

        console.log('------------------------------------------------------------------------------------\n');

        var strOut = '';
        for (var i = 0; i < res.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + res[i].item_id + '  || ';
            strOut += 'Product Name: ' + res[i].product_name + '  || ';
            strOut += 'Price: $' + res[i].price + '\n';

            console.log(strOut);
        }

        console.log("--------------------------------------------------------------------------------------\n");

    });
}

//   Asking the user what they want to do using inquirer
function promptUser() {

    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Please Type in the Item ID of the product you would like to buy",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },

        {
            type: "input",
            name: "itemQuantity",
            message: "How Many Would You like today",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function (answer) {

        // We Want to store those answers in  variables 
        var itemIdSelected = answer.itemId;
        var itemQuantityEntered = answer.itemQuantity;


        console.log(itemIdSelected + "..............." + itemQuantityEntered);

        // Checking up if the id selected exists in the inventory
        connection.query("SELECT * FROM products WHERE ?", { item_id: itemIdSelected }, function (err, data) {

            if (err) throw err;

            // If the id the user selected doesnt exist
            if (data.length === 0) {
                console.log("Error: Invalid Item ID, Please Select A valid one!");

                displayInventory();


                // We do checking the quantity wanted and comparing it ....etc
            } else {
                // Store the product data in a variable
                var productSelectedData = data[0];

            
                // compare it to the quantity available if it's lower or equal we do the updates
                if (itemQuantityEntered <= productSelectedData.stock_quantity) {
                    console.log('Congratulations, the product you requested is in stock! Placing order.....');
                //    Updating our bamazon database
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: productSelectedData.stock_quantity - itemQuantityEntered
                    },
                    {
                        item_id: itemIdSelected
                    }], function (err, data) {
                        if (err) throw err;

                        // logging information for the user
                        console.log('Your order has been placed! Your total is $' + productSelectedData.price * itemQuantityEntered);
                        console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");

                        // end connection
                        connection.end();


                    });

                    // IF Qantity enetered is more than inventory quantity log and prompt user again
                } else {

                    console.log('Sorry, not enough quantity in our inventory.');
                    console.log('Please modify your order.');
                    console.log("\n---------------------------------------------------------------------\n");

                    setTimeout(promptUser, 2000);
                }

            }
        });

    });
}