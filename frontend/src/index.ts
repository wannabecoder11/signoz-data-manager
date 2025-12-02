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
      if (envDiv) {

        envDiv.appendChild(envListDiv)

        envDiv.removeAttribute("hidden")
        envListLabel.innerText = item;
        envListDiv.appendChild(envListInput)
        envListDiv.appendChild(envListLabel)
      }
    })}



function displayClusters(distinctValues: string[], resourceType: string) {
  document.getElementById(`${resourceType}Keys`)?.toggleAttribute("hidden");
  document.getElementById(`deploymentsKeys`)?.toggleAttribute("hidden"); // show deployment heading
  document.getElementById(`daemonsetsKeys`)?.toggleAttribute("hidden"); // show daemonset heading

  const envDiv = document.getElementById(`${resourceType}`);
  if (envDiv) {
      envDiv.replaceChildren();
      envDiv.removeAttribute("hidden")
  }

  // display the list of k8s clusters
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
          fetchK8sResources('daemonsets')
          fetchK8sResources('deployments')
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
      // console.log("The list of clusters are " + clusters)
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

function displayList(distinctValues: string[], resourceType: string) {
      // document.getElementById(`${resourceType}Keys`)?.removeAttribute("hidden")

      const envDiv = document.getElementById(`${resourceType}`);
      if (envDiv) {
          envDiv.replaceChildren();
      }
      distinctValues.forEach(item => {
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
        if (envDiv) {

          envDiv.appendChild(envListDiv)

          // envDiv.removeAttribute("hidden")
          envListLabel.innerText = item;
          envListDiv.appendChild(envListInput)
          envListDiv.appendChild(envListLabel)
        }
      })}

function fetchK8sResources(resourceType: string) {
        const checkedboxes = (document.querySelectorAll(`input[name=clusters]:checked`));
        const selectedClusters =  Array.from(checkedboxes).map(checkbox => checkbox.getAttribute('value'));
        // console.log(selectedClusters);

        // fetch daemonsets/deployments for the above cluster and display it using displayList func
        const endpointUrl = new URL(`http://localhost:3000/api/${resourceType}`);
        for (let i in selectedClusters) {
          endpointUrl.searchParams.append('clusters', `${selectedClusters[i]}`);
        }
        fetch(endpointUrl.href)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();  // Return this promise chain here
          })
          .then(data => {
            // console.log('the deployments response is', data);
            displayList(data, resourceType);
          })
          .catch(error => {
            console.error('Fetch error:', error);
          });



      }