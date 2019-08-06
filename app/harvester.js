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
            bot.logger.info(JSON.stringify(element));
            var tm = {
                "Uuid":element._fields[0],
                "Library":"na",
                "Path":"na"
            }
            bot.rabbitPublish(tm);
        })
       
    })
}


function getDocumentKeysQuery(){
    var query = new Query();
    query.match("(f) WHERE f.FullText <> '' RETURN f.Uuid as Key")
    return query;
}