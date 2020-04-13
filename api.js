String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
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
        '050': "complete",

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

        "190": "pushing result to API",
        "191": "pushing files",
        "192": "pushing result",

        "S00": "comparing part {} out of 17 parts",
        "S20": "preparing data on part {}",
        "S30": "word tokenizing on part {}",
        "S40": "term weighting on part {}",
        "S50": "measuring the cosine similarity on part {}",

        '410': "{} is not downloadable",

        '510': "input dataset failed on document {}",

        "601": "document download process is failed due to unreachable url(s)",
        "602": "duplicated urls were found on the payload"
    }

    if (!statuses[id]) {
        message = `Unknown Code ${id}`
    } else {
        if (typeof payload === "string") {
            payload = [payload]
        }
        message = statuses[id].format(...payload)
    }

    return message
}

module.exports = {
    getStatusMessage
}
