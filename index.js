console.log('hi')
let getDistinctResources 
fetch('http://localhost:3000/api/distinct')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
    //   console.table(response);
    getDistinctResources = response

console.log(getDistinctResources)
    });;