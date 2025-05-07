
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
            $('.breadCrumbItem')[0].innerHTML = "Party Address";
            $('.contentHeader')[0].innerHTML = "Party Address";
        }
    });
});





toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {
    bindMasters();    
    if ($('#hdnPageLoadOption').val() == 'ViewPartyAddressDetails') {

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
        toastr.error('No details found for this record.');
        $('#tblPartyAddressData thead').html('');
        $('#tblPartyAddressData tbody').html('');
    }
}
function bindData(result) {  
    $('#tblPartyAddressData thead').html('');
    $('#tblPartyAddressData tbody').html('');
    if (result.length > 0) {
        var theader = "<tr role='row'>";
        theader += "<th colspan='10'> Company: <b>" + $('#ddlParty').find(':selected').text() +" </b></th>";
        theader += "</tr>";
        $('#tblPartyAddressData thead').append(theader);
        var thead = "<tr role='row'>";
        //thead += "<th style='display:none'>  </th>";
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
        $('#tblPartyAddressData thead').append(thead);
        var row = '';
        for (var i = 0; i < result.length; i++) {

            row += "<tr role='row'>";
            row += "<td>" + result[i].PartyAddress[0].Address_Line1 + "</td>";
            row += "<td>" + result[i].PartyAddress[0].City.Description + "</td>";
            row += "<td>" + result[i].PartyAddress[0].State.Description + "</td>";
            row += "<td>" + result[i].PartyAddress[0].Country.Description + "</td>";
            row += "<td>" + result[i].PartyAddress[0].Pincode + "</td>";
            row += "<td>" + result[i].PartyAddress[0].Contact_Email + "</td>";
            row += "<td>" + result[i].PartyPhone[0].Phone_Number + "</td>";
            row += "<td>" + result[i].PartyAddress[0].Contact_Remark + "</td>";
            row += "<td>" + result[i].PartyAddress[0].AddressType.Description + "</td>";
            row += "<td><input style='margin-top:2%' type='checkBox' checked=" + result[i].PartyAddress[0].Supplier_Address + " disabled /></td>";
            row += "</tr>";

        }
        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblPartyAddressData')) {
            $('#tblPartyAddressData').DataTable().clear().destroy();
        }
        $('#tblPartyAddressDataBody').append(row);   
        $('#tblPartyAddressData').DataTable();
        //$('#tblPartyAddressData').DataTable({
        //    "bPaginate": false,
        //    "bFilter": false,
        //    "bInfo": false,
        //});
        $('#tblPartyAddressData').css('display', 'block');
        
    }
    else {
        HideProgress();
    }
}
$(function () {
    $("#btnPrints").click(function () {
        $('#tblPartyAddressData').printThis({
            //printDelay: 1,
        });
    });
});
   