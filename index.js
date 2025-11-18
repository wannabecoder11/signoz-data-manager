console.log('hi')

fetch('http://localhost:3000/api/distinct')
.then(function(response) {
    console.log(response.json());
});