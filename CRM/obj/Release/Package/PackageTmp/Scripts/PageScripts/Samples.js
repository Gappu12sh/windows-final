var selectedApplicationUsage = new Array();
var getApplicationUsageDetailsData = new Array();
var response;
var closestTR;
var currentPage;
var selectedProductPrice;
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
            $(this).parent().addClass('active');
            $(this).css('background-color', '#dee2e6');
            $(this).css('color', 'black');
            $('.breadCrumbItem').addClass("active");
            $('.breadCrumbItem')[0].innerHTML = "Samples";
            $('.contentHeader')[0].innerHTML = "Samples";
        }
    });
});
jQuery(document).ready(function ($) {
    if ($('#hdnPageLoadOption').val() == 'ViewSamplesDetails') {
        GetDetails();
    }
    if ($('#hdnPageLoadOption').val() == 'Samples') {
        bindMasters();
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
        $('.select2').select2();
        $('.select2bs4').select2({
            theme: 'bootstrap4',

        })
    }
    if ($('#hdnPageLoadOption').val() == 'EditSamples') {
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
        if ($('#hiddenQuotationId').val() != '') {
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
            bindMasters();
            EditSamples($('#hiddenQuotationId').val());
        }
    }
    $('.select2').select2({ dropdownAutoWidth: true });
    $('.select2bs4').select2({
        theme: 'bootstrap4',

    })

    $("#txtQuotationDate").datepicker({ dateFormat: 'dd/mm/yy', changeYear: true, });
    $("#txtDate").datepicker({
        changeYear: true,
        dateFormat: 'dd/mm/yy', beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 9999);
            }, 0);
        }
    });
});
$('#btnAddNewProduct').click(function () {
    $('#btnSave').css('display', 'block');
    $('#header')[0].innerText = "Add Product";
    RefreshProduct();
    bindApplicationForProduct();
    $('#modal-product').modal('toggle');
});
$('#btnAddSamples').click(function () {
    ShowProgress();
    window.location.href = "/Samples/Samples/Index";
});





toastr.options = { "timeOut": 5000 };



function GetDetails() {

    ShowProgress();
    var obj = {};
    $.ajax({
        url: "/Samples/SamplesDetails/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "data": JSON.stringify(obj) }),
        type: "Get",
        success: function (result) {
            if (result == null) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.Samples.IsAdd) {
                    $('#dvAddButton').show();
                }
                HideProgress();
            }
            else {
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.Samples != null) {
                    if (permissions.Samples.IsView) {
                        bindData(result);
                        var data = localStorage.getItem('currentPage');
                        if (data == 'Add' || data == 'Update') {
                            InvoiceModel();
                        }
                        localStorage.removeItem("currentPage");
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

function DeleteSamples(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/Samples/Samples/DeleteDetails/" + Id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //data: { id: Id },
            type: "Delete",
            success: function (result) {
                var a = result;
                toastr.error('Details removed successfully.');
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
        toastr.error('No details found for this record.');
    }
}





function bindData(result) {
    $('#tblSamplesData thead').html('');
    $('#tblSamplesData tbody').html('');
    var permissions = JSON.parse($('#hiddenPermission').val());
    if (permissions.Samples.IsAdd) {
        $('#dvAddButton').show();
    }
    if (result.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'>  </th>";
        thead += "<th style='width: 55px;'> Sr.No. </th>"; // Fixed width for consistency
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblSamplesData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Company Name : activate to sort column descending'> Company Name</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblSamplesData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Manufacturer : activate to sort column descending'> Quotation No</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblSamplesData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Manufacturer : activate to sort column descending'> Quotation Master ID</th>";
        if (permissions.Samples.IsEdit || permissions.Samples.IsDeleted) {
            thead += "<th> Action </th>";
        }
        thead += "</tr>";
        $('#tblSamplesData thead').append(thead);

        var display = permissions.Samples.IsEdit == true ? "inline" : "none";
        var row = '';

        for (var i = 0; i < result.length; i++) {
            row += "<tr role='row'>";
            row += "<td class='sorting_1' id='SamplesId" + result[i].QuotationMasterId + "' style='display:none'>" + result[i].QuotationMasterId + "</td>";
            row += "<td></td>"; // Placeholder for dynamic Sr.No.
            row += "<td>" + result[i].PartyName + "</td>";
            row += "<td>" + result[i].QuotationNo + "</td>";
            row += "<td>" + result[i].QuotationMasterId + "</td>";
            if (permissions.Samples.IsEdit || permissions.Samples.IsDeleted) {
                row += "<td><a href='/Samples/EditSamples/Index?id=" + result[i].QuotationMasterId + "'><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "'></i></a></td>";
            }
            row += "</tr>";
        }

        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblSamplesData')) {
            $('#tblSamplesData').DataTable().clear().destroy();
        }

        $('#tblSamplesData tbody').append(row);

        // Initialize DataTable with dynamic Sr.No. logic
        var table = $('#tblSamplesData').DataTable({
            "order": [],
            "columnDefs": [{
                "targets": 1, // Sr.No. column index
                "searchable": false,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    return meta.row + 1; // Display Sr.No. dynamically
                }
            }]
        });

        table.on('draw', function () {
            table.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1; // Update Sr.No. after sorting/filtering
            });
        });
    } else {
        HideProgress();
    }
}



















function bindMasters() {
    if ($('#hdnCompany').val() != null && $('#hdnCompany').val() != '') {
        $("#ddlCompany").html('');
        var res = JSON.parse($('#hdnCompany').val());
        $("#ddlCompany").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlCompany").append('<option value=' + res[i].Party_Id + '>' + res[i].Party_Name + '</option>');

        }

    }
    if ($('#hdnProduct').val() != null && $('#hdnProduct').val() != '') {
        $("#ddlProduct").html('');
        var res = JSON.parse($('#hdnProduct').val());
        $("#ddlProduct").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlProduct").append('<option value=' + res[i].Product_Id + '>' + res[i].Product_Name + '</option>');
        }
        var jsonArray = JSON.stringify(res)
        localStorage.removeItem('product');
        localStorage.setItem('product', jsonArray);
    }
    if ($('#hdnApplicationUsage').val() != null && $('#hdnApplicationUsage').val() != '') {
        $("#ddlAppUsage").html('');
        var res = JSON.parse($('#hdnApplicationUsage').val());
        $("#ddlAppUsage").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlAppUsage").append('<option value=' + res[i].ApplicationUsage_Id + '>' + res[i].ApplicationUsage_Name + '</option>');
        }
    }
    if ($('#hdnLookup').val() != null && $('#hdnLookup').val() != '') {
        response = JSON.parse($('#hdnLookup').val());
        let termsCondition = response.filter(item => item.Type == "TERMS");

        if (termsCondition.length > 0) {
            $('#txtTermCond').val(termsCondition[0].Description);
        }
    }
    if ($('#hdnLookup').val() != null && $('#hdnLookup').val() != '') {
        // Clear existing options in the dropdown
        $("#ddlQuantity").html('');

        // Parse the JSON data from the hidden field
        response = JSON.parse($('#hdnLookup').val());

        // Filter data to get only the items with Type "SAMPLE-QUANTITY-TYPE"
        let quantity = response.filter(item => item.Type == "SAMPLE-QUANTITY-TYPE");

        // Sort the array by numeric value in the Description in ascending order
        quantity.sort((a, b) => {
            // Extract the numeric part from Description and compare
            let numA = parseFloat(a.Description);  // Assuming Description starts with a number
            let numB = parseFloat(b.Description);
            return numA - numB; // Sorting in ascending order
        });

        // Append a default "Select" option
        $("#ddlQuantity").append('<option value=0>Select</option>');

        // Loop through the sorted array and append options to the dropdown
        for (var i = 0; i < quantity.length; i++) {
            $("#ddlQuantity").append('<option value=' + quantity[i].LookupId + '>' + quantity[i].Description + '</option>');
        }
    }

}
function bindApplicationForProduct() {
    if ($('#hdnApplicationUsage').val() != null && $('#hdnApplicationUsage').val() != '') {
        $("#ddlApplicationUsage").html('');
        var res = JSON.parse($('#hdnApplicationUsage').val());
        $("#ddlApplicationUsage").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlApplicationUsage").append('<option value=' + res[i].ApplicationUsage_Id + '>' + res[i].ApplicationUsage_Name + '</option>');
        }
    }
}
function bindContactDetails() {
    $("#ddlAttTo").html('');
    $("#ddlAddress").html('');
    var party = JSON.parse($('#hdnCompany').val());
    let selected_Party = party.filter(item => item.Party_Id == $('#ddlCompany').val());
    if (selected_Party[0].PartyAddress.length > 0) {
        $("#ddlAddress").html('');
        $("#ddlAddress").append('<option value=0>Select</option>');
        $("#ddlAttTo").append('<option value=0>Select</option>');
        for (var i = 0; i < selected_Party[0].PartyAddress.length; i++) {
            if (selected_Party[0].PartyAddress[i].Contact.length > 0) {

                for (var k = 0; k < selected_Party[0].PartyAddress[i].Contact.length; k++) {
                    $("#ddlAttTo").append('<option value=' + selected_Party[0].PartyAddress[i].Contact[k].Contact_Id + '>' + selected_Party[0].PartyAddress[i].Contact[k].ContactPersonName + '</option>');
                }
            }
            $("#ddlAddress").append('<option value=' + selected_Party[0].PartyAddress[i].PartyAddress_Id + '>' + selected_Party[0].PartyAddress[i].FullAddress + '</option>');
        }
    }
}
$('#btnSaveSamples').click(function (e) {
    e.preventDefault();
    var url = "/Samples/Samples/AddSamples";
    var quotationList = [];

    if ($('#ViewQuotationTableData > tbody > tr').length > 0) {
        $('#ViewQuotationTableData > tbody > tr').each(function () {
            var row = $(this);
            var multiplier = parseInt(row.find('.quantityMultiple').text()) || 1;

            console.log(`Saving row - Sample: ${row.find('.sampleName').text()}, Multiplier: ${multiplier}`);

            var quotation = {
                SampleName: row.find('.sampleName').text(),
                ActualName: row.find('.productId').text(),
                Group: row.find('.appUsage').text(),
                QuantityId: row.find('.quantityId').text(),
                Rate: row.find('.rate').text(),
                GroupId: row.find('.appUsageId').text(),
                ActualNameValue: row.find('.product').text(),
                QuantityName: row.find('.quantityDesc').text(),
                QuantityMutiple: multiplier,
                QuotationDetailsId: row.find('.quotationDetailsId').text()
            };
            quotationList.push(quotation);
        });
    }
    else {
        var multiplier = parseInt($('#txtMultiplier').val()) || 1;
        var quotation = {
            SampleName: $('#txtSampleName').val(),
            ActualName: $('#ddlProduct').val(),
            Group: $('#ddlAppUsage').find(':selected').text(),
            QuantityId: $('#ddlQuantity').val(),
            Rate: $('#txtRate').val(),
            GroupId: $('#ddlAppUsage').val(),
            ActualNameValue: $('#ddlProduct').find(':selected').text(),
            QuantityName: $('#ddlQuantity').find(':selected').text(),
            QuantityMutiple: multiplier,
            QuotationDetailsId: "0"
        };
        quotationList.push(quotation);
    }

    console.log("Final payload:", quotationList);

    var obj = {
        QuotationNo: $('#txtQuotationNo').val(),
        RegisterNo: $('#txtRegisterNo').val(),
        PartyId: $('#ddlCompany').val(),
        AddressId: $('#ddlAddress').val(),
        ShippingAddress: $('#ddlAddress').find(':selected').text(),
        KindAttTo: $('#ddlAttTo').find(':selected').text(),
        PartyName: $('#ddlCompany').find(':selected').text(),
        ContactId: $('#ddlAttTo').val(),
        Terms: $('#txtTermCond').val(),
        ShippingAddressRemarks: $('#txtRemarks').val(),
        QuotationDate: ConvertDateFormatYYMMDD($('#txtQuotationDate').val()),
        QuotationDetails: quotationList
    };

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
                if (result.ErrorCodes != null) {
                    SweetErrorMessage(result.ErrorCodes);
                    HideProgress();
                }
                else {
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







//$('#btnUpdateSamples').click(function (e) {

//    e.preventDefault();
//    var url = "/Samples/EditSamples/UpdateSamples";
//    var quotationList = [];
//    if ($('#ViewQuotationTableData > tbody > tr').length > 0) {
//        $('#ViewQuotationTableData > tbody > tr').each(function (index, tr) {
//            //appUsage[$(this).val()] = $(this).text();
//            var row = $(tr).closest("tr");
//            var quotation = {};
//            quotation.SampleName = row.find('.sampleName')[0].innerText;
//            quotation.ActualName = row.find('.productId')[0].innerText;
//            quotation.Group = row.find('.appUsage')[0].innerText;
//            quotation.QuantityId = row.find('.quantityId')[0].innerText
//            //quotation.Quantity = row.find('.quantity')[0].innerText;
//            //quotation.UnitId = row.find('.unitId')[0].innerText;
//            quotation.Rate = row.find('.rate')[0].innerText;
//            quotation.GroupId = row.find('.appUsageId')[0].innerText;
//            quotation.ActualNameValue = row.find('.product')[0].innerText;
//            quotation.QuotationDetailsId = row.find('.quotationDetailsId')[0].innerText;
//            //quotation.UnitName = row.find('.unit')[0].innerText;
//            quotation.QuantityName = row.find('.quantityDesc')[0].innerText;
//            quotationList.push(quotation)
//        });
//    }
//    else {
//        var quotation = {};
//        quotation.SampleName = $('#txtSampleName').val();
//        quotation.ActualName = $('#ddlProduct').val();
//        quotation.Group = $('#ddlAppUsage').find(':selected').text();
//        quotation.QuantityId = $('#ddlQuantity').val();
//        //quotation.Quantity = $('#txtQuantity').val();
//        //quotation.UnitId = $('#ddlUnit').val();
//        quotation.Rate = $('#txtRate').val();
//        quotation.GroupId = $('#ddlAppUsage').val();
//        quotation.ActualNameValue = $('#ddlProduct').find(':selected').text();
//        quotation.QuotationDetailsId = $('#txtQuotationDetailsId').val();
//        //quotation.UnitName = $('#ddlUnit').find(':selected').text();
//        quotation.QuantityName = $('#ddlQuantity').find(':selected').text();
//        quotationList.push(quotation)
//    }

//    var obj = {
//        QuotationMasterId: $('#txtQuotationId').val(),
//        QuotationNo: $('#txtQuotationNo').val(), ////////
//        RegisterNo: $('#txtRegisterNo').val(), /////////
//        PartyId: $('#ddlCompany').val(), /////////////
//        AddressId: $('#ddlAddress').val(), //////////////
//        ShippingAddress: $('#ddlAddress').find(':selected').text(),/////
//        KindAttTo: $('#ddlAttTo').find(':selected').text(), /////////
//        PartyName: $('#ddlCompany').find(':selected').text(),
//        ContactId: $('#ddlAttTo').val(),
//        Terms: $('#txtTermCond').val(), /////////////
//        ShippingAddressRemarks: $('#txtRemarks').val(), //////////////
//        QuotationDate: ConvertDateFormatYYMMDD($('#txtQuotationDate').val()),
//        StandardQuotDate: $('#txtQuotationDate').val(),
//        QuotationDetails: quotationList
//    }
//    if ($('#txtCompanyName').val() == '') {
//        toastr.error('Company name is required.');
//        return false;
//    }

//    else {
//        ShowProgress();
//        $.ajax({
//            url: url,
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: JSON.stringify({ "data": JSON.stringify(obj) }),
//            type: "Put",
//            success: function (result) {
//                if (result.ErrorCodes != null) {
//                    //toastr.error(ErrorCodes(result.ErrorCodes));
//                    SweetErrorMessage(result.ErrorCodes);
//                    HideProgress();
//                }
//                else {
//                    //toastr.success(UpdateMessage());
//                    SweetUpdateMessage();
//                    currentPage = 'Update';
//                    HideProgress();
//                    const jsonArray = JSON.stringify(obj);
//                    localStorage.clear();
//                    localStorage.setItem('sample', jsonArray);
//                    localStorage.setItem('currentPage', currentPage);
//                    setTimeout(function () { window.location = "/Samples/SamplesDetails/Index"; }, 1000);

//                    //GenerateInvoice();


//                }
//            },
//            error: function (msg) {
//                toastr.error(msg);
//                HideProgress();
//                return false;
//            }
//        });
//    }
//});
$('#btnUpdateSamples').click(function (e) {
    e.preventDefault();
    var url = "/Samples/EditSamples/UpdateSamples";
    var quotationList = [];
    if ($('#ViewQuotationTableData > tbody > tr').length > 0) {
        $('#ViewQuotationTableData > tbody > tr').each(function (index, tr) {
            var row = $(tr).closest("tr");
            var quotation = {};
            quotation.SampleName = row.find('.sampleName')[0].innerText;
            quotation.ActualName = row.find('.productId')[0].innerText;
            quotation.Group = row.find('.appUsage')[0].innerText;
            quotation.QuantityId = row.find('.quantityId')[0].innerText;
            quotation.Rate = row.find('.rate')[0].innerText;
            quotation.GroupId = row.find('.appUsageId')[0].innerText;
            quotation.ActualNameValue = row.find('.product')[0].innerText;
            quotation.QuotationDetailsId = row.find('.quotationDetailsId')[0].innerText;
            quotation.QuantityName = row.find('.quantityDesc')[0].innerText;
            quotation.QuantityMutiple = parseInt(row.find('.quantityMultiple')[0].innerText) || 1; // Include multiplier
            quotationList.push(quotation);
        });
    }
    else {
        var quotation = {};
        quotation.SampleName = $('#txtSampleName').val();
        quotation.ActualName = $('#ddlProduct').val();
        quotation.Group = $('#ddlAppUsage').find(':selected').text();
        quotation.QuantityId = $('#ddlQuantity').val();
        quotation.Rate = $('#txtRate').val();
        quotation.GroupId = $('#ddlAppUsage').val();
        quotation.ActualNameValue = $('#ddlProduct').find(':selected').text();
        quotation.QuotationDetailsId = $('#txtQuotationDetailsId').val();
        quotation.QuantityName = $('#ddlQuantity').find(':selected').text();
        quotation.QuantityMutiple = parseInt($('#txtMultiplier').val()) || 1; // Include multiplier
        quotationList.push(quotation);
    }

    var obj = {
        QuotationMasterId: $('#txtQuotationId').val(),
        QuotationNo: $('#txtQuotationNo').val(),
        RegisterNo: $('#txtRegisterNo').val(),
        PartyId: $('#ddlCompany').val(),
        AddressId: $('#ddlAddress').val(),
        ShippingAddress: $('#ddlAddress').find(':selected').text(),
        KindAttTo: $('#ddlAttTo').find(':selected').text(),
        PartyName: $('#ddlCompany').find(':selected').text(),
        ContactId: $('#ddlAttTo').val(),
        Terms: $('#txtTermCond').val(),
        ShippingAddressRemarks: $('#txtRemarks').val(),
        QuotationDate: ConvertDateFormatYYMMDD($('#txtQuotationDate').val()),
        StandardQuotDate: $('#txtQuotationDate').val(),
        QuotationDetails: quotationList
    };

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
            type: "Put",
            success: function (result) {
                if (result.ErrorCodes != null) {
                    SweetErrorMessage(result.ErrorCodes);
                    HideProgress();
                }
                else {
                    SweetUpdateMessage();
                    currentPage = 'Update';
                    HideProgress();
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


function btnAddQuotationDetail() {
    $('#divQuotationDetails').show();
    if ($('#ddlProduct').val() == "0") {
        toastr.error('Product is required.');
        $('#ddlProduct').focus();
        return false;
    }
    else if ($('#txtSampleName').val() == "") {
        toastr.error('Sample name is required.');
        $('#txtSampleName').focus();
        return false;
    }
    else if ($('#ddlQuantity').val() == "0") {
        toastr.error('Quantity is required.');
        $('#ddlQuantity').focus();
        return false;
    }

    var multiplier = parseInt($('#txtMultiplier').val()) || 1;
    console.log("Adding row with multiplier:", multiplier); // Debug log

    var i = $('#ViewQuotationTableData tbody tr').length;
    var product = $('#ddlProduct').val() == "0" ? "" : $('#ddlProduct').find(':selected').text();
    var appUsage = $('#ddlAppUsage').val() == "0" ? "" : $('#ddlAppUsage').find(':selected').text();
    var quantity = $('#ddlQuantity').val() == "0" ? "" : $('#ddlQuantity').find(':selected').text();

    var Newrow = `<tr id="${i}">
        <td class='appUsage'>${appUsage}</td>
        <td class='sampleName'>${$('#txtSampleName').val()}</td>
        <td class='product'>${product}</td>
        <td class='quantityDesc'>${quantity}</td>
        <td class='rate'>${$('#txtRate').val()}</td>
        <td><input type='checkbox' checked disabled /></td>
        <td class='appUsageId' style='display:none'>${$('#ddlAppUsage').val()}</td>
        <td class='productId' style='display:none'>${$('#ddlProduct').val()}</td>
        <td class='quantityId' style='display:none'>${$('#ddlQuantity').val()}</td>
        <td class='quantityMultiple' style='display:none'>${multiplier}</td>
        <td class='quotationDetailsId' style='display:none'>0</td>
        <td>
            <a onclick='EditDetailsRow(this)'><i class='fas fa-edit' style='font-size:20px;color:#902ca8'></i></a>
            <a onclick='DeleteDetailsRow(this)'><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a>
        </td>
    </tr>`;

    $('#ViewQutationDataBody').append(Newrow);
    RefreshQuotationDetails();
}













function RefreshQuotationDetails() {
    $('#txtSampleName').val('');
    $('#txtRate').val('');
    if ($('#hdnLookup').val() != null && $('#hdnLookup').val() != '') {
        $("#ddlQuantity").html('');
        response = JSON.parse($('#hdnLookup').val());
        let quantity = response.filter(item => item.Type == "SAMPLE-QUANTITY-TYPE");
        $("#ddlQuantity").append('<option value=0>Select</option>');
        for (var i = 0; i < quantity.length; i++) {
            $("#ddlQuantity").append('<option value=' + quantity[i].LookupId + '>' + quantity[i].Description + '</option>');
        }
    }
    if ($('#hdnProduct').val() != null && $('#hdnProduct').val() != '') {
        $("#ddlProduct").html('');
        var res = JSON.parse($('#hdnProduct').val());
        $("#ddlProduct").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlProduct").append('<option value=' + res[i].Product_Id + '>' + res[i].Product_Name + '</option>');
        }
    }
    if ($('#hdnApplicationUsage').val() != null && $('#hdnApplicationUsage').val() != '') {
        $("#ddlAppUsage").html('');
        var res = JSON.parse($('#hdnApplicationUsage').val());
        $("#ddlAppUsage").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlAppUsage").append('<option value=' + res[i].ApplicationUsage_Id + '>' + res[i].ApplicationUsage_Name + '</option>');
        }
    }
}

//function EditDetailsRow(data) {
//    RefreshQuotationDetails();
//    var row = $(data).closest("tr");
//    closestTR = $(data).closest("tr");
//    $('#ddlAppUsage').val(row.find('.appUsageId').text()).attr('selected', 'selected');
//    $('#txtSampleName').val(row.find('.sampleName').text());
//    $('#ddlQuantity').val(row.find('.quantityId').text()).attr('selected', 'selected');
//    $('#txtRate').val(row.find('.rate').text());
//    $('#ddlProduct').val(row.find('.productId').text()).attr('selected', 'selected');
//    $('#txtMultiplier').val(row.find('.quantityMultiple').text()); // Set multiplier from row

//    var productId = row.find('.productId').text();
//    var data = localStorage.getItem('product');
//    var result = JSON.parse(data);
//    if (result != null) {
//        selectedProductPrice = result.filter(x => x.Product_Id == productId)[0].Product_Price;
//    }

//    $('#btnAddQuotationDetails').hide();
//    $('#btnUpdateQuotationDetails').show();
//}
function EditDetailsRow(data) {
    RefreshQuotationDetails();
    var row = $(data).closest("tr");
    closestTR = $(data).closest("tr");
    $('#ddlAppUsage').val(row.find('.appUsageId').text()).attr('selected', 'selected');
    $('#txtSampleName').val(row.find('.sampleName').text());
    $('#ddlQuantity').val(row.find('.quantityId').text()).attr('selected', 'selected');
    $('#txtRate').val(row.find('.rate').text());
    $('#ddlProduct').val(row.find('.productId').text()).attr('selected', 'selected');
    $('#txtMultiplier').val(row.find('.quantityMultiple').text() || 1); // Set multiplier from row (default to 1 if empty)

    var productId = row.find('.productId').text();
    var data = localStorage.getItem('product');
    var result = JSON.parse(data);
    if (result != null) {
        selectedProductPrice = result.filter(x => x.Product_Id == productId)[0].Product_Price;
    }

    $('#btnAddQuotationDetails').hide();
    $('#btnUpdateQuotationDetails').show();
}





//function btnUpdateQuotationDetail() {
//    if ($('#ddlProduct').val() == "0") {
//        toastr.error('Product is required.');
//        $('#ddlProduct').focus();
//        return false;
//    }
//    else if ($('#txtSampleName').val() == "") {
//        toastr.error('Sample name is required.');
//        $('#txtSampleName').focus();
//        return false;
//    }
//    else if ($('#ddlQuantity').val() == "0") {
//        toastr.error('Quantity is required.');
//        $('#ddlQuantity').focus();
//        return false;
//    }

//    var multiplier = parseInt($('#txtMultiplier').val()) || 1;

//    closestTR.find('.appUsage').text($('#ddlAppUsage').find(':selected').text());
//    closestTR.find('.sampleName').text($('#txtSampleName').val());
//    closestTR.find('.product').text($('#ddlProduct').find(':selected').text());
//    closestTR.find('.quantityDesc').text($('#ddlQuantity').find(':selected').text());
//    closestTR.find('.quantityId').text($('#ddlQuantity').val());
//    closestTR.find('.quantityMultiple').text(multiplier); // Update multiplier in row
//    closestTR.find('.rate').text($('#txtRate').val());
//    closestTR.find('.appUsageId').text($('#ddlAppUsage').val());
//    closestTR.find('.productId').text($('#ddlProduct').val());

//    RefreshQuotationDetails();
//    $('#btnAddQuotationDetails').show();
//    $('#btnUpdateQuotationDetails').hide();
//}
function btnUpdateQuotationDetail() {
    if ($('#ddlProduct').val() == "0") {
        toastr.error('Product is required.');
        $('#ddlProduct').focus();
        return false;
    }
    else if ($('#txtSampleName').val() == "") {
        toastr.error('Sample name is required.');
        $('#txtSampleName').focus();
        return false;
    }
    else if ($('#ddlQuantity').val() == "0") {
        toastr.error('Quantity is required.');
        $('#ddlQuantity').focus();
        return false;
    }

    var multiplier = parseInt($('#txtMultiplier').val()) || 1;

    closestTR.find('.appUsage').text($('#ddlAppUsage').find(':selected').text());
    closestTR.find('.sampleName').text($('#txtSampleName').val());
    closestTR.find('.product').text($('#ddlProduct').find(':selected').text());
    closestTR.find('.quantityDesc').text($('#ddlQuantity').find(':selected').text());
    closestTR.find('.quantityId').text($('#ddlQuantity').val());
    closestTR.find('.quantityMultiple').text(multiplier); // Update multiplier in row
    closestTR.find('.rate').text($('#txtRate').val());
    closestTR.find('.appUsageId').text($('#ddlAppUsage').val());
    closestTR.find('.productId').text($('#ddlProduct').val());

    RefreshQuotationDetails();
    $('#btnAddQuotationDetails').show();
    $('#btnUpdateQuotationDetails').hide();
}









function DeleteDetailsRow(data) {
    var row = $(data).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete")) {
        var table = $("#ViewQuotationTableData")[0];
        table.deleteRow(row[0].rowIndex);
    }
    if ($('#ViewQuotationTableData tbody tr').length == 0) {
        $('#divQuotationDetails').hide();
    }
}

function EditSamples(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/Samples/EditSamples/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                bindMasters();
                $('#txtQuotationId').val(result.QuotationMasterId);
                $('#ddlCompany').val(result.PartyId).attr('selected', 'selected');
                bindContactDetails(result.PartyId)
                $('#ddlAttTo').val(result.ContactId).attr('selected', 'selected');
                $('#ddlAddress').val(result.AddressId).attr('selected', 'selected');
                $('#txtQuotationDate').val(ConvertDateDDMMYYYY(result.QuotationDate));
                $('#txtQuotationNo').val(result.QuotationNo);
                $('#txtRegisterNo').val(result.RegisterNo);
                $('#txtRemarks').val(result.ShippingAddressRemarks);
                bindEditQuotationDetails(result.QuotationDetails)
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
//function bindEditQuotationDetails(result) {
//    $('#divQuotationDetails').show();
//    $('#ViewQutationDataBody tbody').html('');
//    if (result.length > 0) {
//        for (var i = 0; i < result.length; i++) {
//            var Newrow = "";
//            Newrow += "<tr id=" + i + ">";
//            Newrow += "<td class='appUsage'>" + result[i].Group + "</td>";
//            Newrow += "<td class='sampleName'>" + result[i].SampleName + "</td>";
//            Newrow += "<td class='product'>" + result[i].ActualNameValue + "</td>";
//            Newrow += "<td class='quantityDesc'>" + result[i].Quantity.Description + "</td>";
//            //Newrow += "<td class='unit'>" + result[i].Unit.Description + "</td>";
//            Newrow += "<td class='rate'>" + result[i].Rate + "</td>";
//            Newrow += "<td><input type='checkBox' checked=checked disabled /></td>";
//            Newrow += "<td class='appUsageId' style='display:none'>" + result[i].GroupId + "</td>";
//            Newrow += "<td class='productId' style='display:none'>" + result[i].ActualName + "</td>";
//            Newrow += "<td class='quantityId' style='display:none'>" + result[i].QuantityId + "</td>";
//            //Newrow += "<td class='unitId' style='display:none'>" + result[i].UnitId + "</td>";
//            Newrow += "<td class='quotationDetailsId' style='display:none'>" + result[i].QuotationDetailsId + "</td>";
//            Newrow += "<td><a onclick=EditDetailsRow(this)><i class='fas fa-edit' style='font-size:20px;color:#902ca8'></i></a> &nbsp;<a onclick=DeleteDetailsRow(this)><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
//            Newrow += "</tr>";
//            $('#ViewQutationDataBody').append(Newrow);
//        }

//        HideProgress();
//    }
//    else {
//        HideProgress();
//    }
//    //}
//}


//function bindEditQuotationDetails(result) {
//    $('#divQuotationDetails').show();
//    $('#ViewQutationDataBody tbody').html('');
//    if (result.length > 0) {
//        for (var i = 0; i < result.length; i++) {
//            var multiplier = result[i].QuantityMutiple || 1; // Default to 1 if not specified

//            var Newrow = "";
//            Newrow += "<tr id=" + i + ">";
//            Newrow += "<td class='appUsage'>" + result[i].Group + "</td>";
//            Newrow += "<td class='sampleName'>" + result[i].SampleName + "</td>";
//            Newrow += "<td class='product'>" + result[i].ActualNameValue + "</td>";
//            Newrow += "<td class='quantityDesc'>" + result[i].QuantityName + "</td>";
//            Newrow += "<td class='rate'>" + result[i].Rate + "</td>";
//            Newrow += "<td><input type='checkBox' checked=checked disabled /></td>";
//            Newrow += "<td class='appUsageId' style='display:none'>" + result[i].GroupId + "</td>";
//            Newrow += "<td class='productId' style='display:none'>" + result[i].ActualName + "</td>";
//            Newrow += "<td class='quantityId' style='display:none'>" + result[i].QuantityId + "</td>";
//            Newrow += "<td class='quantityMultiple' style='display:none'>" + multiplier + "</td>";
//            Newrow += "<td class='quotationDetailsId' style='display:none'>" + result[i].QuotationDetailsId + "</td>";
//            Newrow += "<td><a onclick=EditDetailsRow(this)><i class='fas fa-edit' style='font-size:20px;color:#902ca8'></i></a> &nbsp;<a onclick=DeleteDetailsRow(this)><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
//            Newrow += "</tr>";
//            $('#ViewQutationDataBody').append(Newrow);
//        }
//        HideProgress();
//    }
//    else {
//        HideProgress();
//    }
//}

function bindEditQuotationDetails(result) {
    $('#divQuotationDetails').show();
    $('#ViewQutationDataBody tbody').html('');
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            var multiplier = result[i].QuantityMutiple || 1; // Default to 1 if not specified

            // Handle both old and new data structures for quantity
            var quantityName = result[i].QuantityName;
            if (!quantityName && result[i].Quantity && result[i].Quantity.Description) {
                quantityName = result[i].Quantity.Description;
            }
            quantityName = quantityName || ''; // Fallback to empty string if still null

            var Newrow = "";
            Newrow += "<tr id=" + i + ">";
            Newrow += "<td class='appUsage'>" + (result[i].Group || '') + "</td>";
            Newrow += "<td class='sampleName'>" + (result[i].SampleName || '') + "</td>";
            Newrow += "<td class='product'>" + (result[i].ActualNameValue || '') + "</td>";
            Newrow += "<td class='quantityDesc'>" + quantityName + "</td>";
            Newrow += "<td class='rate'>" + (result[i].Rate || '') + "</td>";
            Newrow += "<td><input type='checkBox' checked=checked disabled /></td>";
            Newrow += "<td class='appUsageId' style='display:none'>" + (result[i].GroupId || '') + "</td>";
            Newrow += "<td class='productId' style='display:none'>" + (result[i].ActualName || '') + "</td>";
            Newrow += "<td class='quantityId' style='display:none'>" + (result[i].QuantityId || '') + "</td>";
            Newrow += "<td class='quantityMultiple' style='display:none'>" + multiplier + "</td>";
            Newrow += "<td class='quotationDetailsId' style='display:none'>" + (result[i].QuotationDetailsId || '') + "</td>";
            Newrow += "<td><a onclick=EditDetailsRow(this)><i class='fas fa-edit' style='font-size:20px;color:#902ca8'></i></a> &nbsp;<a onclick=DeleteDetailsRow(this)><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
            Newrow += "</tr>";
            $('#ViewQutationDataBody').append(Newrow);
        }
        HideProgress();
    }
    else {
        HideProgress();
    }
}



$('#btnSaveProduct').click(function (e) {

    e.preventDefault();
    var url = "/Samples/Samples/AddSamplesProduct";
    var appUsage = [];
    $('#ddlApplicationUsage :selected').each(function () {
        //appUsage[$(this).val()] = $(this).text();
        var appUsageObj = {};
        appUsageObj.ApplicationUsage_Id = $(this).val()
        appUsage.push(appUsageObj)
    });
    var obj = {
        Product_Name: $('#txtProduct').val(),
        Product_Price: $('#txtPrice').val(),
        Product_UpdateOn: ConvertDateFormatYYMMDD($('#txtDate').val()),
        ProductApplicationUsages: appUsage
    }

    if ($('#txtProduct').val() == '') {
        toastr.error('Product Name is required.');
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
            type: "Post",
            success: function (result) {
                if (result.ErrorCodes != null) {
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    $('#modal-product').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(SuccessMessage());
                    SweetSuccessMessage();
                    $('#modal-product').modal('hide');
                    bindNewProduct(result);
                    var jsonArray = JSON.stringify(result)
                    localStorage.removeItem('product');
                    localStorage.setItem('product', jsonArray);
                    RefreshProduct();
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
});
function RefreshProduct() {
    $('#txtProduct').val('');
    $('#txtPrice').val('');
    $('#txtDate').val('');
}

function bindNewProduct(data) {
    $("#ddlProduct").html('');
    $("#ddlProduct").append('<option value=0>Select</option>');
    $.each(data, function (i, obj) {
        $("#ddlProduct").append('<option value=' + obj.Product_Id + '>' + obj.Product_Name + '</option>');
    });

}

function InvoiceModel() {
    $('#modal-invoice').modal('toggle');
}





function GenerateInvoice(type) {
    $('#dvContents').show();
    $('#btnPrints').show();
    var data = localStorage.getItem('sample');
    const result = JSON.parse(data);
    $('#tblInvoiceData tbody').html('');
    $('#tblInvoiceDetailsData tbody').html('');
    var row = '';

    if (type == 'Duplicate' || type == 'Office') {
        if (type == 'Duplicate') {
            $('#invoiceTitle')[0].innerText = 'Duplicate Copy'
        }
        if (type == 'Office') {
            $('#invoiceTitle')[0].innerText = 'Office Copy'
        }
        row += '<tr style="height:25pt;line-height:0;">'
        row += '<td style="width:375pt;vertical-align: top;;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="3">';
        row += '<p style="padding-top: 10pt;padding-left: 4pt;font-weight: 600;" class="s2">' + result.PartyName + '</p><br/>';
        row += '<p style="padding-top: 10pt;padding-left: 4pt;font-weight: 600;" class="s2">' + result.ShippingAddress + '</p>';
        row += '</td>';
        row += '<td style="white-space:nowrap;width:165pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
        row += '<p style="padding-left: 4pt;">Reg. No.: ' + result.RegisterNo + '</p>';
        row += '</td>';
        row += '</tr>';
        row += '<tr style="height:25pt;line-height:0;">';
        row += '<td style="white-space:nowrap;width:165pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
        row += '<p style="padding-left: 4pt;">Q No.: ' + result.QuotationNo + '</p>';
        row += '</td>';
        row += '</tr>';
        row += '<tr style="height:35pt;line-height:0;">';
        row += '<td style="white-space:nowrap;width:165pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
        row += '<p style="padding-left: 4pt;">Date:- ' + result.StandardQuotDate + '</p>';
        row += '</td>';
        row += '</tr>';
    }
    if (type == 'Customer') {
        $('#invoiceTitle')[0].innerText = 'Customer Copy'
        row += '<tr style="height:37pt;line-height:0;">'
        row += '<td style="width:375pt;vertical-align: top;;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="3">';
        row += '<p style="padding-top: 10pt;padding-left: 4pt;font-weight: 600;" class="s2">' + result.PartyName + '</p><br/>';
        row += '<p style="padding-top: 10pt;padding-left: 4pt;font-weight: 600;" class="s2">' + result.ShippingAddress + '</p>';
        row += '</td>';
        row += '<td style="white-space:nowrap;width:165pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
        row += '<p style="padding-left: 4pt;">Q No.: ' + result.QuotationNo + '</p>';
        row += '</td>';
        row += '</tr>';
        row += '<tr style="height:47pt;line-height:0;">';
        row += '<td style="white-space:nowrap;width:165pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
        row += '<p style="padding-left: 4pt;">Date:- ' + result.StandardQuotDate + '</p>';
        row += '</td>';
        row += '</tr>';
    }

    $('#tblInvoiceData').append(row);
    var row = '';

    row += '<tr style="height:17pt;line-height:0;white-space:nowrap;">';
    row += '<td style="width:82pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
    row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
    row += '</td>';
    row += '<td style="width:365pt;padding-top:10pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
    row += '<p style="padding-top: 1pt;padding-left: 9pt;text-align: center;font-weight: 600;">Description</p>';
    row += '</td>';
    row += '<td style="width:91pt;padding-top:10pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
    row += '<p style="padding-top: 1pt;padding-left: 9pt;text-align: center;font-weight: 600;">Rate (Rs./Kg)</p>';
    row += '</td>';
    row += '</tr>';

    row += '<tr style="height:17pt;line-height:0;white-space:nowrap">';
    row += '<td style="width:82pt;vertical-align:top;padding-top:36pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="3">';
    row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';

    // Display quantity with multiplier (e.g., "5 grams × 4")
    $.each(result.QuotationDetails, function (index, value) {
        var quantityText = value.QuantityName;
        if (value.QuantityMutiple && value.QuantityMutiple > 1) {
            quantityText += ' × ' + value.QuantityMutiple;
        }
        row += '<p style="padding-top: 10pt;padding-left: 19pt;vertical-align: top;">' + quantityText + '</p>';
    });

    row += '</td>';
    row += '<td style="font-size:smaller;text-align:center;width:365pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
    row += '<p style="padding-top: 10pt;padding-left: 4pt;font-weight: 600;">FREE SAMPLE (NO COMMERCIAL VALUE)</p>';
    row += '</td>';
    row += '<td style="width:91pt;vertical-align:top;padding-top:36pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="3">';
    row += '<p style="text-indent: 0pt; text-align: left;"><br /></p>';
    $.each(result.QuotationDetails, function (index, value) {
        row += '<p style="padding-top: 10pt;padding-left: 22pt;vertical-align: top;">' + value.Rate + ' /- +GST</p>';
    });
    row += '</td>';
    row += '</tr>';

    row += '<tr style="height:12pt;line-height:0;white-space:nowrap">';
    row += '<td style="padding-top:10pt;font-size:smaller;text-align:center;width:365pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">';
    row += '<p style="padding-left: 4pt;text-align: center;font-weight: 600;">For ACNE, HERBAL, NEEM, AYURVEDIC</p>';
    row += '</td>';
    row += '</tr>';

    row += '<tr style="height:585pt">';
    row += '<td style="width:365pt;margin:0;line-height:0;vertical-align:top;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
    if (type == 'Office') {
        $.each(result.QuotationDetails, function (index, value) {
            row += '<p style="padding-top: 10pt;padding-left: 19pt;vertical-align: top;white-space:pre">' + value.SampleName + '                                                  ' + value.ActualNameValue + '</p>';
        });
    }
    else {
        $.each(result.QuotationDetails, function (index, value) {
            row += '<p style="padding-top: 10pt;padding-left: 19pt;vertical-align: top;white-space:pre">' + value.SampleName + '</p>';
        });
    }
    row += '</td>';
    row += '</tr>';

    $('#tblInvoiceDetailsData').append(row);
}















$(function () {
    $("#btnPrints").click(function () {
        $('#dvContents').printThis({
            //printDelay: 1,
        });
    });
});
function getPrice() {
    if ($("#ddlProduct").val() > 0) {
        var productId = $("#ddlProduct").val();
        var data = localStorage.getItem('product');
        var result = JSON.parse(data);
        if (result != null) {
            selectedProductPrice = result.filter(x => x.Product_Id == productId)[0].Product_Price;
        }
    }
}
function checkRateWithProductPrice(data) {
    if (parseFloat(selectedProductPrice) > parseFloat(data.value)) {
        CheckProductRate(selectedProductPrice);
        $('#' + data.id).focus();
        $('#' + data.id).val(0);
    }
}
function GetQuotationBySampleName() {
    if ($('#ddlCompany').val() == 0) {
        toastr.error('Party is required.');
        return false;
    }
    var PartyId = $('#ddlCompany').val();
    var SampleName = $('#txtSampleName').val();
    if (PartyId > 0) {
        ShowProgress();
        $.ajax({
            url: "/Samples/Samples/GetQuotationBySampleName",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { sampleName: SampleName, partyId: PartyId },
            type: "Get",
            success: function (result) {
                if (result?.QuotationDetails?.length > 0) {
                    SweetAlertMessage();
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





