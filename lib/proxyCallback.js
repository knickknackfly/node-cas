var _ = require('lodash');

/**
 * Receive callback from CAS server, receiving PGTIOU and PGTID from this request, store them somewhere in sessionStore.
 *
 * @param req
 * @param res
 * @param next
 * @param options
 * @param logger
 */
module.exports = function proxyCallback(req, res, next, options, logger) {
  logger.info('Receiving pgtIou from CAS server...');
  logger.info('req.path', req.path);
  logger.info('req.query', req.query);

  if (!req.query || !req.query.pgtIou || !req.query.pgtId) {
    logger.warn('Receiving pgtIou from CAS server, but with unexpected pgtIou: ' + req.query.pgtIou + ' or pgtId: ' + req.query.pgtId);
    return res.sendStatus(200);
  }

  // TODO: PGTIOU -> PGTID should expire quick
  // _.extend(req.session, {
  //   pgtId: req.query.pgtId
  // })
  return req.sessionStore.set(req.query.pgtIou, { pgtId: req.query.pgtId, cookie: req.session.cookie }, function(err) {
    if (err) {
      logger.error('Error happened when trying to store pgtIou in sessionStore.');
      logger.error(err);

      return res.status(500).send({
        message: 'Error happened when trying to store pgtIou in sessionStore.',
        error: err
      });
    }

    logger.info('Receive and store pgtIou together with pgtId succeed!');

    res.sendStatus(200);
  });
};