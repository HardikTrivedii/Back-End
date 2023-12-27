"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("orders_combined", [
      {
        userId: 1,
        productId: 1,
        quantity: 2,
        price: 39.98,
        status: "completed",
        orderDate: new Date().toISOString().split("T")[0],
        totalAmount: 39.98,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more orders as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orders_combined", null, {});
  },
};
