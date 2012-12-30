var RequireJs = require('requirejs');
var build = {
  baseUrl: ".",
  name: "index",
  out: "basbosa.validation-0.0.1.min.js"
}
RequireJs.optimize(build, function(buildResponse) {
  console.log(buildResponse);
});