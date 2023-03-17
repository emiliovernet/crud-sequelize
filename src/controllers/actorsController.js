const db = require ('../database/models');
const controller = {
    list: async (req, res) => {
        try {
            const actors = await db.Actor.findAll({
                include: ['movies']
            });
            // res.render('actorsList', {actors})
            return res.json(actors)
        } catch(error) {
            res.send(error)
        }
    },
}
module.exports = controller;