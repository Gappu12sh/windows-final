$(function () {
    function stripTrailingSlash(str) {
        if (str.substr(-1) == '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }
    var url = window.location.pathname;
    var activePage = stripTrailingSlash(url);
    $('.nav li a').each(function () {
        var currentPage = stripTrailingSlash($(this).attr('href'));

        if (activePage == currentPage) {
            $('.nav-link').removeClass("active");
            $('.nav-item').removeClass("active menu-open");
            $(this).parent().parent().parent().addClass("active menu-open");
            $(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
            $(this).parent().addClass('active');
            $(this).css('background-color', '#dee2e6');
            $(this).css('color', 'black');

        }
    });
});





toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {

    if ($('#hdnPageLoadOption').val() == 'ViewUserDataDetails') {
        GetDetails();

    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditUserData') {
        if ($('#hiddenUserDataId').val() != '') {
            bindMasters();
            EditUserData($('#hiddenUserDataId').val());
        }
    }

});
$('#btnAddUserData').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add UserData";
    Refresh();
    bindMasters();
    $('#modal-lg').modal('toggle');
});
///Bind masters to dropdownlist///
function bindMasters() {
    
    if ($('#hdnRoleMaster').val() != null && $('#hdnRoleMaster').val() != '') {
        $("#ddlRole").html('');
        var a = JSON.parse($('#hdnRoleMaster').val());
        $("#ddlRole").append('<option value=0>-Select-</option>');
        for (var i = 0; i < a.length; i++) {
            $("#ddlRole").append('<option value=' + a[i].Value + '>' + a[i].Text + '</option>');
        }
    }
}
/// Save button function to save new Customer record.//
$('#btnSave').click(function (e) {
    
    e.preventDefault();
    var url = "/UserData/UserData/AddEditDeleteUserData";
    var obj = {};
    obj.Id = '0';
    obj.UserId = $('#hiddenUserId').val();
    obj.Operation = 'Add';
    obj.Emp_ID = $('#txtEmpId').val();
    obj.Emp_Name = $('#txtEmployeeName').val();
    obj.Emp_CompanyID = $('#hiddenUnitId').val();
    obj.Emp_Email = $('#txtemailId').val();
    obj.Emp_Mobile = $('#txtMobileNo').val();  
    obj.Emp_Password = $('#txtpassword').val();
    obj.Emp_Role = $('#ddlRole option:selected').val();
    obj.CanApproveDC = $("#chkIsPermitted").prop('checked') == true ? 1 : 0;
    if ($('#txtEmployeeName').val() == '') {
        toastr.error('Employee Name is required.');
        return false;
    }
   
    if ($('#txtMobileNo').val() == '') {
        toastr.error('Mobile number is required.');
        return false;
    }
    
    if ($('#txtpassword').val() == '') {
        toastr.error('Password is required.');
        return false;
    }
    if ($('#ddlRole option:selected').val() == 0) {
        toastr.error('Role is required.');
        return false;
    }
   
    else {
        ShowProgress();
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Post",
            success: function (result) {
                toastr.success(result.ResponseMessage);
                Refresh();
                HideProgress();
                $('#modal-lg').modal('hide');
                GetDetails();
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
});
/// Update button function to update a record.//
$('#btnUpdate').click(function (e) {
    
    e.preventDefault();
    var url = "/UserData/UserData/AddEditDeleteUserData";
    var obj = {};
    obj.Emp_ID = $('#Emp_ID').val();;
    obj.UserId = $('#hiddenUserId').val();
    obj.Operation = 'Update';
    obj.Emp_Name = $('#txtEmployeeName').val();
    obj.Emp_CompanyID = $('#hiddenUnitId').val();
    obj.Emp_Email = $('#txtemailId').val();
    obj.Emp_Mobile = $('#txtMobileNo').val();
    obj.Emp_Password = $('#txtpassword').val();
    obj.Emp_Role = $('#ddlRole option:selected').val();
    obj.CanApproveDC = $("#chkIsPermitted").prop('checked') == true ? 1 : 0;
    if ($('#txtEmployeeName').val() == '') {
        toastr.error('Employee Name is required.');
        return false;
    }

    if ($('#txtMobileNo').val() == '') {
        toastr.error('Mobile number is required.');
        return false;
    }

    if ($('#txtpassword').val() == '') {
        toastr.error('Password is required.');
        return false;
    }
    if ($('#ddlRole option:selected').val() == 0) {
        toastr.error('Role is required.');
        return false;
    }
    else {
        ShowProgress();
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Post",
            success: function (result) {
                toastr.success(result.ResponseMessage);
                Refresh();
                HideProgress();
                $('#modal-lg').modal('hide');
                GetDetails();
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
});
// Clear all controll///
function Refresh() {
    $('#txtEmpId').val('');
    $('#ddlRole').val('0');
    $('#txtEmployeeName').val('');
    $('#txtMobileNo').val('');
    $('#txtemailId').val('');
    $('#txtpassword').val('');
}
// Get whole list of Customer//
function GetDetails() {
    
    ShowProgress();
    var obj = {};
    obj.Id = '0';
    obj.UserId = $('#hiddenUserId').val();
    obj.Operation = 'View';
    $.ajax({
        url: "/UserData/UserData/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "data": JSON.stringify(obj) }),
        type: "Post",
        success: function (result) {
            var a = result;
            if (result.ResponseCode == 100) {
                bindData(result);
            }
            else {
                toastr.error('No data found.');
                HideProgress();
            }
        },
        error: function (msg) {
            toastr.error(msg);
            HideProgress();
            return false;
        }
    });
}
// Edit function for Customer and bind data into controll//
function EditUserData(Id) {
    if (Id > 0) {
        ShowProgress();
        var obj = {};
        obj.Emp_ID = Id;
        obj.UserId = $('#hiddenUserId').val();
        obj.Operation = 'Edit';

        $.ajax({
            url: "/UserData/UserData/GetDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Post",
            success: function (result) {
                bindMasters();
                $('#Emp_ID').val(result.listclsUserDataDetailsModel[0].Emp_ID);
                $('#txtEmpId').val(result.listclsUserDataDetailsModel[0].Emp_ID);
                $('#txtEmployeeName').val(result.listclsUserDataDetailsModel[0].Emp_Name);
                $('#ddlRole').val(result.listclsUserDataDetailsModel[0].Emp_Role).attr("selected", "selected");
                $('#txtemailId').val(result.listclsUserDataDetailsModel[0].Emp_Email);
                $('#txtMobileNo').val(result.listclsUserDataDetailsModel[0].Emp_Mobile);
                $('#txtpassword').val(result.listclsUserDataDetailsModel[0].Emp_Password);
                result.listclsUserDataDetailsModel[0].CanApproveDC == 1 ? $("#chkIsPermitted").prop('checked', true) : $("#chkIsPermitted").prop('checked', false);
                HideProgress();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText = "Update UserData";
                $('#modal-lg').modal('toggle');
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
    else {
        toastr.error('No details found for this record.');
        HideProgress();
    }
}

function DeleteUserData(Id) {
    if (Id > 0) {
        ShowProgress();
        var obj = {};
        obj.Emp_ID = Id;
        obj.UserId = $('#hiddenUserId').val();
        obj.Operation = 'Delete';
        $.ajax({
            url: "/UserData/UserData/DeleteDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Post",
            success: function (result) {
                var a = result;
                if (result.ResponseCode == 100) {
                    toastr.success('Details removed successfully.');
                    bindData(result);
                }
                else {
                    toastr.error('No data found.');
                    HideProgress();
                }
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
    else {
        toastr.error('No details found for this record.');
    }
}
// Bind whole list of Customer
function bindData(result) {
    $('#tblUserDataData thead').html('');
    $('#tblUserDataData tbody').html('');
    if (result.listclsUserDataDetailsModel.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'>  </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblUserDataData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Employee Id </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblUserDataData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Name: activate to sort column descending'>Employee Name </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblUserDataData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Department : activate to sort column descending'> Mobile No </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblUserDataData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Role : activate to sort column descending'>EmailId </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblUserDataData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='EmailId : activate to sort column descending'> User Role </th>";
        //thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDataData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Location : activate to sort column descending'> Location </th>";

        thead += "<th style='background-color:deepskyblue'> Edit </th>";
        thead += "<th style='background-color:deepskyblue'> Delete </th>";
        thead += "</tr>";
        $('#tblUserDataData thead').append(thead);
        var row = '';
        for (var i = 0; i < result.listclsUserDataDetailsModel.length; i++) {
            row += "<tr role='row'>";
            row += "<td class='sorting_1' id='UserDataId" + result.listclsUserDataDetailsModel[i].Emp_ID + "' style='display:none'>" + result.listclsUserDataDetailsModel[i].Emp_ID + "</td>";
            row += "<td>" + result.listclsUserDataDetailsModel[i].Emp_ID + "</td>";
            row += "<td>" + result.listclsUserDataDetailsModel[i].Emp_Name + "</td>";
            row += "<td>" + result.listclsUserDataDetailsModel[i].Emp_Mobile + "</td>";
            row += "<td>" + result.listclsUserDataDetailsModel[i].Emp_Email + "</td>";
            row += "<td>" + result.listclsUserDataDetailsModel[i].Emp_RoleName + "</td>";
            row += "<td><img onclick=EditUserData('" + result.listclsUserDataDetailsModel[i].Emp_ID + "') src='/Images/edit.png' style='width:20px; height:20px'/></td>";
            row += "<td><img onclick=DeleteUserData('" + result.listclsUserDataDetailsModel[i].Emp_ID + "') src='/Images/delete.png' style='width:20px; height:20px'/></td>";
            row += "</tr>";
            
        }
        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblUserDataData')) {
            $('#tblUserDataData').DataTable().clear().destroy();
        }
        $('#tblUserDataDataBody').append(row);
        $('#tblUserDataData').DataTable();
    }
    else {
        HideProgress();
    }
}

// Check Digit or alphabatic///
$(function () {
    $('.numbers').keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            //$("#errmsg").html("Digits Only").show().fadeOut("slow");
            toastr.error('Enter Digits Only.');
            return false;
        }
    });
});