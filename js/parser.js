function searchJSON(json, target) {
    if (json[target] != undefined) {
        return json[target];
    }
    let jkeys = Object.keys(json);
    for (let i = 0; i < jkeys.length; i++) {
        let jval = json[jkeys[i]];
        if (typeof jval === "object" || Array.isArray(jval)) {
            let retval = searchJSON(jval, target);
            if (retval != null) {
                return retval;
            }
        }
    }
    return null;
}

module.exports.searchJSON = searchJSON;