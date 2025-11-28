




let getDistinctResources 

fetch('http://localhost:3000/api/distinct')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
    //   console.table(response);
    getDistinctResources = response

    // displayValues(getDistinctResources["distinctEnv"], "environment");
    // displayValues(getDistinctResources["distinctHost"], "host")
    // displayValues(getDistinctResources["distinctCluster"], "cluster")
    // displayValues(getDistinctResources["distinctDeploy"], "deploy")
    // displayValues(getDistinctResources["distinctDaemon"], "daemon")

    });;

function displayValues(distinctValues: string[], resrouceType: string) {
    distinctValues.forEach(item => {

      const envDiv = document.getElementById(`${resrouceType}`);
      // envDiv.removeAttribute("hidden")
      console.log(item);
      const envListDiv = document.createElement("div")
      const envListInput = document.createElement("input")
      const envListLabel = document.createElement("label")
      envListDiv.setAttribute("class", "option")
      envListInput.setAttribute("type", "checkbox" )
      envListInput.setAttribute("id", item);
      envListInput.setAttribute("name", e)
      envListInput.setAttribute("value", item)
      envListLabel.setAttribute("for", item)
      envListLabel.innerText = item;
      envDiv.appendChild(envListDiv)
      envListDiv.appendChild(envListInput)
      envListDiv.appendChild(envListLabel)
      envListDiv.onclick 

    }})
const k8sDiv = document.getElementById(`k8sType`);
k8sDiv?.addEventListener("click", (e) => {

  fetch('http://localhost:3000/api/clusters')
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
      const clusters: Array<string> = response
})
})


const envListDiv = document.createElement("div")
const envListInput = document.createElement("input")
const envListLabel = document.createElement("label")
envListDiv.setAttribute("class", "option")
envListInput.setAttribute("type", "checkbox" )
envListInput.setAttribute("id", distinctValues[key]);
envListInput.setAttribute("name", e)
envListInput.setAttribute("value", distinctValues[key])
envListLabel.setAttribute("for", distinctValues[key])
envListLabel.innerText = distinctValues[key];
envDiv.appendChild(envListDiv)
envListDiv.appendChild(envListInput)
envListDiv.appendChild(envListLabel)
envListDiv.onclick 

