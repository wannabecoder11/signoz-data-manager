# Signoz Data Manager
This app allows you to view and delete specific data from your signoz database, the standard TTL function was not proving to be enough as it would delete all types of logs.


# To-Do
 - [x] HTML Webui, basic, with static drop-downs, selects and submits.
 - [x] Add Some CSS.
 - [x] Start BE
    - [x] Fetch resrouce key,values
    - [x] pass it to FE JS.

 - [ ] Start FE JS.
    - [x] Fetch resource key-values from BE.
    - [ ] Added these keys to Drop-Downs(replace the statics from HTMML). 
    - [ ] For each key selected, fetch the available values.
    - [ ] Submit and send the submitted key-values to BE to fetch the data.
    - [ ] show the data in table.
    - [ ] Add fetch limit to 100 and pages for remaining data.
    - [ ] Create Delete button which will send the dropdown key-value pairs and display  confirmation box with all key-value pairs in a table to be executed for delete query.


# FE
- FE loads, JS makes GET call to /api/distinctEnv, recieves the list and then dislays the list in sidebar.

- when selecting k8s cluster should remove all hosts which are not k8s
- add event listeners to the list for changes, which makes a get call to /api/distinctCluster with list of selected items and recieves a list of clusters, this call the displaynextlist function to redraw this, keep calling the endpoint and redrawing.
- the displayNextList function can take inputs: selected items list, div to draw/redraw, resrouceType(like hosts, clusters, daemonsets)
- After env list, make a list of k8s or non-k8s, non-k8s removes all options realted to k8s, and k8s should remove all hosts
- add event listeners to the list for changes, which makes a get call to /api/distinctHosts and recieves a list of hosts
- add event listeners to the list for changes, which makes a get call to /api/distinctDeploy and recieves a list of deployments
- add event listeners to the list for changes, which makes a get call to /api/distinctDaemon and recieves a list of deployments


- Steps
   - load K8s/Non K8s, with even listners
   - K8s brings list with Cluster
      cluster brings Daemonsets and deployments
   - Non K8s brings hostnames which doesn't have any k8s attributes.