    var selectedApplicationUsage = new Array();
var getApplicationUsageDetailsData = new Array();
var givenPermission = new Array();
var response;
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
            $('.breadCrumbItem')[0].innerHTML = "UserModulePermission";
            $('.contentHeader')[0].innerHTML = "UserModulePermission";
        }
    });
});
jQuery(document).ready(function ($) {
    bindMasters();
    if ($('#hdnPageLoadOption').val() == 'ViewUserModulePermissionDetails') {
        GetDetails();
    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditUserModulePermission') {
        if ($('#hiddenUserModulePermissionId').val() != '') {
            $('.select2').select2();
            $('.select2bs4').select2({
                theme: 'bootstrap4',

            })
            $("select").on("select2:select", function (evt) {
                var element = evt.params.data.element;
                var $element = $(element);
                $element.detach();
                $(this).append($element);
                $(this).trigger("change");
            });
            //EditUserModulePermission($('#hiddenUserModulePermissionId').val());
        }
    }
    $('.select2').select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4',

    })
    $("select").on("select2:select", function (evt) {
        var element = evt.params.data.element;
        var $element = $(element);
        $element.detach();
        $(this).append($element);
        $(this).trigger("change");
    });
    $("#txtDate").datepicker({
        dateFormat: 'dd/mm/yy', beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 9999);
            }, 0);
        }
    });
});





toastr.options = { "timeOut": 5000 };



function bindMasters() {
    if ($('#hdnUsers').val() != null && $('#hdnUsers').val() != '') {
        $("#ddlUsers").html('');
        var res = JSON.parse($('#hdnUsers').val());
        $("#ddlUsers").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlUsers").append('<option value=' + res[i].UserID + '>' + res[i].UserName + '</option>');
        }
    }
}
$('#btnAddUserModulePermission').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add UserModulePermission";
    Refresh();
    bindMasters();
    $('#modal-lg').modal('toggle');
});

$('#btnSave').click(function (e) {

    e.preventDefault();
    var url = "/UserModulePermission/UserModulePermission/AddUserModulePermission";
    var userPermission = [];
    $('#tblPermissionData tbody tr').each(function (index, tr) {
        //appUsage[$(this).val()] = $(this).text();
        var row = $(tr).closest("tr");
        var Module = row.find('.isModule')[0].checked == false ? false : true;
        var View = row.find('.isView')[0].checked == false ? false : true;
        var Add = row.find('.isAdd')[0].checked == false ? false : true;
        var Edit = row.find('.isEdit')[0].checked == false ? false : true;
        var Delete = row.find('.isDelete')[0].checked == false ? false : true;
        var permission = {};
        permission.ModuleId = row.find('.moduleId')[0].innerText;
        permission.IsModule = Module;
        permission.IsAdd = Add;
        permission.IsDeleted = Delete;
        permission.IsEdit = Edit;
        permission.IsView = View;
        permission.UserId = $('#ddlUsers').find(':selected').val();
        permission.UserModulePermissionId = row.find('.permissionId')[0].innerText
        userPermission.push(permission)
    });
    //var obj = {
    //    userPermission
    //}

    if ($('#ddlUsers').val() == 0) {
        toastr.error('User Name is required.');
        return false;
    }
    else {
        ShowProgress();
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(userPermission) }),
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
    var url = "/UserModulePermission/UserModulePermission/UpdateUserModulePermission";
    var appUsage = [];
    $('#ddlApplicationUsage :selected').each(function () {
        //appUsage[$(this).val()] = $(this).text();
        var appUsageObj = {};
        appUsageObj.ApplicationUsage_Id = $(this).val()
        appUsage.push(appUsageObj)
    });
    var obj = {
        UserModulePermission_Id: $('#txtUserModulePermissionId').val(),
        UserModulePermission_Name: $('#txtUserModulePermission').val(),
        UserModulePermission_Price: $('#txtPrice').val(),
        UserModulePermission_UpdateOn: ConvertDateFormatYYMMDD($('#txtDate').val()),
        UserModulePermissionApplicationUsages: appUsage
    }
    if ($('#txtUserModulePermission').val() == '') {
        toastr.error('UserModulePermission Name is required.');
        return false;
    }
    else if ($('#txtPrice').val() == '') {
        toastr.error('Price is required.');
        return false;
    }
    else if ($('#txtDate').val() == '') {
        toastr.error('Date is required.');
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
    $('#tblPermissionData thead').html('');
    $('#tblPermissionData tbody').html('');

}

function GetDetails() {

    ShowProgress();
    var obj = {};
    $.ajax({
        url: "/UserModulePermission/UserModulePermission/GetDetails",
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
                $('#tblUserModulePermissionData thead').html('');
                $('#tblUserModulePermissionData tbody').html('');
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

function EditUserModulePermission(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/UserModulePermission/UserModulePermission/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                bindMasters();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText = "Update UserModulePermission";
                $('#modal-lg').modal('toggle');
                $('#txtUserModulePermissionId').val(result.UserModulePermission_Id);
                $('#txtUserModulePermission').val(result.UserModulePermission_Name);
                $('#txtPrice').val(result.UserModulePermission_Price);
                var date = ConvertDateDDMMYYYY(result.UserModulePermission_UpdateOn);
                $('#txtDate').val(date);
                selectedApplicationUsage = new Array();
                for (i = 0; i < result.UserModulePermissionApplicationUsages.length; i++) {
                    selectedApplicationUsage.push(result.UserModulePermissionApplicationUsages[i].ApplicationUsage_Id);
                }
                $('#ddlApplicationUsage').val(selectedApplicationUsage);
                var array = result.UserModulePermissionApplicationUsages;
                var flags = [], output = [], appUsage = array.length, i;
                for (i = 0; i < appUsage; i++) {
                    if (flags[array[i].ApplicationUsage_Id]) continue;
                    flags[array[i].ApplicationUsage_Id] = true;
                    output.push({ ApplicationUsage_Id: array[i].ApplicationUsage.ApplicationUsage_Id, ApplicationUsageName: array[i].ApplicationUsage.ApplicationUsage_Name });
                }

                for (i = 0; i < output.length; i++) {
                    $("#ddlApplicationUsage").attr('<option value=' + output[i].ApplicationUsage_Id + ' selected="selected">' + output[i].ApplicationUsage_Name + '</option>');
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

function DeleteUserModulePermission(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/UserModulePermission/UserModulePermission/DeleteDetails?id=" + Id,
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
        HideProgress();
    }
}

//function bindData(result) {
//    $('#tblUserModulePermissionData thead').html('');
//    $('#tblUserModulePermissionData tbody').html('');
//    const key = 'UserId';

//    const arrayUniqueByKey = [...new Map(result.map(item =>
//        [item[key], item])).values()];
//    if (arrayUniqueByKey.length > 0) {
//        var thead = "<tr role='row'>";
//        thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='UserModulePermission : activate to sort column descending'> User Name</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsActive : activate to sort column descending'> IsActive</th>";

//        thead += "<th> Action </th>";
//        //thead += "<th> Delete </th>";
//        thead += "</tr>";
//        $('#tblUserModulePermissionData thead').append(thead);
//        var row = '';
//        for (var i = 0; i < arrayUniqueByKey.length; i++) {
//            row += "<tr role='row'>";
//            row += "<td class='sorting_1' id='UserModulePermissionId" + arrayUniqueByKey[i].UserModulePermissionId + "' style='display:none'>" + arrayUniqueByKey[i].UserModulePermissionId + "</td>";
//            row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
//            row += "<td>" + arrayUniqueByKey[i].user.UserName + "</td>";
//            row += "<td><input type='checkBox' checked=" + arrayUniqueByKey[i].IsActive + " disabled /></td>";
//            row += "<td><a onclick=DeleteUserModulePermission(" + arrayUniqueByKey[i].UserId + ")><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
//            //row += "<td><img onclick=DeleteUserModulePermission(" + result.listclsUserModulePermissionDetailsModel[i].Id + ") src='/Images/delete.png' style='width:25px; height:25px'/></td>";
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblUserModulePermissionData')) {
//            $('#tblUserModulePermissionData').DataTable().clear().destroy();
//        }
//        $('#tblUserModulePermissionDataBody').append(row);
//        $('#tblUserModulePermissionData').DataTable(
//            { "order": [] }
//        );
//    }
//    else {
//        HideProgress();
//    }
//}





function bindData(result) {
    $('#tblUserModulePermissionData thead').html('');
    $('#tblUserModulePermissionData tbody').html('');

    const key = 'UserId';

    // Remove duplicates based on UserId
    const uniqueUsers = [...new Map(result.map(item => [item[key], item])).values()];

    if (uniqueUsers.length > 0) {
        var thead = `<tr role='row'>
            <th style='display:none'></th>
            <th style='width: 55px;'>Sr.No.</th>
            <th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending'>User Name</th>
            <th>Action</th>
        </tr>`;

        $('#tblUserModulePermissionData thead').append(thead);

        var row = '';
        for (var i = 0; i < uniqueUsers.length; i++) {
            row += `<tr role='row'>
                <td class='sorting_1' id='UserModulePermissionId${uniqueUsers[i].UserModulePermissionId}' style='display:none'>${uniqueUsers[i].UserModulePermissionId}</td>
                <td></td> <!-- Sr.No. will be handled dynamically -->
                <td>${uniqueUsers[i].user.UserName}</td>
                <td><a onclick=DeleteUserModulePermission(${uniqueUsers[i].UserId})><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>
            </tr>`;
        }

        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblUserModulePermissionData')) {
            $('#tblUserModulePermissionData').DataTable().clear().destroy();
        }

        $('#tblUserModulePermissionData tbody').append(row);

        // Initialize DataTable with dynamic Sr.No. logic
        var table = $('#tblUserModulePermissionData').DataTable({
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











































//function GetPermissions(data) {
//    var Id = data.value;
//    if (Id > 0) {
//        ShowProgress();
//        $.ajax({
//            url: "/UserModulePermission/UserModulePermission/GetDetailsById",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: { id: Id },
//            type: "Get",
//            success: function (result) {
//                $('#dvPermission').show();
//                $('#tblPermissionData thead').html('');
//                $('#tblPermissionData tbody').html('');
//                var thead = "<tr role='row'>";
//                thead += "<th style='display:none'>  </th>";
//                thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Module: activate to sort column descending'> Module </th>";
//                thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Module: activate to sort column descending'> Selected Module </th>";
//                thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsAdd : activate to sort column descending'> IsAdd</th>";
//                thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsEdit : activate to sort column descending'> IsEdit</th>";
//                thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsView : activate to sort column descending'> IsView</th>";
//                thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsDelete : activate to sort column descending'> IsDelete</th>";
//                thead += "</tr>";
//                $('#tblPermissionData thead').append(thead);
//                var row = '';
//                var modules = JSON.parse($('#hdnModules').val());
//                var isAdd, isEdit, isView, isDelete, isModule, userPermissionId;
//                for (var i = 0; i < modules.length; i++) {
//                    var rec = result.filter(x => x.ModuleId == modules[i].ModuleId);
//                    if (rec.length > 0) {
//                        isModule = rec[0].IsModule;
//                        isAdd = rec[0].IsAdd;
//                        isEdit = rec[0].IsEdit;
//                        isView = rec[0].IsView;
//                        isDelete = rec[0].IsDeleted;
//                        userPermissionId = rec[0].UserModulePermissionId;
//                    }
//                    else {
//                        isModule = false;
//                        isAdd = false;
//                        isEdit = false;
//                        isView = false;
//                        isDelete = false;
//                        userPermissionId = 0;
//                    }
//                    row += "<tr role='row'>";
//                    row += "<td>" + modules[i].ModuleName + "</td>";
//                    if (isModule == true) {
//                        row += "<td><input class='isModule' type='checkBox' checked /></td>";
//                    }
//                    else {
//                        row += "<td><input class='isModule' type='checkBox' /></td>";
//                    }
//                    if (isAdd == true) {
//                        row += "<td><input class='isAdd' type='checkBox' checked /></td>";
//                    }
//                    else {
//                        row += "<td><input class='isAdd' type='checkBox' /></td>";
//                    }
//                    if (isEdit == true) {
//                        row += "<td><input class='isEdit' type='checkBox' checked /></td>";
//                    }
//                    else {
//                        row += "<td><input class='isEdit' type='checkBox' /></td>";
//                    }
//                    if (isView == true) {
//                        row += "<td><input class='isView' type='checkBox' checked /></td>";
//                    }
//                    else {
//                        row += "<td><input class='isView' type='checkBox' /></td>";
//                    }
//                    if (isDelete == true) {
//                        row += "<td><input class='isDelete' type='checkBox' checked /></td>";
//                    }
//                    else {
//                        row += "<td><input class='isDelete' type='checkBox' /></td>";
//                    }
//                    row += "<td class='moduleId' style='display:none'>" + modules[i].ModuleId + "</td>";
//                    row += "<td class='permissionId' style='display:none'>" + userPermissionId + "</td>";
//                    row += "</tr>";
//                }
//                $('#tblPermissionDataBody').append(row);
//                HideProgress();

//            },
//            error: function (msg) {
//                toastr.error(msg);
//                HideProgress();
//                return false;
//            }
//        });
//    }
//    else {
//        toastr.error('No details found for this record.');
//        HideProgress();
//    }
//}
function GetPermissions(data) {
    var Id = data.value;
    response = data;
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/UserModulePermission/UserModulePermission/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                MapModulePermission(result);
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

function EditPermission(data) {
    var closestTR = $(data).closest('TR');
    var isModule = $(closestTR).find('.isModule')[0].innerText == "true" ? true : false;
    var moduleName = $(closestTR).find('.moduleName')[0].innerText;
    var moduleId = $(closestTR).find('.moduleId')[0].innerText;
    var gvnPerm = givenPermission[0].filter(x => x.ModuleId == moduleId);
    if (gvnPerm.length > 0) {
        gvnPerm = gvnPerm[0].userPermissionModels;
    }
    $('#txtModuleId').val(moduleId);
    $('#modal-permission').modal('toggle');
    var modules = JSON.parse($('#hdnModules').val());
    var selectedModule = modules.filter(x => x.ModuleId == moduleId);
    var actions = selectedModule[0].ModuleActions;
    $('#tblPermData thead').html('');
    $('#tblPermData tbody').html('');
    var thead = "<tr role='row'>";
    thead += "<th style='display:none'>  </th>";
    thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPermData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Module: activate to sort column descending'> Type </th>";
    thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPermData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Module: activate to sort column descending'> IsAllowed </th>";
    thead += "</tr>";
    $('#tblPermData thead').append(thead);
    var row1 = '';
    row1 += "<tr role='row'>";
    row1 += "<td class='lookupId' style='display:none'>0</td>";
    row1 += "<td>" + moduleName + "</td>";
    if (isModule == true) {
        row1 += "<td><input class='isAction' type='checkBox' checked /></td>";
    }
    else {
        row1 += "<td><input class='isAction' type='checkBox' /></td>";
    }
    row1 += "</tr>";
    $('#tblPermDataBody').append(row1);
    var row = '';
    for (var i = 0; i < actions.length; i++) {
        var IsActive = false;
        if (gvnPerm.length > 0) {
            var filterPerm = gvnPerm.filter(x => x.ActionId == actions[i].LookupId);
            if (filterPerm.length > 0) {
                IsActive = filterPerm[0].IsActive;
            }
        }
        row += "<tr role='row'>";
        row += "<td class='lookupId' style='display:none'>" + actions[i].LookupId + "</td>";
        row += "<td>" + actions[i].Description + "</td>";
        if (IsActive == true) {
            row += "<td><input class='isAction' type='checkBox' checked /></td>";
        }
        else {
            row += "<td><input class='isAction' type='checkBox' /></td>";
        }
        row += "</tr>";
    }
    $('#tblPermDataBody').append(row);
    HideProgress();
}

function btnUpdatePermission() {
    var url = "/UserModulePermission/UserModulePermission/AddUserModulePermission";
    var userPermission = [];
    var isModule = false;
    $('#tblPermData tbody tr').each(function (index, tr) {
        var row = $(tr).closest("tr");
        if (row.find('.lookupId')[0].innerText == 0) {
            if (row.find('.isAction')[0].checked == true) {
                isModule = true;
            }
        }
        else if (row.find('.isAction')[0].checked == true) {
            var permission = {};
            permission.ActionId = row.find('.lookupId')[0].innerText;
            permission.ISActive = true;
            userPermission.push(permission)
        }
    });

    var userModule = {
        ModuleId: $('#txtModuleId').val(),
        IsModule: isModule,
        UserId: $('#ddlUsers').find(':selected').val(),
        userPermissionModels: userPermission
    }

    if ($('#ddlUsers').val() == 0) {
        toastr.error('User Name is required.');
        return false;
    }
    else {
        ShowProgress();
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(userModule) }),
            type: "Post",
            success: function (result) {
                if (result.ErrorCodes == null) {
                    //toastr.success(UpdateMessage());
                    SweetUpdateMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-permission').modal('hide');
                    MapModulePermission(result);

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
};
function MapModulePermission(result) {
    givenPermission = new Array();
    givenPermission.push(result);
    $('#dvPermission').show();
    $('#tblPermissionData thead').html('');
    $('#tblPermissionData tbody').html('');
    var thead = "<tr role='row'>";
    thead += "<th style='display:none'>  </th>";
    thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Module: activate to sort column descending'> Module </th>";
    thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblUserModulePermissionData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='IsAdd : activate to sort column descending'> Action</th>";
    thead += "</tr>";
    $('#tblPermissionData thead').append(thead);
    var row = '';
    var modules = JSON.parse($('#hdnModules').val());
    var isModule, userPermissionId;
    for (var i = 0; i < modules.length; i++) {
        var rec = result.filter(x => x.ModuleId == modules[i].ModuleId);
        if (rec.length > 0) {
            isModule = rec[0].IsModule;
            userPermissionId = rec[0].UserModulePermissionId;
        }
        else {
            isModule = false;
            userPermissionId = 0;
        }
        row += "<tr role='row'>";
        row += "<td class='moduleName'>" + modules[i].ModuleName + "</td>";
        row += "<td><a onclick=EditPermission(this)><i class='fas fa-edit' style='font-size:20px;color:#902ca8;'></i></a></td>";
        row += "<td class='moduleId' style='display:none'>" + modules[i].ModuleId + "</td>";
        row += "<td class='permissionId' style='display:none'>" + userPermissionId + "</td>";
        row += "<td class='isModule' style='display:none'>" + isModule + "</td>";
        row += "</tr>";
    }
    $('#tblPermissionDataBody').append(row);
    HideProgress();
}
