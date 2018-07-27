# bamazon 
This is a command line interface app which need to be run using node.js. Leaning on mysql and inquirer packages to do all the work. 

## Levels 

### Level 1 - bamazonCustomer.js 
* Make sure you install the npm packages before running anything. 
* Open bash terminal window and run (node bamazonCustomer.js). 
* You will see all the products available in the store. 
* You will then be asked to enter the item_id and quantity you want to purchase. 
* Once all the input are entered you will see your oder details. 
* If there is not enough quantity in the inventory of the product you selected you will be asked to modify your order and prompted again.

### Level 2- bamazonManager.js
* Open bash terminal window and run (node bamazonManager.js). 
* You will be asked to choose what to do.
* If you choose (View Products For Sale), you will get the results of all available products, then prompted again with the choices.
* If you choose (View Low Inventory), you will get the results of products that have 5 or less item quantity in the stock. Then prompted again with the choices.
* If you choose (Add to Inventory), you will be asked to enter the item_id and quantity to be added, then you will see the results and prompted again.
* If you choose (Add New Product), you will be prompted to eneter all the inputs for the new products then you will see the new product and it's new designated item_id.

## mysql updates
In all the tasks that you will do, the database is updated on the fly. Whether buying, adding inventory, or adding new products. Each time the quantity is updated. 
