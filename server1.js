const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');

const PORT = 3333;

//Load sync files here (cached)
var students = JSON.parse(fs.readFileSync("students.json", {encoding: 'utf8'}));

function escapeHTML(string){
    return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function studentList(){
    return students.map(function(item){return item.name;}).join(",");
}

function studentForm(){
    var form = "<form>";
    form+= " <fieldset>";
    form += "  <label for='name'>Student Name</label>";
    form += " <textarea type='text' name='name'/>";
    form += " </fieldset>";
    form+= " <fieldset>";
    form += "  <label for='eid'>Student Eid</label>";
    form += " <textarea type='text' name='eid'/>";
    form += " </fieldset>";
    form+= " <fieldset>";
    form += "  <label for='description'>Student Description</label>";
    form += " <textarea type='text' name='description'/>";
    form += " </fieldset>";
    form += " <input type='submit'/>";
    form += "</form>";
}

function handleRequest(req, res){

    var uri = url.parse(req.url);
    var params = qs.parse(uri.search.slice(1));

    if(params.name){
        students.push({
            name: escapeHTML(params.name),
            eid: escapeHTML(params.eid),
            description: escapeHTML(params.description)
        });
        fs.writeFile('student.json', JSON.stringify(students));
    }

    var html = "<!doctype html>";
    html += " <html>";
    html += "   <head>";
    html += "       <title>HelloWorld</title>";
    html += "   </head>";
    html += "   <body>";
    html += "      <h1> ";
    html += "       Hello World";
    html += "      </h1>";
    html += studentList();
    html += studentForm();
   // html += Date.now().toString();
    html += "   </body>";
    html += " </html";
    res.setHeader("Content-Type", "text/html");
    res.end(html);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Listening on port " + PORT);
});