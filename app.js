//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
.then(() => console.log("MongoDB Connected"))

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new  Item({
  name:"Welcome to your todolist"
})
const item2 = new  Item({
  name:"Hit the + button to add a new item"
})
const item3 = new  Item({
  name:"<-- Hit this to delete an item"
})


async function getItems(){

  const Items = await Item.find({});
  return Items;

}



app.get("/", function(req, res) {

  getItems().then(function(FoundItems){
    if(FoundItems.length == 0){
      Item.insertMany([item1,item2,item3
   
      ]).then(function(){
        console.log("Data inserted")  // Success
      }).catch(function(error){
        console.log(error)      // Failure
      });
      res.redirect("/");
  
    } else{
      res.render("list", { newItem:FoundItems});
    }
    
    

  });

  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");

  
});
app.post("/delete", function(req,res){
  const checkedItemId=req.body.checkbox;
   Item.findByIdAndRemove(checkedItemId)
.then(function (models) {
  console.log(models);
})
.catch(function (err) {
  console.log(err);
});
res.redirect("/");
})
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
