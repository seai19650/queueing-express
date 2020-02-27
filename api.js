String.prototype.format = function() {
    var args = arguments;
    this.unkeyed_index = 0;
    return this.replace(/\{(\w*)\}/g, function(match, key) {
        if (key === '') {
            key = this.unkeyed_index;
            this.unkeyed_index++
        }
        if (key == +key) {
            return args[key] !== 'undefined'
                ? args[key]
                : match;
        } else {
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
                    return args[i][key];
                }
            }
            return match;
        }
    }.bind(this));
}

const getStatusMessage = (id, payload) => {

    let message
    const statuses = {

        '000': "waiting to process",
        '010': "preparing request's directory",
        '011': "preparing document{}",
        '020': "downloading request's resources",
        '021': '{} is being downloaded',
        '022': "{} is being converted",
        '030': "converting request's resources",
        '031': "​​converting {} document{}",
        '040': "threading",
        '050': "end thread",

        '110': "input dataset",
        '111': "input dataset from {}",

        '120': "cleaning data and creating word tokenize",
        '121': "cleaning document {}",
        '122': "splitting word in document {}",

        '130': "creating bag of words",
        '140': "modeling",
        '150': "cleaning environment",
        '160': "evaluating model",
        '170': 'exporting to html format',
        '180': 'converting exported html to Thai',

        '410': "{} is not downloadable",

        '510': "input dataset failed on document {}"
    }

    if (!statuses[id]) {
        message = "Unknown Code"
    } else {
        if (payload.length > 0 && payload[0] !== "") {
            message = statuses[id].format(...payload)
        } else {
            message = statuses[id]
        }
    }

    return message
}

module.exports = {
    getStatusMessage
}
