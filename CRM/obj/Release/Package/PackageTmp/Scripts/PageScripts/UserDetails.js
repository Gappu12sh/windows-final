var selectedApplicationUsage = new Array();
var getApplicationUsageDetailsData = new Array();
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
            //$(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
            $(this).parent().addClass('active');
            $(this).css('background-color', '#dee2e6');
            $(this).css('color', 'black');
            $('.breadCrumbItem').addClass("active");
            $('.breadCrumbItem')[0].innerHTML = "UserDetails";
            $('.contentHeader')[0].innerHTML = "UserDetails";
        }
    });
});





toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {
    bindMasters();
    if ($('#hdnPageLoadOption').val() == 'ViewUserDetailsDetails') {
        GetDetails();
    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditUserDetails') {
        if ($('#hiddenUserDetailsId').val() != '') {
            $('.select2').select2();
            $('.select2bs4').select2({
                theme: 'bootstrap4',

            })
            
            EditUserDetails($('#hiddenUserDetailsId').val());
        }
    }
    $('.select2').select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4',

    })
  
});
function bindMasters() {
    if ($('#hdnDepartments').val() != null && $('#hdnDepartments').val() != '') {
        $("#ddlDepartment").html('');
        var res = JSON.parse($('#hdnDepartments').val());
        $("#ddlDepartment").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlDepartment").append('<option value=' + res[i].Department_ID + '>' + res[i].Department_Name + '</option>');
        }
    }
    if ($('#hdnReps').val() != null && $('#hdnReps').val() != '') {
        $("#ddlRep").html('');
        var res = JSON.parse($('#hdnReps').val());
        $("#ddlRep").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlRep").append('<option value=' + res[i].Rep_ID + '>' + res[i].Rep_Name + '</option>');
        }
    }
}
$('#btnAddUserDetails').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add UserDetails";
    Refresh();
    bindMasters();
    $('#modal-lg').modal('toggle');
});

$('#btnSave').click(function (e) {

    e.preventDefault();
    var url = "/UserDetails/UserDetails/AddUserDetails";
    var obj = {
        UserName: $('#txtUserName').val(),
        User_Email: $('#txtEmail').val(),
        User_Password: $('#txtPassword').val(),
        User_Type: $('#ddlUserType').val(),
        Rep_ID: $('#ddlRep').val(),
        User_Dept: $('#ddlDepartment').val(),
    }

    if ($('#txtUserName').val() == '') {
        toastr.error('Username is required.');
        return false;
    }
    else if ($('#txtEmail').val() == '') {
        toastr.error('Email is required.');
        return false;
    }
    else if ($('#txtPassword').val() == '') {
        toastr.error('Password is required.');
        return false;
    }
    else if ($('#txtConfPass').val() == '') {
        toastr.error('Password is required.');
        return false;
    }
    else if ($('#ddlUserType').val() == '') {
        toastr.error('User type is required.');
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
                if (result.ErrorCodes == null) {
                    //toastr.success("Saved successfully");
                    SweetSuccessMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-lg').modal('hide');
                    GetDetails();
                }
                else {

                }
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
});

$('#btnUpdate').click(function (e) {

    e.preventDefault();
    var url = "/UserDetails/UserDetails/UpdateUserDetails";
    var obj = {
        UserID: $('#txtUserDetailsId').val(),
        UserName: $('#txtUserName').val(),
        User_Email: $('#txtEmail').val(),
        User_Password: $('#txtPassword').val(),
        User_Type: $('#ddlUserType').val(),
        Rep_ID: $('#ddlRep').val(),
        User_Dept: $('#ddlDepartment').val(),
    }

    if ($('#txtUserName').val() == '') {
        toastr.error('Username is required.');
        return false;
    }
    else if ($('#txtEmail').val() == '') {
        toastr.error('Email is required.');
        return false;
    }
    else if ($('#txtPassword').val() == '') {
        toastr.error('Password is required.');
        return false;
    }
    else if ($('#txtConfPass').val() == '') {
        toastr.error('Password is required.');
        return false;
    }
    else if ($('#ddlUserType').val() == '') {
        toastr.error('User type is required.');
        return false;
    }
    else {
        ShowProgress();
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Put",
            success: function (result) {
                if (result.ErrorCodes == null) {
                    //toastr.success("Updated successfully");
                    SweetUpdateMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-lg').modal('hide');
                    GetDetails();
                }
                else {

                }
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
});

function Refresh() {
    $('#txtUserDetails').val('');
    $('#txtPrice').val('');
    $('#txtDate').val('');
}

function GetDetails() {

    ShowProgress();
    var obj = {};
    $.ajax({
        url: "/UserDetails/UserDetails/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "data": JSON.stringify(obj) }),
        type: "Get",
        success: function (result) {
            var a = result;
            if (result.length > 0) {
                bindData(result);
            }
            else {
                //toastr.error('No data found.');
                NoRecordFound();
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

function EditUserDetails(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/UserDetails/UserDetails/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                bindMasters();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText = "Update UserDetails";
                $('#modal-lg').modal('toggle');
                $('#txtUserDetailsId').val(result.UserID);
                $('#txtUserName').val(result.UserName);
                $('#txtPassword').val(result.User_Password);
                $('#txtEmail').val(result.User_Email);
                $('#txtConfPass').val(result.User_Password);
                $('#ddlDepartment').val(result.User_Dept);
                $('#ddlUserType').val(result.User_Type);
                if (result.Rep_ID != null) {
                    $('#ddlRep').val(result.Rep_ID);
                }
                HideProgress();

            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
    else {
        //toastr.error('No details found for this record.');
        NoDataForId();
        HideProgress();
    }
}

function DeleteUserDetails(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/UserDetails/UserDetails/DeleteDetails/" + Id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //data: { id: Id },
            type: "Delete",
            success: function (result) {
                var a = result;
                //toastr.error('Details removed successfully.');
                SweetDeleteMessage();
                GetDetails();
            },
            error: function (msg) {
                toastr.error(msg);
                HideProgress();
                return false;
            }
        });
    }
    else {
        //toastr.error('No details found for this record.');
        NoDataForId();
    }
}

//function bindData(result) {
//    $('#tblUserDetailsData thead').html('');
//    $('#tblUserDetailsData tbody').html('');
//    if (result.length > 0) {
//        var thead = "<tr role='row'>";
//        thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='User : activate to sort column descending'> User</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Email : activate to sort column descending'> Email</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsActive : activate to sort column descending'> IsActive</th>";

//        thead += "<th> Edit </th>";
//        //thead += "<th> Delete </th>";
//        thead += "</tr>";
//        $('#tblUserDetailsData thead').append(thead);
//        var row = '';
//        for (var i = 0; i < result.length; i++) {
//            row += "<tr role='row'>";
//            row += "<td class='sorting_1' id='UserDetailsId" + result[i].UserID + "' style='display:none'>" + result[i].UserID + "</td>";
//            row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
//            row += "<td>" + result[i].UserName + "</td>";
//            row += "<td>" + result[i].User_Email + "</td>";
//            row += "<td><input type='checkBox' checked=" + result[i].IsActive + " disabled /></td>";
//            //row += "<td><a href='/UserDetails/EditUserDetails/Index?id=" + result.listclsUserDetailsDetailsModel[i].Id + "'><img src='../Images/edit.png' style='width:15px; height:15px'/></a></td>";
//            //row += "<td><img onclick=EditUserDetails(" + result[i].Rep_ID + ") src='/Images/edit.png' style='width:25px; height:25px'/></td>";
//            row += "<td><a onclick=EditUserDetails(" + result[i].UserID + ")><i class='fas fa-edit' style='font-size:20px;color:#902ca8'></i></a> &nbsp;<a onclick=DeleteUserDetails(" + result[i].UserID + ")><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
//            //row += "<td><img onclick=DeleteUserDetails(" + result.listclsUserDetailsDetailsModel[i].Id + ") src='/Images/delete.png' style='width:25px; height:25px'/></td>";
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblUserDetailsData')) {
//            $('#tblUserDetailsData').DataTable().clear().destroy();
//        }
//        $('#tblUserDetailsDataBody').append(row);
//        $('#tblUserDetailsData').DataTable();
//    }
//    else {
//        HideProgress();
//    }
//}









function bindData(result) {
    $('#tblUserDetailsData thead').html('');
    $('#tblUserDetailsData tbody').html('');

    if (result.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'>  </th>";
        thead += "<th style='width: 55px;'> Sr.No. </th>"; // Fixed width for consistency
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='User : activate to sort column descending'> User</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Email : activate to sort column descending'> Email</th>";
        //thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserDetailsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsActive : activate to sort column descending'> IsActive</th>";
        thead += "<th> Action </th>";
        thead += "</tr>";

        $('#tblUserDetailsData thead').append(thead);

        var row = '';
        for (var i = 0; i < result.length; i++) {
            row += "<tr role='row'>";
            row += "<td class='sorting_1' id='UserDetailsId" + result[i].UserID + "' style='display:none'>" + result[i].UserID + "</td>";
            row += "<td></td>"; // Placeholder for Sr.No.
            row += "<td>" + result[i].UserName + "</td>";
            row += "<td>" + result[i].User_Email + "</td>";
            //row += "<td><input type='checkbox' " + (result[i].IsActive ? "checked" : "") + " disabled /></td>";
            row += "<td><a onclick=EditUserDetails(" + result[i].UserID + ")><i class='fas fa-edit' style='font-size:20px;color:#902ca8'></i></a> &nbsp;<a onclick=DeleteUserDetails(" + result[i].UserID + ")><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
            row += "</tr>";
        }

        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblUserDetailsData')) {
            $('#tblUserDetailsData').DataTable().clear().destroy();
        }

        $('#tblUserDetailsData tbody').append(row);

        // Initialize DataTable with dynamic Sr.No. logic
        var table = $('#tblUserDetailsData').DataTable({
            "order": [],
            "columnDefs": [{
                "targets": 1, // Sr.No. column index
                "searchable": false,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    return meta.row + 1; // Assign Sr.No. dynamically
                }
            }]
        });

        // Update Sr.No. after sorting/filtering
        table.on('draw', function () {
            table.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        });
    } else {
        HideProgress();
    }
}



















function Rep(data) {
    if (data.value == "Representative") {
        $('#representatives').show();
    }
    else {
        $('#representatives').hide();
    }
}