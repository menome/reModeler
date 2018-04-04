var Query = require('decypher').Query;
var bot = require('@menome/botframework');

module.exports = {
    fullSync
}


function fullSync(){
    var query = getDocumentKeysQuery();
    bot.query(query.compile(),query.params())
    .then(function(results){
        results.records.forEach(function(element){
            //bot.logger.info(JSON.stringify(element._fields[0]));
            var tm = {
                "Key":element._fields[0],
                "EventType":"Remodel"
            }
            bot.rabbitPublish(tm);
        })
       
    })
}


function getDocumentKeysQuery(){
    var query = new Query();
    query.match("(f:File) WHERE f.Extension IN ['pdf','doc','docx'] AND f.FullText <> '' RETURN f.Uri as Key")
    return query;
}