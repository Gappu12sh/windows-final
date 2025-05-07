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
            $(this).css('Page', 'black');

        }
    });
});
jQuery(document).ready(function ($) {

    if ($('#hdnPageLoadOption').val() == 'ViewCasteDetails') {
        GetDetails();
    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditCaste') {
        if ($('#hiddenCaste_ID').val() != '') {            
            EditCaste($('#hiddenCaste_ID').val());
        }
    }
    $('.select2').select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4'

    })
});

// Add a new Caste///
$('#btnAddCaste').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add Caste";
    Refresh();    
    $('#modal-lg').modal('toggle');
});
/// Save button function to save new Caste record.//
$('#btnSave').click(function (e) {
    
    e.preventDefault();
    var url = "/Caste/Caste/AddEditDeleteCaste";
    var obj = {};
    obj.Id = '0';
    obj.UserId = $('#hiddenUserId').val();
    obj.Operation = 'Add';
    obj.Caste_Fulldescription = $('#txtCasteFullDescription').val();
    obj.Caste_Shortdescription = $('#txtCasteShortDescription').val();
    obj.UnitId = $('#hiddenUnitId').val();
    if ($('#txtCasteName').val() == '') {
        toastr.error('Caste Name is required.');
        return false;
    }
    else if ($('#txtCasteName').val() == '') {
        toastr.error('Caste Short Name is required.');
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
                bindData(result);
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
    var url = "/Caste/Caste/AddEditDeleteCaste";
    var obj = {};
    obj.Caste_ID = $('#Caste_ID').val();;
    obj.UserId = $('#hiddenUserId').val();
    obj.Operation = 'Update';
    obj.Caste_Fulldescription = $('#txtCasteFullDescription').val();
    obj.Caste_Shortdescription = $('#txtCasteShortDescription').val();
    obj.UnitId = $('#hiddenUnitId').val();
    if ($('#txtCasteName').val() == '') {
        toastr.error('Caste Name is required.');
        return false;
    }
    else if ($('#txtCasteName').val() == '') {
        toastr.error('Caste Short Name is required.');
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
                bindData(result);
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
    $('#txtCasteFullDescription').val('');
    $('#txtCasteShortDescription').val('');
}

// Edit function for Caste and bind data into controll//
function EditCaste(Id) {
    if (Id > 0) {
        ShowProgress();
        var obj = {};
        obj.Caste_ID = Id;
        obj.UserId = $('#hiddenUserId').val();
        obj.Operation = 'Edit';

        $.ajax({
            url: "/Caste/Caste/GetDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Post",
            success: function (result) {               
                $('#Caste_ID').val(result.listclsCasteDetailsModel[0].Caste_ID);
                $('#txtCasteFullDescription').val(result.listclsCasteDetailsModel[0].Caste_Fulldescription);
                $('#txtCasteShortDescription').val(result.listclsCasteDetailsModel[0].Caste_Shortdescription);
                HideProgress();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText="Update Caste";
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

function DeleteCaste(Id) {
    if (Id > 0) {
        ShowProgress();
        var obj = {};
        obj.Caste_ID = Id;
        obj.UserId = $('#hiddenUserId').val();
        obj.Operation = 'Delete';
        $.ajax({
            url: "/Caste/Caste/DeleteDetails",
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
// Get whole list of Caste//
function GetDetails() {

    ShowProgress();
    var obj = {};
    obj.Id = '0';
    obj.UserId = $('#hiddenUserId').val();
    obj.UnitId = $('#hiddenUnitId').val();
    obj.Operation = 'View';
    $.ajax({
        url: "/Caste/Caste/GetDetails",
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

// Bind whole list of Caste
function bindData(result) {
    $('#tblCasteData thead').html('');
    $('#tblCasteData tbody').html('');
    if (result.listclsCasteDetailsModel.length > 0) {
        var thead = "<tr role='row'>";       
        //thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblCasteData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblCasteData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Caste Name: activate to sort column descending'> Caste ID </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblCasteData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Description: activate to sort column descending'> Caste Full Name </th>";
        thead += "<th style='background-color:deepskyblue' class='sorting_asc' tabindex='0' aria-controls='tblCasteData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Description: activate to sort column descending'> Caste Short Name </th>";
        thead += "<th style='background-color:deepskyblue'> Edit </th>";
        thead += "<th style='background-color:deepskyblue'> Delete </th>";
        thead += "</tr>";
        $('#tblCasteData thead').append(thead);
        var row = '';
        for (var i = 0; i < result.listclsCasteDetailsModel.length; i++) {
            row += "<tr role='row'>";            
            //row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
            row += "<td>" + result.listclsCasteDetailsModel[i].Caste_ID + "</td>";
            row += "<td>" + result.listclsCasteDetailsModel[i].Caste_Fulldescription + "</td>";
            row += "<td>" + result.listclsCasteDetailsModel[i].Caste_Shortdescription + "</td>";
            row += "<td><img onclick=EditCaste(" + result.listclsCasteDetailsModel[i].Caste_ID + ") src='/Images/edit.png' style='width:20px; height:20px'/></td>";
            row += "<td><img onclick=DeleteCaste(" + result.listclsCasteDetailsModel[i].Caste_ID + ") src='/Images/delete.png' style='width:20px; height:20px'/></td>";
            row += "</tr>";
            
        }
        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblCasteData')) {
            $('#tblCasteData').DataTable().clear().destroy();
        }
        $('#tblCasteDataBody').append(row);
        $('#tblCasteData').DataTable();
    }
    else {
        HideProgress();
    }
}