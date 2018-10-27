var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showProducts();
});

function showProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].name + " | " + res[i].department_name + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    runOrder();
  });
}

function runOrder() {
  inquirer
    .prompt({
      message: "What is the id of the item you wish to buy",
      type: "input",
      name: "itemID",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
      {
        message: "How many would you like to buy",
        type: "input",
        name: "itemQty",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      })
    .then(function (answer) {
      var query = "SELECT id,name,department_name,item_quantity FROM products WHERE position ?";
      connection.query(query, [answer.itemID], function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "ID: " +
            res[i].id +
            " || Name: " +
            res[i].name +
            " || Department_name: " +
            res[i].Department_name +
            " || Item_quantity: " +
            res[i].item_quantity
          );
        }
      });
      checkAmount()
    });
}
function checkAmount() {
  var itemQTY = answer.itemQty
  var newQty = res.item_quantity - itemQTY
  if (itemQTY > res.item_quantity) {
    console.log("We are sorry, we cannot complete your order because we dont have that much silly!")
  } else {
    console.log("you just purchased " + itemQTY + " of our amazing " + [answer.itemID] + "!")
    var sql = "UPDATE products SET item_quantity=" + newQty + "WHERE item_quantity =" + res.item_quantity;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    })
  }
}
