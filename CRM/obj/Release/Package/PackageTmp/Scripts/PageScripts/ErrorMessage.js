
function ErrorCodes(errorCode) {
    switch (errorCode) {
        case "E005":
            return "Record already exist";
        case "E006":
            return "Sorry, You don't have permission!";
    }
}

function SuccessMessage() {
    return "Saved successfully";
}
function UpdateMessage() {
    return "Updated successfully";
}
function NoRecordMessage() {
    return "No record found";
}
function DeleteMessage() {
    return "Record deleted successfully";
}
function IdBlank() {
    return "No details found for this record.";
}
function IsModuleSelected() {
    return "Please allow module.";
}
function NotPermission() {
    return "You don't have permission";
}

function SweetSuccessMessage() {
    Swal.fire({
        title: "Saved successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });
}
function SweetUpdateMessage() {
    Swal.fire({
        title: "Updated successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });
}
function SweetDeleteMessage() {
    Swal.fire({
        title: "Record deleted successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });
}
function SweetErrorMessage(errorCode) {
    Swal.fire({
        title: ErrorCodes(errorCode),
        icon: "error",
        showConfirmButton: false,
        timer: 1500
    });
}
function NoRecordFound() {
    Swal.fire({
        title: "No record found",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
    });
}
function NoPermission() {
    Swal.fire({
        title: "You don't have permission!",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
    });
}
function NoDataForId() {
    Swal.fire({
        title: "No details found for this record!",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
    });
}
function IsModuleSelected() {
    Swal.fire({
        title: "Please allow module!",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
    });
}
function CheckProductRate(price) {
    Swal.fire({
        title: "Entered rate is lesser than fixed product rate " + price,
        icon: "error",
        showConfirmButton: false,
        timer: 1900
    });
}
function SweetAlertMessage() {
    Swal.fire({
        title: "Sample name is duplicate",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500
    });
}