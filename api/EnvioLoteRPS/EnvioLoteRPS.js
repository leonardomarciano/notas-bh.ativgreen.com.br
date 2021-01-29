module.exports = {

    /**
     * Send Lote RPS.
     *
     * @param {object} data
     * @param {function} cb
     */
    send: function (data, cb) {

        var request, fs, config, util, cert, key, messageTemplate, envelopeTemplate, 
            envelope, xml, options;

        request = require('request');
        fs = require('fs');
        util = require(__dirname + '/../util.js');

        config = util.getConfig();
        
        cert = fs.readFileSync(config.certPath);
        key = util.readPrivateKeyFromProtectedPem(config.keyPath, 'fv100954');
        messageTemplate = fs.readFileSync(__dirname + '/message.xml', 'utf8');
        envelopeTemplate = fs.readFileSync(__dirname + '/envelope.xml', 'utf8');

        // Fixed data.
        data.cnpjRemetente = config.cnpj;

        // Add sign and Incricao Municipal.
        console.log(data)   
            data.incricaoPrestador = config.incricaoMunicipal;
            data.assinatura = util.buildRPSSign(key, data);

        // Build envelope.
        envelope = util.buildEnvelope(cert, key, data, messageTemplate, envelopeTemplate);
        
       cb(envelope)


        // // Build request options.
        // options = util.buildRequestOptions(cert, key, envelope);

        // // Send response.
        // request(options, function (error, response, body) {
        //     util.handleResponse(error, body, cb, data.attachments);
        // });

      
    }
};
