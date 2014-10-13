
/*jshint maxstatements:50 */

'use strict';
var uuid = require('node-uuid');
var logger = require('log4js').getLogger('routes/actors');

exports = module.exports = function (db) {

    if (!db) {
        throw new Error('No database configured');
    }

    var exports = {};

    exports.addActor = function (req, res) {
        var node = db.createNode(req.body);
        node.data.type = 'actor';
        node.data.id = uuid.v4();
        logger.debug('Adding a new actor');
        node.save(function (err, savedNode) {
            if (err) {
                logger.error('Failed to add actor: %s', err);
                return res.status(500).send();
            }
            var fault = savedNode.data.title.$dirty;
            var fault1 = savedNode.data.title.$invalid;
            var fault2 = savedNode.data.title === '';
            if (fault || fault1 || fault2) {
                logger.error('Failed to add actor: %s', err);
                return res.status(422).send();
            }
            logger.debug('Added new actor with id %s', savedNode.data.id);
            //res.status(201)
            //    .location(getAbsoluteUriBase(req) +
            //        '/actors/' + node.data.id)
            //    .send(savedNode.data);
        });
    };
};