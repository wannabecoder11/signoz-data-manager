




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

function displayValues(distinctValues: string[], resourceType: string) {
      document.getElementById(`${resourceType}Keys`)?.toggleAttribute("hidden")

      const envDiv = document.getElementById(`${resourceType}`);
      if (envDiv) {
      envDiv.replaceChildren();
      }
  distinctValues.forEach(item => {
      console.log(item);
      const envListDiv = document.createElement("div")
      const envListInput = document.createElement("input")
      const envListLabel = document.createElement("label")
      envListDiv.setAttribute("class", "option")
      envListInput.setAttribute("type", "checkbox" )
      envListInput.setAttribute("id", item);
      envListInput.setAttribute("name", resourceType)
      envListInput.setAttribute("value", item)
      envListLabel.setAttribute("for", item)
      if (envDiv) {

        envDiv.appendChild(envListDiv)

        envDiv.toggleAttribute("hidden")
        envListLabel.innerText = item;
        envListDiv.appendChild(envListInput)
        envListDiv.appendChild(envListLabel)
      }
    })}
function displayClusters(distinctValues: string[], resourceType: string) {
  document.getElementById(`${resourceType}Keys`)?.toggleAttribute("hidden")
  const envDiv = document.getElementById(`${resourceType}`);
  if (envDiv) {
      envDiv.replaceChildren();
      envDiv.toggleAttribute("hidden")
  }
  distinctValues.forEach(item => {
      // const envDiv = document.getElementById(`${resourceType}`);
      // console.log(item);
      const envListDiv = document.createElement("div")
      const envListInput = document.createElement("input")
      const envListLabel = document.createElement("label")
      envListDiv.setAttribute("class", "option")
      envListInput.setAttribute("type", "checkbox" )
      envListInput.setAttribute("id", item);
      envListInput.setAttribute("name", resourceType)
      envListInput.setAttribute("value", item)
      envListLabel.setAttribute("for", item)
      envListInput.addEventListener("change", (e) => {
        const checkboxes = (document.querySelectorAll(`input[name=${resourceType}]:checked`));
        const selectedClusters =  Array.from(checkboxes).map(checkbox => checkbox.getAttribute('value'));
        console.log(selectedClusters);
      })
      if (envDiv) {
        // envDiv.replaceChildren();
        envDiv.appendChild(envListDiv)
        envListLabel.innerText = item;
        envListDiv.appendChild(envListInput)
        envListDiv.appendChild(envListLabel)
      }
    })}

const k8sDiv = document.getElementById(`k8sType`);
k8sDiv?.addEventListener("click", (e) => {

  fetch('http://localhost:3000/api/clusters')
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
      const clusters: Array<string> = response
      console.log("The list of clusters are " + clusters)
      displayClusters(clusters, "clusters");
})

})
const nonK8sDiv = document.getElementById(`nonK8sType`);
nonK8sDiv?.addEventListener("click", (e) => {

  fetch('http://localhost:3000/api/hosts')
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
      const hosts: Array<string> = response
      displayValues(hosts, "host");
})
})

// const envListDiv = document.createElement("div")
// const envListInput = document.createElement("input")
// const envListLabel = document.createElement("label")
// envListDiv.setAttribute("class", "option")
// envListInput.setAttribute("type", "checkbox" )
// envListInput.setAttribute("id", distinctValues[key]);
// envListInput.setAttribute("name", e)
// envListInput.setAttribute("value", distinctValues[key])
// envListLabel.setAttribute("for", distinctValues[key])
// envListLabel.innerText = distinctValues[key];
// envDiv.appendChild(envListDiv)
// envListDiv.appendChild(envListInput)
// envListDiv.appendChild(envListLabel)
// envListDiv.onclick 

