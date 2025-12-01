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
      document.getElementById(`${resourceType}Keys`)?.removeAttribute("hidden")

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

        envDiv.removeAttribute("hidden")
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
      envDiv.removeAttribute("hidden")
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
        const checkedboxes = (document.querySelectorAll(`input[name=${resourceType}]:checked`));
        const selectedClusters =  Array.from(checkedboxes).map(checkbox => checkbox.getAttribute('value'));
        // console.log(selectedClusters);
        // fetch daemonsets for the above cluster and display it using displayValues func
        const daemonsetUrl = new URL('http://localhost:3000/api/daemonsets');
        for (let i in selectedClusters) {
          daemonsetUrl.searchParams.append('clusters', `${selectedClusters[i]}`);
        }

        fetch(daemonsetUrl.href)
        .then(function(response) {
          return response.json();
        }).then(function(response) { 
          const clusters: Array<string> = response
          displayValues(clusters, "daemon")
        });

        // fetch deployments for the above clusters and display it
        const deploymentUrl = new URL('http://localhost:3000/api/deployments');
        for (let i in selectedClusters) {
          deploymentUrl.searchParams.append('clusters', `${selectedClusters[i]}`);
        }

        fetch(deploymentUrl.href)
        .then(function(response) {

          return response.json();
        }).then(function(response) { 

          console.log('the deployments response is' + response)
          const clusters: Array<string> = response
          displayValues(clusters, "deploy")
        });


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

