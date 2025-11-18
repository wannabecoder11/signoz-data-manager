console.log('hi')

fetch('http://localhost:3000/distinct')
.then(function(response) {
    console.log(response.json());
});