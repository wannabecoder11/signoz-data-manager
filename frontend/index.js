let getDistinctResources 

fetch('http://localhost:3000/api/distinct')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
    //   console.table(response);
    getDistinctResources = response

    displayValues(getDistinctResources["distinctEnv"], "environment");
    displayValues(getDistinctResources["distinctHost"], "host")
    displayValues(getDistinctResources["distinctCluster"], "cluster")
    displayValues(getDistinctResources["distinctDeploy"], "deploy")
    displayValues(getDistinctResources["distinctDaemon"], "daemon")

    });;

function displayValues(distinctValues, valueType) {
    for (key in distinctValues) {
      const envDiv = document.getElementById(`${valueType}`);
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
