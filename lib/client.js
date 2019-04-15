// var request = require('request');
var rp = require('request-promise');
var smallTalkReplies = require('./smalltalk');

function Client(opts) {
    if (!opts.knowledgeBaseId) throw new Error('knowledgeBaseId is required');
    if (!opts.subscriptionKey) throw new Error('subscriptionKey is required');

    var self = this;
    this.knowledgeBaseId = opts.knowledgeBaseId;
    this.subscriptionKey = opts.subscriptionKey;
    this.scoreThreshold = opts.scoreThreshold ? opts.scoreThreshold : 20; // 20 is the default
}

Client.prototype.post = function (opts, cb) {

    if (!opts.question) throw new Error('question is required');
    cb = cb || (() => { });

    var self = this;

   // var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/' + this.knowledgeBaseId + '/generateAnswer';

   // var options = {
    //    method: 'POST',
    //    uri: url,
     //   json: true,
     //   body: opts,
     //   headers: {
     //       "Ocp-Apim-Subscription-Key": this.subscriptionKey,
    //        "Content-Type": "application/json"
    //    }
   // };
    
    
    var host = "https://Your QnA Maker Web.azurewebsites.net/qnamaker";
    var endpoint_key = "Your Endpoint Key";
    var route = "/knowledgebases/Your KB ID/generateAnswer";
    
    var options = {
        method: 'POST',
        uri: host + route,
        json: true,
        body: opts,
        headers: {
          
			'Authorization' : "EndpointKey " + endpoint_key  
        }
    };

    rp(options)
        .then(function (body) {
            // POST succeeded
            var botreply;
            var answerobj = body.answers[0];

            if (answerobj.score >= self.scoreThreshold) {
                // Answer confidence score is acceptable - use QnA maker's response
                var botreplylist = smallTalkReplies[answerobj.answer];
                botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
            }

            return cb(null, botreply);
        })
        .catch(function (err) {
            // POST failed
            return cb(err);
        });
}

module.exports = Client;
