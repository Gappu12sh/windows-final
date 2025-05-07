
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
            $('.breadCrumbItem')[0].innerHTML = "Department";
            $('.contentHeader')[0].innerHTML = "Department";
        }
    });
});
jQuery(document).ready(function ($) {

    if ($('#hdnPageLoadOption').val() == 'ViewDepartmentDetails') {
        GetDetails();

    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditDepartment') {
        if ($('#hiddenDepartmentId').val() != '') {
            bindMasters();
            EditDepartment($('#hiddenDepartmentId').val());
        }
    }

});





toastr.options = { "timeOut": 5000 };




$('#btnAddDepartment').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add Department";
    Refresh();
    bindMasters();
    $('#modal-lg').modal('toggle');
});
function bindMasters() {
    if ($('#hdnDepartmentGroupMaster').val() != null && $('#hdnDepartmentGroupMaster').val() != '') {
        $("#ddlDepartmentGroup").html('');
        var a = JSON.parse($('#hdnDepartmentGroupMaster').val());
        $("#ddlDepartmentGroup").append('<option value=0>-Select-</option>');
        for (var i = 0; i < a.length; i++) {
            $("#ddlDepartmentGroup").append('<option value=' + a[i].Value + '>' + a[i].Text + '</option>');
        }
    }
}
$('#btnSave').click(function (e) {

    e.preventDefault();
    var url = "/Department/Department/AddDepartment";
    var obj = {};
    obj.Department_Name = $('#txtDepartment').val();
    if ($('#txtDepartment').val() == '') {
        toastr.error('Department Name is required.');
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
                if (result.ErrorCodes != null) {
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    $('#modal-lg').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(SuccessMessage);
                    SweetSuccessMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-lg').modal('hide');
                    GetDetails();
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
    var url = "/Department/Department/UpdateDepartment";
    var obj = {};
    obj.Department_ID = $('#txtDepartmentId').val();;
    obj.UserId = $('#hiddenUserId').val();
    obj.Department_Name = $('#txtDepartment').val();
    if ($('#txtDepartment').val() == '') {
        toastr.error('Department Name is required.');
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
                if (result.ErrorCodes != null) {
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    $('#modal-lg').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(UpdateMessage());
                    SweetUpdateMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-lg').modal('hide');
                    GetDetails();
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
    $('#txtDepartment').val('');
}

function GetDetails() {

    ShowProgress();
    $.ajax({
        url: "/Department/Department/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        success: function (result) {
            if (result == null) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.Department.IsAdd) {
                    $('#dvAddDepartment').show();
                }
                HideProgress();
            }
            else {
                var permissions = JSON.parse($('#hiddenPermission').val());                
                if (permissions.Department != null) {
                    if (permissions.Department.IsView) {
                        bindData(result);
                    }
                }
                else {
                    //toastr.error(NotPermission());
                    NoPermission();
                    HideProgress();
                    return false;
                }
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

function EditDepartment(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/Department/Department/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                $('#txtDepartmentId').val(result.Department_ID);
                $('#txtDepartment').val(result.Department_Name);
                HideProgress();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText = "Update Department";
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
        //toastr.error(IdBlank());
        NoDataForId();
        HideProgress();
    }
}

function DeleteConfirmation(Id) {
    $("#txtDepartmentId").val(Id);
    $('#ConfirmBox').modal('show');
}
function DeleteDepartment() {
    var Id = $("#txtDepartmentId").val();
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/Department/Department/DeleteDetails/" + Id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //data: { id: Id },
            type: "Delete",
            success: function (result) {
                if (result.ErrorCodes != null) {
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    $('#ConfirmBox').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(DeleteMessage());
                    SweetDeleteMessage();
                    $('#ConfirmBox').modal('hide');
                    GetDetails();
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
        //toastr.error(IdBlank());
        NoDataForId();
        HideProgress();
    }
}

//function bindData(result) {
//    $('#tblDepartmentData thead').html('');
//    $('#tblDepartmentData tbody').html('');
//    var permissions = JSON.parse($('#hiddenPermission').val());
//    if (permissions.Department.IsAdd) {
//        $('#dvAddDepartment').show();
//    }
//    if (result.length > 0) {
//        var thead = "<tr role='row'>";
//        thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblDepartmentData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblDepartmentData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Department : activate to sort column descending'> Department Name</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblDepartmentData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsActive : activate to sort column descending'> IsActive</th>";
//        if (permissions.Department.IsEdit || permissions.Department.IsDeleted) {
//            thead += "<th> Action </th>";
//        }
//        thead += "</tr>";
//        $('#tblDepartmentData thead').append(thead);
//        var display = permissions.Department.IsEdit == true ? "inline" : "none";
//        var displayDel = permissions.Department.IsDeleted == true ? "inline" : "none";
//        var row = '';
//        for (var i = 0; i < result.length; i++) {
//            row += "<tr role='row'>";
//            row += "<td class='sorting_1' id='DepartmentId" + result[i].Department_ID + "' style='display:none'>" + result[i].Department_ID + "</td>";
//            row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
//            row += "<td>" + result[i].Department_Name + "</td>";
//            row += "<td><input type='checkBox' checked=" + result[i].IsActive + " disabled /></td>";
//            if (permissions.Department.IsEdit || permissions.Department.IsDeleted) {
//                row += "<td><a onclick=EditDepartment(" + result[i].Department_ID + ")><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "'></i></a> &nbsp;<a onclick=DeleteConfirmation(" + result[i].Department_ID + ")><i class='far fa-trash-alt' style='font-size:20px;color:red;display:" + displayDel + "'></i></a></td>";
//            }
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblDepartmentData')) {
//            $('#tblDepartmentData').DataTable().clear().destroy();
//        }
//        $('#tblDepartmentDataBody').append(row);
//        $('#tblDepartmentData').DataTable();

//    }
//    else {
//        HideProgress();
//    }
//}



var departmentNames = []; // For storing department names

function bindData(result) {
    $('#tblDepartmentData thead').html('');
    $('#tblDepartmentData tbody').html('');
    departmentNames = [];

    var permissions = JSON.parse($('#hiddenPermission').val());

    if (permissions.Department.IsAdd) {
        $('#dvAddDepartment').show();
    }

    if (result.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'></th>"; // Hidden ID column
        thead += "<th style='width: 55px;'>Sr.No.</th>";
        thead += "<th>Department Name</th>";
        //thead += "<th>IsActive</th>";
        if (permissions.Department.IsEdit || permissions.Department.IsDeleted) {
            thead += "<th>Action</th>";
        }
        thead += "</tr>";

        $('#tblDepartmentData thead').append(thead);

        var display = permissions.Department.IsEdit ? "inline" : "none";
        var displayDel = permissions.Department.IsDeleted ? "inline" : "none";

        var row = '';
        for (var i = 0; i < result.length; i++) {
            var departmentName = result[i].Department_Name;
            if (departmentName) departmentNames.push(departmentName); // Storing department names

            row += "<tr role='row'>";
            row += "<td style='display:none' id='DepartmentId" + result[i].Department_ID + "'>" + result[i].Department_ID + "</td>";
            row += "<td></td>"; // Placeholder for Sr.No.
            row += "<td>" + departmentName + "</td>"; // Display department name in uppercase

            // Display IsActive as a checkbox
            //row += "<td><input type='checkbox' " + (result[i].IsActive ? "checked" : "") + " disabled /></td>";

            if (permissions.Department.IsEdit || permissions.Department.IsDeleted) {
                row += "<td>";
                row += "<a onclick='EditDepartment(" + result[i].Department_ID + ")'><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "; margin-right: 10px;'></i></a>";
                row += "&nbsp;<a onclick='DeleteConfirmation(" + result[i].Department_ID + ")'><i class='far fa-trash-alt' style='font-size:20px;color:red;display:" + displayDel + "'></i></a>";
                row += "</td>";
            }
            row += "</tr>";
        }

        HideProgress();

        if ($.fn.DataTable.isDataTable('#tblDepartmentData')) {
            $('#tblDepartmentData').DataTable().clear().destroy();
        }

        $('#tblDepartmentData tbody').append(row);

        var table = $('#tblDepartmentData').DataTable({
            "order": [],
            "columnDefs": [{
                "targets": 1,
                "searchable": false,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    return meta.row + 1;
                }
            }]
        });

        table.on('draw', function () {
            table.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        });
    } else {
        HideProgress();
    }
}
