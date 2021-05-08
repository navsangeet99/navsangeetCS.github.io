const express = require("express");

const ItemService =require("../../../services/ItemService");

module.exports = () => {
  const router = express.Router();
// after putting the information of an item in the browser and submitting, it says not implemented so we have to fix so that the item is added to the database
  router.get("/:itemId?", async (req, res, next) => {
    try {
      const items = await ItemService.getAll();
      let item = null;

      // The optional param itemId is present
      if (req.params.itemId) { // if item is passed we also fetch this item cuz when we want to edit a given item so we can fill out form 
        item = await ItemService.getOne(req.params.itemId);
      }

      return res.render("admin/item", {
        items,
        item,
      });
    } catch (err) {
      return next(err);
    }
    
  });

  // Save or update item
  router.post("/", async (req, res) => { // when we try to save the item 
    // Massage the passed in form data a bit
    const sku = req.body.sku.trim();
    const name = req.body.name.trim();
    const price = req.body.price.trim();

    // Make sure that the passed data is complete
    if (!sku || !name || !price) { // if one of the field is missing the warning appears on the screen to the users
      req.session.messages.push({
        type: "warning",
        text: "Please enter SKU, name and price!",
      });
      return res.redirect("/admin/item"); // redirect to the admin page
    }

    try {
      // If there was no existing item we now want to create a new item object
      if (!req.body.itemId) {
        await ItemService.create({ sku, name, price });
      } else {
        const itemData = {
          sku,
          name,
          price,
        };
        await ItemService.update(req.body.itemId, itemData);
      }
      req.session.messages.push({
        type: "success",
        text: `The item was ${
          req.body.itemId ? "updated" : "created"
        } successfully!`,
      });
      return res.redirect("/admin/item");
    } catch (err) {
      req.session.messages.push({
        type: "danger",
        text: "There was an error while saving the item!",
      });
      console.error(err);
      return res.redirect("/admin/item");
    }
    
  });

  // Delete item
  router.get("/delete/:itemId", async (req, res) => {

    try {
      await ItemService.remove(req.params.itemId);
    } catch (err) {
      // Error handling
      req.session.messages.push({
        type: "danger",
        text: "There was an error while deleting the item!",
      });
      console.error(err);
      return res.redirect("/admin/item");
    }
    // Let the item knows that everything went fine
    req.session.messages.push({
      type: "success",
      text: "The item was successfully deleted!",
    });
    return res.redirect("/admin/item");
    
  });
  return router;
};
