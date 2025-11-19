let getDistinctResources 

const envDiv = document.getElementById("environment");
fetch('http://localhost:3000/api/distinct')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
    //   console.table(response);
    getDistinctResources = response

    const distinctEnv = getDistinctResources["distinctEnv"]
    displayValues(distinctEnv);
function displayValues(distinctValues) {
    for (key in distinctValues) {
      console.log(distinctValues[key]);
      const envListDiv = document.createElement("div")
      const envListInput = document.createElement("input")
      const envListLabel = document.createElement("label")
      envListDiv.setAttribute("class", "option")
      envListInput.setAttribute("type", "checkbox" )
      envListInput.setAttribute("id", distinctValues[key]);
      envListInput.setAttribute("name", "distinctValues")
      envListInput.setAttribute("value", distinctValues[key])
      envListLabel.setAttribute("for", distinctValues[key])
      envListLabel.innerText = distinctValues[key];
      envDiv.appendChild(envListDiv)
      envListDiv.appendChild(envListInput)
      envListDiv.appendChild(envListLabel)

    }
}
    });;

