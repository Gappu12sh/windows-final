function ConvertDateFormat(data) {

    if (data == "" || data == null) {
        return "";
    }
    else {
        var date = new Date(data.split("/").reverse().join("-"));
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        var yy = date.getFullYear();
        return dd + "/" + MM + "/" + yy;
    }
}
function ConvertDateFormatYYMMDD(data) {
    if (data == "" || data == null) {
        return "";
    }
    else {
        var date = convertDateToUTC(new Date(data.split("/").reverse().join("-")));
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        var yy = date.getFullYear();
        return MM + "/" + dd + "/" + yy;
    }
}
function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
function ConvertDateDDMMYYYY(data) {
    var removeTime;
    if (data == "" || data == null) {
        return "";
    }
    else {
        var InputDate;
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            InputDate = data.replace('-', '/').split("/");
        }
        else {
            removeTime = data.split("T");
            InputDate = removeTime[0].split("-");
        }
        //var Outdate = InputDate[1] + "/" + InputDate[0] + "/" + InputDate[2];
        var Outdate = InputDate[2] + "/" + InputDate[1] + "/" + InputDate[0];
        var FirefoxOutdate = InputDate[0] + "/" + InputDate[1] + "/" + InputDate[2];
        var date;
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            date = convertDateToUTC(new Date(FirefoxOutdate));
        }
        else {
            date = convertDateToUTC(new Date(Outdate.split("/").reverse().join("-")));
        }
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        var yy = date.getFullYear();
        return dd + "/" + MM + "/" + yy;
    }
}

toastr.options = {
    "timeOut": 5000
};




function ConvertEditDateDDMMYYYY(data) {
    var removeTime;
    if (data == "" || data == null) {
        return "";
    }
    else {
        var InputDate;
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            InputDate = data.replace('-', '/').split("/");
        }
        else {
            removeTime = data.split("T");
            InputDate = removeTime[0].split("-");
        }
        //var Outdate = InputDate[1] + "/" + InputDate[0] + "/" + InputDate[2];
        var Outdate = InputDate[2] + "/" + InputDate[1] + "/" + InputDate[0];
        var FirefoxOutdate = InputDate[0] + "/" + InputDate[1] + "/" + InputDate[2];
        var date;
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            date = new Date(FirefoxOutdate);
        }
        else {
            date = new Date(Outdate.split("/").reverse().join("-"));
        }
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        var yy = date.getFullYear();
        return dd + "/" + MM + "/" + yy;
    }
}

function isValidDate(date) {
    var reDate = /(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[0-2])\/(?:19|20\d{2})/;
    return reDate.test(sText);
}