var clients = [];

exports.subscribe = function(request, response){
    clients.push(response);

    response.on("close", function(){
        clients.splice(clients.indexOf(response), 1)
    })
};

exports.publish = function(message){
    clients.forEach(function(response){
        response.body = message;
    });

    clients = [];
};
/*
exports.subscribe = function(request, response){
    clients.push(response);

    response.on("close", function(){
        clients.splice(clients.indexOf(response), 1)
    })
};

exports.publish = function(message){
    clients.forEach(function(response){
        response.end(message);
    });

    clients = [];
};*/
