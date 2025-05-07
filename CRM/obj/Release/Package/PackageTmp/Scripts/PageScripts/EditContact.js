var selectedApplicationUsage = new Array();
var getApplicationUsageDetailsData = new Array();
var response;
var closestTR;
$(function () {
    function stripTrailingSlash(str) {
        if (str.substr(-1) == '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }
    var url = window.location.pathname;
    //var activePage = stripTrailingSlash(url);
    var activePage = "/Contact/ContactDetails/Index";
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
            $('.breadCrumbItem')[0].innerHTML = "Contact";
            $('.contentHeader')[0].innerHTML = "Contact";
        }
    });
});





toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {
    bindMasters();    
    if ($('#hdnPageLoadOption').val() == 'EditContact') {
        if ($('#hiddenPartyId').val() != '') {
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
            EditContact($('#hiddenPartyId').val());
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
    $("#txtDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#txtDOB").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#txtAnniversary").datepicker({ dateFormat: 'dd/mm/yy' });
});
function bindMasters() {
    if ($('#hdnLookup').val() != null && $('#hdnLookup').val() != '') {
        response = JSON.parse($('#hdnLookup').val());
        let City = response.filter(item => item.Type == "CITY-TYPE");
        let State = response.filter(item => item.Type == "STATE-TYPE");
        let Country = response.filter(item => item.Type == "COUNTRY-TYPE");
        let AddressType = response.filter(item => item.Type == "PARTY-ADDRESS-TYPE");
        let PhoneType = response.filter(item => item.Type == "PARTY-PHONE-TYPE");
        let EmailType = response.filter(item => item.Type == "PARTY-EMAIL-TYPE");
        if (City.length > 0) {
            $("#ddlCity").html('');
            $("#ddlCity").append('<option value=0>Select</option>');
            for (var i = 0; i < City.length; i++) {
                $("#ddlCity").append('<option value=' + City[i].LookupId + '>' + City[i].Description + '</option>');
            }
        }
        if (State.length > 0) {
            $("#ddlState").html('');
            $("#ddlState").append('<option value=0>Select</option>');
            for (var i = 0; i < State.length; i++) {
                $("#ddlState").append('<option value=' + State[i].LookupId + '>' + State[i].Description + '</option>');
            }
        }
        if (Country.length > 0) {
            $("#ddlCountry").html('');
            $("#ddlCountry").append('<option value=0>Select</option>');
            for (var i = 0; i < Country.length; i++) {
                $("#ddlCountry").append('<option value=' + Country[i].LookupId + '>' + Country[i].Description + '</option>');
            }
        }
        if (AddressType.length > 0) {
            $("#ddlAddressType").html('');
            $("#ddlAddressType").append('<option value=0>Select</option>');
            for (var i = 0; i < AddressType.length; i++) {
                $("#ddlAddressType").append('<option value=' + AddressType[i].LookupId + '>' + AddressType[i].Description + '</option>');
            }
        }
        if (PhoneType.length > 0) {
            $("#ddlPhoneType").html('');
            $("#ddlPhoneTypePlus").html('');
            $("#ddlPhoneType").append('<option value=0>Select</option>');
            for (var i = 0; i < PhoneType.length; i++) {
                $("#ddlPhoneType").append('<option value=' + PhoneType[i].LookupId + '>' + PhoneType[i].Description + '</option>');
            }
            $("#ddlPhoneTypePlus").append('<option value=0>Select</option>');
            for (var i = 0; i < PhoneType.length; i++) {
                $("#ddlPhoneTypePlus").append('<option value=' + PhoneType[i].LookupId + '>' + PhoneType[i].Description + '</option>');
            }
        }
        if (EmailType.length > 0) {
            $("#ddlEmail").html('');
            $("#ddlEmailPlus").html('');
            $("#ddlEmail").append('<option value=0>Select</option>');
            for (var i = 0; i < EmailType.length; i++) {
                $("#ddlEmail").append('<option value=' + EmailType[i].LookupId + '>' + EmailType[i].Description + '</option>');
            }
            $("#ddlEmailPlus").append('<option value=0>Select</option>');
            for (var i = 0; i < EmailType.length; i++) {
                $("#ddlEmailPlus").append('<option value=' + EmailType[i].LookupId + '>' + EmailType[i].Description + '</option>');
            }
        }
    }
    if ($('#hdnRepresentatives').val() != null && $('#hdnRepresentatives').val() != '') {
        $("#ddlRep").html('');
        var res = JSON.parse($('#hdnRepresentatives').val());
        $("#ddlRep").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlRep").append('<option value=' + res[i].Rep_ID + '>' + res[i].Rep_Name + '</option>');
        }
    }
}


function EditContact(Id) {
    if (Id > 0) {
        ShowProgress();
        //window.location.href = "/Contact/EditContact/Index?id=" + Id;
        $.ajax({
            url: "/Contact/EditContact/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                //window.location.href = "/Contact/EditContact/Index";
                //bindMasters();
                //$('#btnSave').css('display', 'none');
                //$('#btnUpdate').css('display', 'block');
                //$('#header')[0].innerText = "Update Contact";
                //$('#modal-lg').modal('toggle');
                //$('#txtContactId').val(result.Contact_Id);
                //$('#txtContact').val(result.Contact_Name);
                //$('#txtPrice').val(result.Contact_Price);
                //var date = ConvertDateDDMMYYYY(result.Contact_UpdateOn);
                //$('#txtDate').val(date);
                //selectedApplicationUsage = new Array();
                //for (i = 0; i < result.ContactApplicationUsages.length; i++) {
                //    selectedApplicationUsage.push(result.ContactApplicationUsages[i].ApplicationUsage_Id);
                //}
                //$('#ddlApplicationUsage').val(selectedApplicationUsage);
                //var array = result.ContactApplicationUsages;
                //var flags = [], output = [], appUsage = array.length, i;
                //for (i = 0; i < appUsage; i++) {
                //    if (flags[array[i].ApplicationUsage_Id]) continue;
                //    flags[array[i].ApplicationUsage_Id] = true;
                //    output.push({ ApplicationUsage_Id: array[i].ApplicationUsage.ApplicationUsage_Id, ApplicationUsageName: array[i].ApplicationUsage.ApplicationUsage_Name });
                //}

                //for (i = 0; i < output.length; i++) {
                //    $("#ddlApplicationUsage").attr('<option value=' + output[i].ApplicationUsage_Id + ' selected="selected">' + output[i].ApplicationUsage_Name + '</option>');
                //}

                //HideProgress();

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