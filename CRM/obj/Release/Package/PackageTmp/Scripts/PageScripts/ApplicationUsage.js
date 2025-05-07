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
            $('.breadCrumbItem')[0].innerHTML = "Application/Usage";
            $('.contentHeader')[0].innerHTML = "Application/Usage";

        }
    });
});

toastr.options = {
    "timeOut": 5000
};




jQuery(document).ready(function ($) {

    if ($('#hdnPageLoadOption').val() == 'ViewApplicationUsageDetails') {
        GetDetails();

    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditApplicationUsage') {
        if ($('#hiddenApplicationUsageId').val() != '') {
            bindMasters();
            EditApplicationUsage($('#hiddenApplicationUsageId').val());
        }
    }

});
$('#btnAddApplicationUsage').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add Application/Usage";
    Refresh();
    bindMasters();    
    $('#modal-lg').modal('toggle');
});
function bindMasters() {
    if ($('#hdnApplicationUsageGroupMaster').val() != null && $('#hdnApplicationUsageGroupMaster').val() != '') {
        $("#ddlApplicationUsageGroup").html('');
        var a = JSON.parse($('#hdnApplicationUsageGroupMaster').val());
        $("#ddlApplicationUsageGroup").append('<option value=0>-Select-</option>');
        for (var i = 0; i < a.length; i++) {
            $("#ddlApplicationUsageGroup").append('<option value=' + a[i].Value + '>' + a[i].Text + '</option>');
        }
    }
}
$('#btnSave').click(function (e) {

    e.preventDefault();
    var url = "/ApplicationUsage/ApplicationUsage/AddApplicationUsage";
    var obj = {};
    obj.ApplicationUsage_Name = $('#txtApplicationUsage').val();
    if ($('#txtApplicationUsage').val() == '') {
        toastr.error('Application/Usage Name is required.');
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
                    //toastr.success(SuccessMessage());
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
    var url = "/ApplicationUsage/ApplicationUsage/UpdateApplicationUsage";
    var obj = {};
    obj.ApplicationUsage_Id = $('#txtApplicationUsageId').val();
    obj.ApplicationUsage_Name = $('#txtApplicationUsage').val();
    if ($('#txtApplicationUsage').val() == '') {
        toastr.error('ApplicationUsage Name is required.');
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
    $('#txtApplicationUsage').val('');
}

function GetDetails() {

    ShowProgress();
    $.ajax({
        url: "/ApplicationUsage/ApplicationUsage/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        success: function (result) {
            if (result == null) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.ApplicationUsage.IsAdd) {
                    $('#dvAddButton').show();
                }
                HideProgress();
            }
            else {
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.ApplicationUsage != null) {
                    if (permissions.ApplicationUsage.IsView) {
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

function EditApplicationUsage(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/ApplicationUsage/ApplicationUsage/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                $('#txtApplicationUsageId').val(result.ApplicationUsage_Id);
                $('#txtApplicationUsage').val(result.ApplicationUsage_Name);
                HideProgress();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText = "Update Application/Usage";
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
    $("#txtApplicationUsageId").val(Id);
    $('#ConfirmBox').modal('show');
}
function DeleteApplicationUsage(Id) {
    var Id = $("#txtApplicationUsageId").val();
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/ApplicationUsage/ApplicationUsage/DeleteDetails/" + Id,
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
//    $('#tblApplicationUsageData thead').html('');
//    $('#tblApplicationUsageData tbody').html('');
//    var permissions = JSON.parse($('#hiddenPermission').val());
//    if (permissions.ApplicationUsage.IsAdd) {
//        $('#dvAddButton').show();
//    }
//    if (result.length > 0) {
//        var thead = "<tr role='row'>";
//        thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblApplicationUsageData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblApplicationUsageData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Application/Usage : activate to sort column descending'> Application/Usage Name</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblApplicationUsageData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsActive : activate to sort column descending'> IsActive</th>";
//        if (permissions.ApplicationUsage.IsEdit || permissions.ApplicationUsage.IsDeleted) {
//            thead += "<th> Action </th>";
//        }
//        thead += "</tr>";
//        $('#tblApplicationUsageData thead').append(thead);
//        var display = permissions.ApplicationUsage.IsEdit == true ? "inline" : "none";
//        var displayDel = permissions.ApplicationUsage.IsDeleted == true ? "inline" : "none";
//        var row = '';
//        for (var i = 0; i < result.length; i++) {
//            row += "<tr role='row'>";
//            row += "<td class='sorting_1' id='ApplicationUsageId" + result[i].ApplicationUsage_Id + "' style='display:none'>" + result[i].ApplicationUsage_Id + "</td>";
//            //row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
//            row += "<td></td>";
//            row += "<td>" + result[i].ApplicationUsage_Name + "</td>";
//            row += "<td><input type='checkBox' checked=" + result[i].IsActive + " disabled /></td>";
//            if (permissions.ApplicationUsage.IsEdit || permissions.ApplicationUsage.IsDeleted) {
//                row += "<td><a onclick=EditApplicationUsage(" + result[i].ApplicationUsage_Id + ")><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "'></i></a> &nbsp;<a onclick=DeleteConfirmation(" + result[i].ApplicationUsage_Id + ")><i class='far fa-trash-alt' style='font-size:20px;color:red;display:" + displayDel + "'></i></a></td>";
//            }
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblApplicationUsageData')) {
//            $('#tblApplicationUsageData').DataTable().clear().destroy();
//        }
//        $('#tblApplicationUsageDataBody').append(row);
//        $('#tblApplicationUsageData').DataTable(
//            { "order": [] }
//        );

//    }
//    else {
//        HideProgress();
//    }
//}



var appUsageNames = []; 

function bindData(result) {
    $('#tblApplicationUsageData thead').html('');
    $('#tblApplicationUsageData tbody').html('');
    appUsageNames = [];

    var permissions = JSON.parse($('#hiddenPermission').val());

    if (permissions.ApplicationUsage.IsAdd) {
        $('#dvAddButton').show();
    }

    if (result.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'></th>";
        thead += "<th style='width: 55px;'>Sr.No.</th>";
        thead += "<th>Application/Usage Name</th>";
        if (permissions.ApplicationUsage.IsEdit || permissions.ApplicationUsage.IsDeleted) {
            thead += "<th>Action</th>";
        }
        thead += "</tr>";

        $('#tblApplicationUsageData thead').append(thead);

        var display = permissions.ApplicationUsage.IsEdit ? "inline" : "none";
        var displayDel = permissions.ApplicationUsage.IsDeleted ? "inline" : "none";

        var row = '';
        for (var i = 0; i < result.length; i++) {
            var appName = result[i].ApplicationUsage_Name;
            if (appName) appUsageNames.push(appName);

            row += "<tr role='row'>";
            row += "<td style='display:none' id='ApplicationUsageId" + result[i].ApplicationUsage_Id + "'>" + result[i].ApplicationUsage_Id + "</td>";
            row += "<td></td>"; // Placeholder for Sr.No.
            //row += "<td>" + appName + "</td>";
            row += "<td>" + appName.toUpperCase() + "</td>";

            if (permissions.ApplicationUsage.IsEdit || permissions.ApplicationUsage.IsDeleted) {
                row += "<td>";
                //row += "<a onclick='EditApplicationUsage(" + result[i].ApplicationUsage_Id + ")'><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "'></i></a> ";
                row += "<a onclick='EditApplicationUsage(" + result[i].ApplicationUsage_Id + ")'><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "; margin-right: 10px;'></i></a> "; // Added margin-right
                row += "&nbsp;<a onclick='DeleteConfirmation(" + result[i].ApplicationUsage_Id + ")'><i class='far fa-trash-alt' style='font-size:20px;color:red;display:" + displayDel + "'></i></a>";
                row += "</td>";
            }
            row += "</tr>";
        }

        HideProgress();

        if ($.fn.DataTable.isDataTable('#tblApplicationUsageData')) {
            $('#tblApplicationUsageData').DataTable().clear().destroy();
        }

        $('#tblApplicationUsageData tbody').append(row);

        var table = $('#tblApplicationUsageData').DataTable({
            "order": [],
            "columnDefs": [{
                "targets": 1,
                "searchable": false,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    return meta.row + 1;
                },
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
