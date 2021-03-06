const Model = require('../libraries/model');
const Arena = require('../schemas/arena-schema');
const ChestModel = require('../models/chest-model');
const CardModel = require('../models/card-model');

class ArenaModel extends Model {

  create(input) {
    const newSchemaModel = new this.SchemaModel(input);
    const chestPromise = ChestModel.find({ arena: newSchemaModel.number });
    const cardPromise = CardModel.find({ arena: newSchemaModel.number });
    return Promise.all([chestPromise, cardPromise])
      .then(response => {
        /* eslint-disable no-underscore-dangle */
        newSchemaModel.chests = response[0].map(chest => chest._id);
        newSchemaModel.cardUnlocks = response[1].map(card => card._id);
        /* eslint-enable no-underscore-dangle */
        return newSchemaModel.saveAsync();
      });
  }

}

module.exports = new ArenaModel(Arena);
