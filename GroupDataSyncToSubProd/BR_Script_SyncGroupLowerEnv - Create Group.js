(function executeRule(current, previous /*null when async*/) {

    //FOR USE ONLY IN PRODUCTION
    //This script is part of BR for table Group [sys_user_group]

    var debug = false; //or store it as a system property and get it using gs.getProperty('someName')
    var instanceName = gs.getProperty('instance_name');

    var payload = {
        "name": current.getValue('name'),
        "active": current.getValue('active'),
        "manager": current.getValue('manager'),
        "manager_name": current.getDisplayValue('manager'),
        "exclude_manager": current.getValue('exclude_manager'),
        "description": current.getValue('description'),
        "email": current.getValue('email'),
        "parent": current.getValue('parent'),
        "parent_name": current.getDisplayValue('parent'),
        "type": current.getValue('type'),
        "sys_id": current.getUniqueValue()
        //add any other fields you need to pass values from
    };

    /**
     * One to many relationship, where source instance is the current instance running the script
     * and target instance URLs are the instances the payload is sent.
     */
    var instanceMap = {
        "source_instance_name_1": ["target_instance_1_URL", "target_instance_1_URL"],
        "source_instance_name_2": ["target_instance_1_URL", "target_instance_1_URL"],
    };

    instanceMap[instanceName].forEach(function (instanceUrl) {
        try {
            var r = new sn_ws.RESTMessageV2('SyncGroupLowerEnv', 'CreateGroup'); //outbound REST message
            r.setStringParameterNoEscape('url', instanceUrl);
            r.setRequestBody(JSON.stringify(payload));
            var response = r.execute();
            var responseBody = response.getBody();
            var respBodyObj = JSON.parse(responseBody);
            var httpStatus = response.getStatusCode();
        } catch (ex) {
            var message = ex.message;
            gs.error('SyncGroupLowerEnv CreateGroup ERROR: ' + message);
        }

        if (debug) {
            gs.info(
                'SyncGroupLowerEnv CreateGroup:' +
                '\n- Target: ' + instanceUrl +
                '\n- Payload: ' + JSON.stringify(payload) +
                '\n\n- HTTP Status: ' + httpStatus +
                '\n- Response status: ' + respBodyObj.result.status
            );
        }
    });

})(current, previous);
