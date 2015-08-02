var http = require("http");
var fs = require("fs");
var chat = require("./chat");

http.createServer(function(request, response){
    
    switch (request.url){
        case "/":
            sendFile("index.html", response);
            break;

        case "/subscribe":
            chat.subscribe(request, response);
            break;

        case "/publish":
            var body = "";
            request.on("readable", function(){
                body+=request.read();
                if(body.length > 1e4){
                    response.status=413;
                    response.end("Your message is too big");
                }
            }).on("end", function(){
                try{
                    body = JSON.parse(body);
                }catch(e){
                    response.status=400;
                    response.end();
                    return;
                }
                chat.publish(body.message);
                response.end("ok");
            });
            break;

        default:
            response.statusCode = 404;
            response.end("Not found");
    }
}).listen(3030);

function sendFile(fileName, response){
    var fileStream = fs.createReadStream(fileName);
    fileStream.on("error", function(){
        response.statusCode = 500;
        response.end("Server error");
    })

    fileStream.pipe(response);

    response.on("close", function(){
        fileStream.destroy();
    });
}
