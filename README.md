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
