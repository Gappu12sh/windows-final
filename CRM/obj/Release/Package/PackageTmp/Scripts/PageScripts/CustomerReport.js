
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
            $('.breadCrumbItem')[0].innerHTML = "Customer Report";
            $('.contentHeader')[0].innerHTML = "Customer Report";
        }
    });
});






toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {
    bindMasters();
    if ($('#hdnPageLoadOption').val() == 'ViewCustomerReportDetails') {

    }
    $('.select2').select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4',
    })
});
function bindMasters() {
    if ($('#hdnCompanies').val() != null && $('#hdnCompanies').val() != '') {
        $("#ddlParty").html('');
        var res = JSON.parse($('#hdnCompanies').val());
        $("#ddlParty").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlParty").append('<option value=' + res[i].Party_Id + '>' + res[i].Party_Name + '</option>');
        }
        const jsonArray = JSON.stringify(res);
        localStorage.clear();
        localStorage.setItem('parties', jsonArray);
    }
}
function getContact(data) {
    var partyId = data.value;
    var data = localStorage.getItem('parties');
    const result = JSON.parse(data);
    var record = result.filter(item => item.Party_Id == partyId);
    if (record.length > 0) {
        bindData(record);
    }
    else {
        //toastr.error('No details found for this record.');
        NoDataForId();
        $('#tblCustomerReportData thead').html('');
        $('#tblCustomerReportData tbody').html('');
    }
}
function bindData(result) {
    $('#tblCustomerReportData thead').html('');
    $('#tblCustomerReportData tbody').html('');
    if (result.length > 0) {
        var theader = "<tr role='row'>";
        theader += "<th colspan='11'> Company: <b>" + $('#ddlParty').find(':selected').text() + " </b></th>";
        theader += "</tr>";
        $('#tblCustomerReportData thead').append(theader);
        var thead = "<tr role='row'>";
        //thead += "<th style='display:none'>  </th>";
        thead += "<th> Representative </th>";
        thead += "<th> Address </th>";
        thead += "<th> City </th>";
        thead += "<th> State </th>";
        thead += "<th> Country </th>";
        thead += "<th> PIN </th>";
        thead += "<th> Email </th>";
        thead += "<th> Contact No </th>";
        thead += "<th> Contact Remark </th>";
        thead += "<th> Address Type </th>";
        thead += "<th> Is Supplier Address </th>";
        thead += "</tr>";
        $('#tblCustomerReportData thead').append(thead);
        var row = '';

        for (var i = 0; i < result.length; i++) {
            var partyAddress = result[i].PartyAddress;
            for (var k = 0; k < partyAddress.length; k++) {
                row += "<tr role='row'>";
                row += "<td>" + partyAddress[k].Representatives.Rep_Name + "</td>";
                row += "<td>" + partyAddress[k].Address_Line1 + "</td>";
                row += "<td>" + partyAddress[k].City.Description + "</td>";
                row += "<td>" + partyAddress[k].State.Description + "</td>";
                row += "<td>" + partyAddress[k].Country.Description + "</td>";
                row += "<td>" + partyAddress[k].Pincode + "</td>";
                row += "<td>" + partyAddress[k].Contact_Email + "</td>";
                row += "<td>" + partyAddress[k].Contact_Phone + "</td>";
                row += "<td>" + partyAddress[k].Contact_Remark + "</td>";
                row += "<td>" + partyAddress[k].AddressType.Description + "</td>";
                row += "<td><input style='margin-top:2%' type='checkBox' checked=" + partyAddress[k].Supplier_Address + " disabled /></td>";
                row += "</tr>";
            }
        }
        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblCustomerReportData')) {
            $('#tblCustomerReportData').DataTable().clear().destroy();
        }
        $('#tblCustomerReportDataBody').append(row);
        $('#tblCustomerReportData').DataTable();
        //$('#tblCustomerReportData').DataTable({
        //    "bPaginate": false,
        //    "bFilter": false,
        //    "bInfo": false,
        //});
        $('#tblCustomerReportData').css('display', 'block');

    }
    else {
        HideProgress();
    }
}
$(function () {
    $("#btnPrints").click(function () {
        $('#tblCustomerReportData').printThis({
            //printDelay: 1,
        });
    });
});

$('#btnSaveSamples').click(function (e) {

    e.preventDefault();
    var url = "/Samples/Samples/AddSamples";
    if ($('#ddlParty').val() == 0) {
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
            type: "Get",
            success: function (result) {
                if (result.ErrorCodes != null) {
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    HideProgress();
                }
                else {
                    //toastr.success(SuccessMessage);
                    SweetSuccessMessage();
                    HideProgress();
                    currentPage = 'Add';
                    const jsonArray = JSON.stringify(obj);
                    localStorage.clear();
                    localStorage.setItem('sample', jsonArray);
                    localStorage.setItem('currentPage', currentPage);
                    setTimeout(function () { window.location = "/Samples/SamplesDetails/Index"; }, 1000);
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
