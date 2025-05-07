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
            $(this).css('background-ChangePassword', 'rgba(255,255,255,.9)');
            $(this).css('ChangePassword', 'black');

        }
    });
});

jQuery(document).ready(function ($) {    
    if ($('#hdnPageLoadOption').val() == 'LoadEditChangePassword') {
        if ($('#hiddenChangePasswordId').val() != '') {
            //bindMasters();
            var a = JSON.parse($('#hiddenUserId').val());
            Refresh();           
            EditChangePassword(a);
        }
    }
});
$('#btnUpdate').click(function (e) {
    
    e.preventDefault();
    var url = "/ChangePassword/ChangePassword/AddEditDeleteChangePassword";
    var obj = {};
    obj.Id = $('#txtId').val();;
    obj.UserId = $('#hiddenUserId').val();
    obj.Operation = 'Update';
    obj.Password = $('#txtPassword').val();   
    if ($('#txtPassword').val() == '') {
        toastr.error('Password is required.');
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
                $('#ConfirmBox').modal('show');
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
    $('#txtChangePasswordName').val('');
    $('#txtPantoneNo').val('');
    $('#ddlPantoneType').val('0');
}

function EditChangePassword(Id) {
    if (Id > 0) {
        ShowProgress();
        var obj = {};
        obj.Id = Id;
        obj.UserId = $('#hiddenUserId').val();
        obj.Operation = 'Edit';

        $.ajax({
            url: "/ChangePassword/ChangePassword/GetDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ "data": JSON.stringify(obj) }),
            type: "Post",
            success: function (result) {
                
                $('#txtId').val(result.listclsChangePasswordDetailsModel[0].Id);
                $('#txtUsername').val(result.listclsChangePasswordDetailsModel[0].UserName);
                $('#txtPassword').val(result.listclsChangePasswordDetailsModel[0].Password);
                HideProgress();               
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText="Update Password";
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

function LoginRedirect()
{
    window.location.href = "/User/Account/Login";
}
function CloseChangePassword()
{
    window.location.href = "/User/Account/Welcome";
}
