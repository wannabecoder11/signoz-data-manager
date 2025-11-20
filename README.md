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

- load K8s/Non K8s, with even listners, the same function to display the lists, k8s selection call the function twice, once for deploy, second for daemonsets, non-k8s selection calls it for just the hosts.


- when selecting k8s cluster, make call to /api/clusters and get list of clusters and should remove hosts selection, and only show deployment and daemonset selection lists
- make sure daemonset and deployments are not selected at the same time, give error
- when selecting non-k8s, it should remove or not display deployments and daemonsets, and only leave hosts option, it should then make calls to /api/hosts and get a list of hosts which are not have k8s resources. 


- the displayNextList function can take inputs: selected items list, div to draw/redraw, resrouceType(like hosts, clusters, daemonsets)


# BE
- /api/clusters gives list of available k8s clusters
- /api/daemonsets takes a list of clusters and returns list of daemonsets, 
- /api/deployments takes a lsit of clusters and returns list of deployments
- /api/hosts returns list of hosts which don't belong to k8s cluster
