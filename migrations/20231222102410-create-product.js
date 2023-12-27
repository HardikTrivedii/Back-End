"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("products", [
      {
        name: "Product 1",
        price: 19.99,
        quantity: 100,
        description: "Description for Product 1",
        image: "product1.jpg",
        addedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more products as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
