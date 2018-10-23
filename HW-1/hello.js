const http = require('http')

const server = http.createServer((req, res) => {

    const {method, url} = req;
    const path = url.replace(/^\/+|\/+$/g, '')

    let chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
    data =  { method, url, path}
    chosenHandler(data, (statusCode, message) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        message = typeof(message) == 'object' ? message : {'message' : 'Object is empty'}
        res.writeHead(statusCode, {
            'Content-Type': 'application/json'
        })
        res.write(JSON.stringify(message));
        res.end();
    })
    

}).listen(3000, () => console.log('Server is listening on 3000 port'))



const handlers = {
    hello : (data, callback) => {
        callback(200, {'message' : 'Witaj świecie! in Polish language that means Hello World'})
    },
    
    notFound : (data, callback) => {
        callback(404);
    }
}
const router = {
    'hello' : handlers.hello
};
