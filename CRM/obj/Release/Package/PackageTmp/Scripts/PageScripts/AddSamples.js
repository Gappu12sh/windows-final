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
    var activePage = "/Samples/SamplesDetails/Index";
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
            $('.breadCrumbItem')[0].innerHTML = "tEST";
            $('.contentHeader')[0].innerHTML = "TEST";
        }
    });
});

toastr.options = {
    "timeOut": 5000
};




jQuery(document).ready(function ($) {
    //bindMasters();
    //if ($('#hdnPageLoadOption').val() == 'ViewSamplesDetails') {
    //    GetDetails();
    //}
    if ($('#hdnPageLoadOption').val() == 'Samples') {
        $('.select2').select2();
        $('.select2bs4').select2({
            theme: 'bootstrap4',

        })
    }
    //if ($('#hdnPageLoadOption').val() == 'LoadEditSamples') {
    //    if ($('#hiddenSamplesId').val() != '') {
    //        $('.select2').select2();
    //        $('.select2bs4').select2({
    //            theme: 'bootstrap4',

    //        })
    //        $("select").on("select2:select", function (evt) {
    //            var element = evt.params.data.element;
    //            var $element = $(element);
    //            $element.detach();
    //            $(this).append($element);
    //            $(this).trigger("change");
    //        });
    //        EditSamples($('#hiddenSamplesId').val());
    //    }
    //}
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
    $("#txtQuotationDate").datepicker({ dateFormat: 'dd/mm/yy' });
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
$('#btnAddAddress').click(function (e) {
    RefreshAddressModal();
    bindMasters();
    $('#btnSaveAddress').css('display', 'block');
    $('#btnUpdateAddress').css('display', 'none');
    $('#modal-Address').modal('toggle');
});
$('#btnSaveAddress').click(function (e) {
    if ($('#ddlRep').val() == "0") {
        toastr.error('Representative is required.');
        $('#ddlRep').focus();
        return false;
    }
    else if ($('#ddlCity').val() == "0") {
        toastr.error('City is required.');
        $('#ddlCity').focus();
        return false;
    }
    else if ($('#ddlState').val() == "0") {
        toastr.error('State is required.');
        $('#ddlState').focus();
        return false;
    }
    else if ($('#ddlCountry').val() == "0") {
        toastr.error('Country is required.');
        $('#ddlCountry').focus();
        return false;
    }
    var i = $('#ViewAddressTableData tbody tr').length - 1;
    var isSupplier = $('#chkIsSupplier')[0].checked == true ? "Yes" : "No";
    var checkAddressType = $('#ddlAddressType').val() == "0" ? "" : $('#ddlAddressType').find(':selected').text();
    var checkCity = $('#ddlCity').val() == "0" ? "" : $('#ddlCity').find(':selected').text();
    var checkState = $('#ddlState').val() == "0" ? "" : $('#ddlState').find(':selected').text();
    var checkCountry = $('#ddlCountry').val() == "0" ? "" : $('#ddlCountry').find(':selected').text();
    var checkRep = $('#ddlRep').val() == "0" ? "" : $('#ddlRep').find(':selected').text();
    var Newrow = "";
    Newrow += "<tr id=" + i + ">";
    Newrow += "<td class='addressType'>" + checkAddressType + "</td>";
    Newrow += "<td class='addressLine1'>" + $('#txtAddressLine1').val() + "</td>";
    Newrow += "<td class='addressLine2'>" + $('#txtAddressLine2').val() + "</td>";
    Newrow += "<td class='city'>" + checkCity + "</td>";
    Newrow += "<td class='state'>" + checkState + "</td>";
    Newrow += "<td class='country'>" + checkCountry + "</td>";
    Newrow += "<td class='pin'>" + $('#txtPIN').val() + "</td>";
    Newrow += "<td class='addressEmail'>" + $('#txtAddressEmail').val() + "</td>";
    Newrow += "<td class='addressSamples'>" + $('#txtAddressSamples').val() + "</td>";
    Newrow += "<td class='addressGst'>" + $('#txtAddressGST').val() + "</td>";
    Newrow += "<td class='rep'>" + checkRep + "</td>";
    Newrow += "<td class='zone'>" + $('#txtZone').val() + "</td>";
    Newrow += "<td class='supplier'>" + isSupplier + "</td>";
    Newrow += "<td class='remarks'>" + $('#txtRemarks').val() + "</td>";
    Newrow += "<td class='addressTypeId' style='display:none'>" + $('#ddlAddressType').val() + "</td>";
    Newrow += "<td class='cityId' style='display:none'>" + $('#ddlCity').val() + "</td>";
    Newrow += "<td class='stateId' style='display:none'>" + $('#ddlState').val() + "</td>";
    Newrow += "<td class='countryId' style='display:none'>" + $('#ddlCountry').val() + "</td>";
    Newrow += "<td class='repId' style='display:none'>" + $('#ddlRep').val() + "</td>";
    Newrow += "<td class='chkSupplier' style='display:none'>" + $('#chkIsSupplier')[0].checked + "</td>";
    Newrow += "<td><a onclick=EditAddressRow(this)><i class='fas fa-edit' style='font-size:20px;color:blue'></i></a> &nbsp;<a onclick=DeleteAddressRow(this)><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
    Newrow += "</tr>";
    $('#ViewAddressDataBody').append(Newrow);
    $('#modal-Address').modal("hide");
    RefreshAddressModal();
});
function EditAddressRow(data) {
    $('#btnSaveAddress').css('display', 'none');
    $('#btnUpdateAddress').css('display', 'block');
    $('#modal-Address').modal('toggle');
    RefreshAddressModal();
    bindMasters();
    var row = $(data).closest("tr");
    closestTR = $(data).closest("tr");
    var chk = row.find('.chkSupplier')[0].innerText == "false" ? false : true;
    $('#ddlAddressType').val(row.find('.addressTypeId ')[0].innerText).attr('selected', 'selected');
    $('#txtAddressLine1').val(row.find('.addressLine1')[0].innerText);
    $('#txtAddressLine2').val(row.find('.addressLine2')[0].innerText);
    $('#ddlCity').val(row.find('.cityId')[0].innerText).attr('selected', 'selected');
    $('#ddlState').val(row.find('.stateId')[0].innerText);
    $('#ddlCountry').val(row.find('.countryId')[0].innerText);
    $('#txtPIN').val(row.find('.pin')[0].innerText);
    $('#txtAddressEmail').val(row.find('.addressEmail')[0].innerText);
    $('#txtAddressSamples').val(row.find('.addressSamples')[0].innerText);
    $('#txtAddressGST').val(row.find('.addressGst')[0].innerText);
    $('#ddlRep').val(row.find('.repId')[0].innerText);
    $('#txtZone').val(row.find('.zone')[0].innerText)
    $('#chkIsSupplier').prop("checked", chk);
    $('#txtRemarks').val(row.find('.remarks')[0].innerText);
    $('#txtRowId').val(row[0].id);
}
$('#btnUpdateAddress').click(function (e) {
    $('#modal-Address').modal("hide");
    if ($('#ddlRep').val() == "0") {
        toastr.error('Representative is required.');
        $('#ddlRep').focus();
        return false;
    }
    else if ($('#ddlCity').val() == "0") {
        toastr.error('City is required.');
        $('#ddlCity').focus();
        return false;
    }
    else if ($('#ddlState').val() == "0") {
        toastr.error('State is required.');
        $('#ddlState').focus();
        return false;
    }
    else if ($('#ddlCountry').val() == "0") {
        toastr.error('Country is required.');
        $('#ddlCountry').focus();
        return false;
    }
    var checkAddressType = $('#ddlAddressType').val() == "0" ? "" : $('#ddlAddressType').find(':selected').text();
    var checkCity = $('#ddlCity').val() == "0" ? "" : $('#ddlCity').find(':selected').text();
    var checkState = $('#ddlState').val() == "0" ? "" : $('#ddlState').find(':selected').text();
    var checkCountry = $('#ddlCountry').val() == "0" ? "" : $('#ddlCountry').find(':selected').text();
    var checkRep = $('#ddlRep').val() == "0" ? "" : $('#ddlRep').find(':selected').text();
    var isSupplier = $('#chkIsSupplier')[0].checked == true ? "Yes" : "No";
    closestTR.find('.addressType')[0].innerText = checkAddressType;
    closestTR.find('.addressLine1')[0].innerText = $('#txtAddressLine1').val();
    closestTR.find('.addressLine2')[0].innerText = $('#txtAddressLine2').val();
    closestTR.find('.city')[0].innerText = checkCity;
    closestTR.find('.state')[0].innerText = checkState;
    closestTR.find('.country')[0].innerText = checkCountry;
    closestTR.find('.pin')[0].innerText = $('#txtPIN').val();
    closestTR.find('.addressEmail')[0].innerText = $('#txtAddressEmail').val();
    closestTR.find('.addressSamples')[0].innerText = $('#txtAddressSamples').val();
    closestTR.find('.addressGst')[0].innerText = $('#txtAddressGST').val();
    closestTR.find('.zone')[0].innerText = $('#txtZone').val();
    closestTR.find('.rep')[0].innerText = checkRep;
    closestTR.find('.supplier')[0].innerText = isSupplier;
    closestTR.find('.remarks')[0].innerText = $('#txtRemarks').val();
    closestTR.find('.addressTypeId')[0].innerText = $('#ddlAddressType').val();
    closestTR.find('.cityId')[0].innerText = $('#ddlCity').val();
    closestTR.find('.stateId')[0].innerText = $('#ddlState').val();
    closestTR.find('.countryId')[0].innerText = $('#ddlCountry').val();
    closestTR.find('.repId')[0].innerText = $('#ddlRep').val();
    closestTR.find('.chkSupplier')[0].innerText = $('#chkIsSupplier')[0].checked;
    RefreshAddressModal();
});
function DeleteAddressRow(data) {
    var row = $(data).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete")) {
        var table = $("#ViewAddressTableData")[0];
        table.deleteRow(row[0].rowIndex);
    }
}
$('#btnAddSamples').click(function () {
    ShowProgress();
    var url = window.location.pathname;
    var activePage = url;
    $('.nav li a').each(function () {
        //var currentPage = stripTrailingSlash($(this).attr('href'));

        //if (activePage == currentPage) {
            $('.nav-link').removeClass("active");
            $('.nav-item').removeClass("active menu-open");
            $(this).parent().parent().parent().addClass("active menu-open");
            //$(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
            $(this).parent().addClass('active');
            $(this).css('background-color', '#dee2e6');
            $(this).css('color', 'black');
            $('.breadCrumbItem').addClass("active");
            $('.breadCrumbItem')[0].innerHTML = "Samples";
        $('.contentHeader')[0].innerHTML = "Samples";
        //}
    });
    window.location.href = "/Samples/Samples/Index";
});

$('#btnSaveSamples').click(function (e) {

    e.preventDefault();
    var url = "/Samples/Samples/AddSamples";
    var partyEmails = [];
    $('#EmailTableData > tbody > tr').each(function (index, tr) {
        //appUsage[$(this).val()] = $(this).text();
        var row = $(tr).closest("tr");
        if (row.find('.firstEmail')[0].children[0].value == "") {
            toastr.error('Email is required.');
            return false;
        }
            var partyEmailObj = {};
            partyEmailObj.Email_Type = row.find('.firstEmailType :selected').val()
            partyEmailObj.Email = row.find('.firstEmail')[0].children[0].value
            partyEmails.push(partyEmailObj)        
    });
    var partyPhones = [];
    $('#PhoneTableData > tbody > tr').each(function (index, tr) {
        //appUsage[$(this).val()] = $(this).text();
        var row = $(tr).closest("tr");
        if (row.find('.firstPhone')[0].children[0].value == "") {
            toastr.error('Phone number is required.');
            return false;
        }
            var partyPhoneObj = {};
            partyPhoneObj.Phone_Type = row.find('.firstPhoneType :selected').val()
            partyPhoneObj.Phone_Number = row.find('.firstPhone')[0].children[0].value
            partyPhones.push(partyPhoneObj)        
    });   
    var partyAddress = [];
    $('#ViewAddressTableData tbody tr').each(function (index, tr) {
        //appUsage[$(this).val()] = $(this).text();
        var row = $(tr).closest("tr");
        var chk = row.find('.chkSupplier')[0].innerText == "false" ? false : true;
        var partyAddressObj = {};
        partyAddressObj.Samples_Email = row.find('.addressEmail')[0].innerText
        partyAddressObj.Samples_Phone = row.find('.addressSamples')[0].innerText
        partyAddressObj.Address_Type = row.find('.addressTypeId ')[0].innerText
        partyAddressObj.Address_Line1 = row.find('.addressLine1')[0].innerText
        partyAddressObj.Address_Line2 = row.find('.addressLine2')[0].innerText
        partyAddressObj.CountryId = row.find('.cityId')[0].innerText
        partyAddressObj.StateId = row.find('.stateId')[0].innerText
        partyAddressObj.CityId = row.find('.countryId')[0].innerText
        partyAddressObj.GST = row.find('.addressGst')[0].innerText
        partyAddressObj.Supplier_Address = chk
        partyAddressObj.Samples_Remark = row.find('.remarks')[0].innerText
        partyAddressObj.Pincode = row.find('.pin')[0].innerText
        partyAddressObj.Representative_Id = row.find('.repId')[0].innerText
        partyAddressObj.Zone = row.find('.zone')[0].innerText
        partyAddress.push(partyAddressObj)
    });

   
    var additionalEmail = [];
    $('#ExtraEmailTableData > tbody > tr').each(function (index, tr) {
        var row = $(tr).closest("tr");
        if (row.find('.additionalEmail')[0].children[0].value == "") {
            toastr.error('Email is required.');
            return false;
        }
        var extraEmailObj = {};
        extraEmailObj.Email_Type = row.find('.additionalEmailType :selected').val()
        extraEmailObj.Email = row.find('.additionalEmail')[0].children[0].value
        additionalEmail.push(extraEmailObj)
    });
    var additionalPhone = [];
    $('#ExtraPhoneTableData > tbody > tr').each(function (index, tr) {
        var row = $(tr).closest("tr");
        if (row.find('.additionalPhone')[0].children[0].value == "") {
            toastr.error('Phone number is required.');
            return false;
        }
        var extraPhoneObj = {};
        extraPhoneObj.Phone_Type = row.find('.additionalPhoneType :selected').val()
        extraPhoneObj.PhoneNumber = row.find('.additionalPhone')[0].children[0].value
        additionalPhone.push(extraPhoneObj)
    });

    var additionalInfo = [{
        SamplesTitle: $('#ddlTitle').find(':selected').text(),
        SamplesPersonName: $('#txtSamplesPerson').val(),
        Designation: $('#txtDesignation').val(),
        DateOfBirth: ConvertDateFormat($('#txtDOB').val()),
        DateOfAnniversary: ConvertDateFormat($('#txtAnniversary').val()),
        emailListModels: additionalEmail,
        phoneListModels: additionalPhone
    }]
    var obj = {
        Party_Name: $('#txtCompanyName').val(),
        Manufacturer_Type: $('#txtManufacturer').val(),
        PartyEmails: partyEmails,
        PartyPhone: partyPhones,
        PartyAddress: partyAddress,
        Samples: additionalInfo
    }
    if ($('#txtCompanyName').val() == '') {
        toastr.error('Company name is required.');
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
                    toastr.success("Saved successfully");
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
    var url = "/Samples/Samples/UpdateSamples";
    var appUsage = [];
    $('#ddlApplicationUsage :selected').each(function () {
        //appUsage[$(this).val()] = $(this).text();
        var appUsageObj = {};
        appUsageObj.ApplicationUsage_Id = $(this).val()
        appUsage.push(appUsageObj)
    });
    var obj = {
        Samples_Id: $('#txtSamplesId').val(),
        Samples_Name: $('#txtSamples').val(),
        Samples_Price: $('#txtPrice').val(),
        Samples_UpdateOn: ConvertDateFormat($('#txtDate').val()),
        SamplesApplicationUsages: appUsage
    }
    if ($('#txtSamples').val() == '') {
        toastr.error('Samples Name is required.');
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
                    toastr.success("Updated successfully");
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
$('#btnAddEmails').click(function (e) {
    var EmailTypeData = response.filter(item => item.Type == "PARTY-EMAIL-TYPE");
    EmailType = '';
    EmailType += '<option value=0>Select</option>';
    for (var i = 0; i < EmailTypeData.length; i++) {
        EmailType += '<option value=' + EmailTypeData[i].LookupId + '>' + EmailTypeData[i].Description + '</option>';
    }
    var i = $('#EmailTableData tbody tr').length + 1;
    var Newrow = "";
    Newrow += "<tr id=" + i + ">";
    Newrow += "<td class='firstEmailType'><div style='width:200px''><select class='select ' style='width:100%' id='ddlEmail" + i + "'>" + EmailType + "</select></div></td>";
    Newrow += "<td class='firstEmail'><input type='text' class='form-control form-control-sm ' placeholder='Email Id' id='txtEmailId" + i + "'></td>";
    Newrow += '<td ><i class="far fa-times-circle" style="cursor:pointer" onclick="RemoveEmailRow(this)"></i></td>';
    Newrow += '</tr>';
    $('#EmailDataBody tr:last').before(Newrow);
    $('.select').select2();
    //$('.select2-selection').css('border-color', 'blue');
});
function RemoveEmailRow(data) {
    var row = $(data).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete")) {
        var table = $("#EmailTableData")[0];
        table.deleteRow(row[0].rowIndex);
    }
};
$('#btnAddPhone').click(function (e) {
    var PhoneTypeData = response.filter(item => item.Type == "PARTY-PHONE-TYPE");
    PhoneType = '';
    PhoneType += '<option value=0>Select</option>';
    for (var i = 0; i < PhoneTypeData.length; i++) {
        PhoneType += '<option value=' + PhoneTypeData[i].LookupId + '>' + PhoneTypeData[i].Description + '</option>';
    }
    var i = $('#PhoneTableData tbody tr').length - 1;
    var Newrow = "";
    Newrow += "<tr id=" + i + ">";
    Newrow += "<td class='firstPhoneType''><div style='width:200px''><select class='select' style='width:100%' id='ddlPhoneType" + i + "'>" + PhoneType + "</select></div></td>";
    Newrow += "<td class='firstPhone'><input type='text' class='form-control form-control-sm' placeholder='Phone Number' id='txtPhoneNo" + i + "'></td>";
    Newrow += '<td ><i class="far fa-times-circle" style="cursor:pointer" onclick="RemovePhoneRow(this)"></i></td>';
    Newrow += '</tr>';
    $('#PhoneDataBody tr:last').before(Newrow);
    $('.select').select2();
    //$('.select2-selection').css('border-color', 'blue');
});
function RemovePhoneRow(data) {
    var row = $(data).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete")) {
        var table = $("#PhoneTableData")[0];
        table.deleteRow(row[0].rowIndex);
    }
};
$('#btnAddExtraEmails').click(function (e) {
    var EmailTypeData = response.filter(item => item.Type == "PARTY-EMAIL-TYPE");
    EmailType = '';
    EmailType += '<option value=0>Select</option>';
    for (var i = 0; i < EmailTypeData.length; i++) {
        EmailType += '<option value=' + EmailTypeData[i].LookupId + '>' + EmailTypeData[i].Description + '</option>';
    }
    var i = $('#ExtraEmailTableData tbody tr').length - 1;
    var Newrow = "";
    Newrow += "<tr id=" + i + ">";
    Newrow += "<td class='additionalEmailType'><div style='width:200px''><select class='select' style='width:100%' id='ddlEmailPlus" + i + "'>" + EmailType + "</select></div></td>";
    Newrow += "<td class='additionalEmail'><input type='text' class='form-control form-control-sm' placeholder='Email Id' id='txtEmailIdPlus" + i + "'></td>";
    Newrow += '<td ><i class="far fa-times-circle" style="cursor:pointer" onclick="RemoveExtraEmailRow(this)"></i></td>';
    Newrow += '</tr>';
    $('#ExtraEmailDataBody tr:last').before(Newrow);
    $('.select').select2();
    //$('.select2-selection').css('border-color', 'blue');
});
function RemoveExtraEmailRow(data) {
    var row = $(data).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete")) {
        var table = $("#ExtraEmailTableData")[0];
        table.deleteRow(row[0].rowIndex);
    }
};
$('#btnAddExtraPhone').click(function (e) {
    var PhoneTypeData = response.filter(item => item.Type == "PARTY-PHONE-TYPE");
    PhoneType = '';
    PhoneType += '<option value=0>Select</option>';
    for (var i = 0; i < PhoneTypeData.length; i++) {
        PhoneType += '<option value=' + PhoneTypeData[i].LookupId + '>' + PhoneTypeData[i].Description + '</option>';
    }
    var i = $('#ExtraPhoneTableData tbody tr').length - 1;
    var Newrow = "";
    Newrow += "<tr id=" + i + ">";
    Newrow += "<td ><div style='width:200px''><select class='select' style='width:100%' id='ddlPhoneTypePlus" + i + "'>" + PhoneType + "</select></div></td>";
    Newrow += "<td><input type='text' class='form-control form-control-sm' placeholder='Phone Number' id='txtPhoneNoPlus" + i + "'></td>";
    Newrow += '<td ><i class="far fa-times-circle" style="cursor:pointer" onclick="RemoveExtraPhoneRow(this)"></i></td>';
    Newrow += '</tr>';
    $('#ExtraPhoneDataBody tr:last').before(Newrow);
    $('.select').select2();
    //$('.select2-selection').css('border-color', 'blue');
});
function RemoveExtraPhoneRow(data) {
    var row = $(data).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete")) {
        var table = $("#ExtraPhoneTableData")[0];
        table.deleteRow(row[0].rowIndex);
    }
};
function Refresh() {
    $('#txtSamples').val('');
    $('#txtPrice').val('');
    $('#txtDate').val('');
}
function RefreshAddressModal() {
    $('#ddlAddressType').val('0');
    $('#txtAddressLine1').val('');
    $('#txtAddressLine2').val('');
    $('#ddlCity').val('0');
    $('#ddlState').val('0');
    $('#ddlCountry').val('0');
    $('#txtPIN').val('');
    $('#txtAddressEmail').val('');
    $('#txtAddressSamples').val('');
    $('#txtAddressGST').val('');
    $('#ddlRep').val('0');
    $('#txtRemarks').val('');
    $('#txtZone').val('');
    $('#chkIsSupplier')[0].checked = false;

}

