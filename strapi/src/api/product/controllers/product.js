'use strict';

/**
 *  product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::product.product');

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async create(ctx) {
    Object.assign(ctx.request.body.data, { created_by_id: ctx.state.user.id, updated_by_id: ctx.state.user.id });
    const response = await super.create(ctx);
    return response;
  },
}));
