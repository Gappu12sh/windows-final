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
            //$(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
            $(this).parent().addClass('active');
            $(this).css('background-color', '#dee2e6');
            $(this).css('color', 'black');
            $('.breadCrumbItem').addClass("active");
            $('.breadCrumbItem')[0].innerHTML = "Purchase Order";
            $('.contentHeader')[0].innerHTML = "Purchase Order";
        }
    });
});





toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {
    if ($('#hdnPageLoadOption').val() == 'ViewPurchaseOrderDetails') {
        GetDetails();
        var permissions = JSON.parse($('#hiddenPermission').val());
        if (permissions.PurchaseOrder.IsAdd) {
            $('#dvAddButton').show();
        }
    }
    if ($('#hdnPageLoadOption').val() == 'PurchaseOrder') {
        bindMasters();
        GetLastPurchaseOrderId();
        $('.nav-link').removeClass("active");
        $('.nav-item').removeClass("active menu-open");
        $(this).parent().parent().parent().addClass("active menu-open");
        //$(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
        $(this).parent().addClass('active');
        $(this).css('background-color', '#dee2e6');
        $(this).css('color', 'black');
        $('.breadCrumbItem').addClass("active");
        $('.breadCrumbItem')[0].innerHTML = "Purchase Order";
        $('.contentHeader')[0].innerHTML = "Purchase Order";
        $('.select2').select2();
        $('.select2bs4').select2({
            theme: 'bootstrap4',

        })
    }
    if ($('#hdnPageLoadOption').val() == 'EditPurchaseOrder') {
        $('.nav-link').removeClass("active");
        $('.nav-item').removeClass("active menu-open");
        $(this).parent().parent().parent().addClass("active menu-open");
        //$(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
        $(this).parent().addClass('active');
        $(this).css('background-color', '#dee2e6');
        $(this).css('color', 'black');
        $('.breadCrumbItem').addClass("active");
        $('.breadCrumbItem')[0].innerHTML = "Purchase Order";
        $('.contentHeader')[0].innerHTML = "Purchase Order";
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
            EditPurchaseOrder($('#hiddenQuotationId').val());

        }
    }
    $('.select2').select2({ dropdownAutoWidth: true });
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
    $("#txtQuotationDate").datepicker({ dateFormat: 'dd/mm/yy', changeYear: true, });
    $("#txtDate").datepicker({
        changeYear: true,
        dateFormat: 'dd/mm/yy', beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 9999);
            }, 0);
        }
    });
    $("#txtPoDate").datepicker({
        changeYear: true,
        dateFormat: 'dd/mm/yy', beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 9999);
            }, 0);
        }
    });
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
    $('#txtDate').val(output);
});

//// Real-time PO Number validation on blur
//$('#txtPoNo').on('blur', function () {
//    validatePONumber($(this).val());
//});

//// Function to validate PO Number
//function validatePONumber(poNumber) {
//    if (!poNumber) return; // Skip if empty

//    // Show loading indicator
//    var $input = $('#txtPoNo');
//    $input.addClass('loading').prop('disabled', true);

//    $.ajax({
//        url: "/PurchaseOrder/PurchaseOrder/CheckPONumberExists",
//        type: "GET",
//        data: { poNumber: poNumber },
//        success: function (response) {
//            if (response.exists) {
//                // Clear the field and show error
//                $input.val('')
//                    .removeClass('is-valid')
//                    .addClass('is-invalid');

//                Swal.fire({
//                    title: 'Duplicate PO Number',
//                    text: 'This PO Number already exists. Please use a unique PO Number.',
//                    icon: 'error',
//                    confirmButtonText: 'OK'
//                }).then(() => {
//                    $input.focus();
//                });
//            } else {
//                // Mark as valid
//                $input.removeClass('is-invalid')
//                    .addClass('is-valid');
//            }
//        },
//        error: function (xhr, status, error) {
//            toastr.error('Error checking PO Number: ' + error);
//        },
//        complete: function () {
//            $input.removeClass('loading').prop('disabled', false);
//        }
//    });
//}


var originalPONo = '';

// Real-time PO Number validation on blur
$('#txtPoNo').on('blur', function () {
    var currentPONo = $(this).val();
    validatePONumber(currentPONo);
});

// Function to validate PO Number
function validatePONumber(poNumber) {
    if (!poNumber) return; // Skip if empty

    // Skip validation if it's the original PO Number (edit mode)
    if (poNumber === originalPONo) {
        $('#txtPoNo').removeClass('is-invalid').addClass('is-valid');
        return;
    }

    // Show loading indicator
    var $input = $('#txtPoNo');
    $input.addClass('loading').prop('disabled', true);

    $.ajax({
        url: "/PurchaseOrder/PurchaseOrder/CheckPONumberExists",
        type: "GET",
        data: { poNumber: poNumber },
        success: function (response) {
            if (response.exists) {
                // Clear the field and show error
                $input.val('')
                    .removeClass('is-valid')
                    .addClass('is-invalid');

                Swal.fire({
                    title: 'Duplicate PO Number',
                    text: 'This PO Number already exists. Please use a unique PO Number.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    $input.focus();
                });
            } else {
                // Mark as valid
                $input.removeClass('is-invalid')
                    .addClass('is-valid');
            }
        },
        error: function (xhr, status, error) {
            toastr.error('Error checking PO Number: ' + error);
        },
        complete: function () {
            $input.removeClass('loading').prop('disabled', false);
        }
    });
}
// Clear original PO Number when adding new
$('#btnAddPurchaseOrder').click(function () {
    originalPONo = '';
    ShowProgress();
    window.location.href = "/PurchaseOrder/PurchaseOrder/Index";
});



$('#btnAddPurchaseOrder').click(function () {
    ShowProgress();
    window.location.href = "/PurchaseOrder/PurchaseOrder/Index";
});


function DeletePurchaseOrder(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/PurchaseOrder/PurchaseOrder/DeleteDetails/" + Id,
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



function bindMasters() {
    if ($('#hdnCompany').val() != null && $('#hdnCompany').val() != '') {
        $("#ddlCompany").html('');
        var res = JSON.parse($('#hdnCompany').val());
        $("#ddlCompany").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlCompany").append('<option value=' + res[i].Party_Id + '>' + res[i].Party_Name + '</option>');

        }
    }
}

///////////////////////////////////////////////////////////////////
function GetDetails() {

    ShowProgress();
    var obj = {};
    $.ajax({
        url: "/PurchaseOrder/PurchaseOrderDetails/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "data": JSON.stringify(obj) }),
        type: "Get",
        success: function (result) {
            if (result == null || result.length == 0) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                HideProgress();
            }
            else {
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.PurchaseOrder != null) {
                    if (permissions.PurchaseOrder.IsView) {
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
//function bindData(result) {
//    $('#tblPurchaseOrderData thead').html('');
//    $('#tblPurchaseOrderData tbody').html('');
//    var permissions = JSON.parse($('#hiddenPermission').val());
//    if (permissions.PurchaseOrder.IsAdd) {
//        $('#dvAddButton').show();
//    }
//    if (result.length > 0) {
//        var thead = "<tr role='row'>";
//        thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sample Challan No : activate to sort column descending'> Sample Challan No</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Company Name : activate to sort column descending'> Company Name</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Address : activate to sort column descending'> Address</th>";
//        if (permissions.PurchaseOrder.IsEdit || permissions.PurchaseOrder.IsDeleted) {
//            thead += "<th> Action </th>";
//        }
//        //thead += "<th> Delete </th>";
//        thead += "</tr>";
//        $('#tblPurchaseOrderData thead').append(thead);
//        var display = permissions.PurchaseOrder.IsEdit == true ? "inline" : "none";
//        var row = '';
//        for (var i = 0; i < result.length; i++) {
//            row += "<tr role='row'>";
//            row += "<td class='sorting_1' id='PurchaseOrderId" + result[i].PurchaseOrderId + "' style='display:none'>" + result[i].PurchaseOrderId + "</td>";
//            row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
//            row += "<td>" + result[i].SampleNumber + "</td>";
//            row += "<td>" + result[i].PartyName + "</td>";
//            row += "<td>" + result[i].PartyAddress + "</td>";
//            if (permissions.PurchaseOrder.IsEdit || permissions.PurchaseOrder.IsDeleted) {
//                //row += "<td><a href='/PurchaseOrder/EditPurchaseOrder/Index?id=" + result.listclsPurchaseOrderDetailsModel[i].Id + "'><img src='../Images/edit.png' style='width:15px; height:15px'/></a></td>";
//                //row += "<td><img onclick=EditPurchaseOrder(" + result[i].Rep_ID + ") src='/Images/edit.png' style='width:25px; height:25px'/></td>";
//                row += "<td><a href='/PurchaseOrder/EditPurchaseOrder/Index?id=" + result[i].PurchaseOrderId + "')><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "'></i></a>&nbsp;<a href='#')><i class=' fas fa-shopping-cart' style='font-size:20px;color:#902ca8;' onclick=PrintPO(" + result[i].PurchaseOrderId + ");></i></a></td>";
//                //row += "<td><img onclick=DeletePurchaseOrder(" + result.listclsPurchaseOrderDetailsModel[i].Id + ") src='/Images/delete.png' style='width:25px; height:25px'/></td>";
//            }
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblPurchaseOrderData')) {
//            $('#tblPurchaseOrderData').DataTable().clear().destroy();
//        }
//        $('#tblPurchaseOrderDataBody').append(row);
//        $('#tblPurchaseOrderData').DataTable();
//    }
//    else {
//        HideProgress();
//    }
//}









function bindData(result) {
    $('#tblPurchaseOrderData thead').html('');
    $('#tblPurchaseOrderData tbody').html('');
    var permissions = JSON.parse($('#hiddenPermission').val());
    if (permissions.PurchaseOrder.IsAdd) {
        $('#dvAddButton').show();
    }
    if (result.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'>  </th>";
        thead += "<th style='width: 55px;'> Sr.No. </th>"; // Fixed width for consistency
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sample Challan No : activate to sort column descending'> PurchaseOrder No</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Company Name : activate to sort column descending'> Company Name</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblPurchaseOrderData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Address : activate to sort column descending'> Address</th>";
        if (permissions.PurchaseOrder.IsEdit || permissions.PurchaseOrder.IsDeleted) {
            thead += "<th> Action </th>";
        }
        thead += "</tr>";
        $('#tblPurchaseOrderData thead').append(thead);

        var display = permissions.PurchaseOrder.IsEdit == true ? "inline" : "none";
        var row = '';

        for (var i = 0; i < result.length; i++) {
            row += "<tr role='row'>";
            row += "<td class='sorting_1' id='PurchaseOrderId" + result[i].PurchaseOrderId + "' style='display:none'>" + result[i].PurchaseOrderId + "</td>";
            row += "<td></td>"; // Placeholder for dynamic Sr.No.
            row += "<td>" + result[i].PONo + "</td>";
            row += "<td>" + result[i].PartyName + "</td>";
            row += "<td>" + result[i].PartyAddress + "</td>";
            if (permissions.PurchaseOrder.IsEdit || permissions.PurchaseOrder.IsDeleted) {
                row += "<td><a href='/PurchaseOrder/EditPurchaseOrder/Index?id=" + result[i].PurchaseOrderId + "'><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "'></i></a>&nbsp;<a href='#'><i class='fas fa-shopping-cart' style='font-size:20px;color:#902ca8;' onclick=PrintPO(" + result[i].PurchaseOrderId + ");></i></a></td>";
            }
            row += "</tr>";
        }

        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblPurchaseOrderData')) {
            $('#tblPurchaseOrderData').DataTable().clear().destroy();
        }

        $('#tblPurchaseOrderData tbody').append(row);

        // Initialize DataTable with dynamic Sr.No. logic
        var table = $('#tblPurchaseOrderData').DataTable({
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












function GetLastPurchaseOrderId() {
    $.ajax({
        url: "/PurchaseOrder/PurchaseOrder/GetLastPurchaseOrderId",
        type: "GET",
        success: function (response) {
            var lastPurchaseOrderId = response;
            // Use the lastPurchaseOrderId as needed
            $('#txtPurchaseOrderId').val(lastPurchaseOrderId);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
function bindContactDetails() {
    $("#ddlAttTo").html('');
    $("#ddlAddress").html('');
    var party = JSON.parse($('#hdnCompany').val());
    let selected_Party = party.filter(item => item.Party_Id == $('#ddlCompany').val());
    //if (selected_Party[0].Contact.length > 0) {

    //    $("#ddlAttTo").append('<option value=0>Select</option>');
    //    for (var i = 0; i < selected_Party[0].Contact.length; i++) {
    //        $("#ddlAttTo").append('<option value=' + selected_Party[0].Contact[i].Contact_Id + '>' + selected_Party[0].Contact[i].ContactPersonName + '</option>');
    //    }
    //}
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
function GetQuotationByPartyId() {
    if ($('#ddlCompany').val() == 0) {
        toastr.error('Party is required.');
        return false;
    }
    var PartyId = $('#ddlCompany').val();
    $('#ViewQuotationTableData tbody').html('');
    $('#divQuotationDetails').hide();
    $('#submitButton').hide();
    if (PartyId > 0) {
        ShowProgress();
        $.ajax({
            url: "/PurchaseOrder/PurchaseOrder/GetQuotationByPartyId",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { partyId: PartyId },
            type: "Get",
            async: false,
            success: function (result) {
                if (result?.length > 0) {
                    $("#ddlSamples").html('');
                    $("#ddlSamples").append('<option value=0>Select</option>');
                    for (var i = 0; i < result.length; i++) {
                        $("#ddlSamples").append('<option value=' + result[i].QuotationMasterId + '>' + result[i].QuotationNo + '</option>');
                    }
                    const jsonArray = JSON.stringify(result);
                    localStorage.clear();
                    localStorage.setItem('samples', jsonArray);

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
function bindSampleDetails() {
    if ($('#ddlAddress').val() == 0) {
        toastr.error('Please select address.');
        return false;
    }

    $('#txtSNo').val($('#txtPurchaseOrderId').val());
    $('#divQuotationDetails').show();
    $('#submitButton').show();
    var sampleId = $('#ddlSamples').val();
    var address = $('#ddlAddress').text();
    if (sampleId > 0) {
        var data = localStorage.getItem('samples');
        var result = JSON.parse(data);
        if (result != null) {
            $('#ViewQuotationTableData tbody').html('');
            $('#ViewQuotationTableData thead').html('');
            var selectedSample = result.filter(x => x.QuotationMasterId == sampleId);
            var selectedSampleDetails = selectedSample[0].QuotationDetails;
            $('#txtExecutiveName').val(selectedSample[0].QuotationRepresentative);
            var thead = "<tr role='row'>";
            thead += '<tr>';
            thead += '<th>SR. NO.</th><th>ITEM NAME</th><th>QTY</th><th>RATE</th><th>PACKING</th> <th>TD %</th> <th>BATCH NO.</th><th>INTERNAL CODE</th><th>MFG. DATE</th>';
            thead += '</tr>';
            $('#ViewQuotationTableData thead').append(thead);

            if (selectedSampleDetails.length > 0) {
                for (x = 0; x < selectedSampleDetails.length; x++) {
                    var Newrow = "";
                    Newrow += '<tr>';
                    Newrow += '<td>' + (x + 1) + '</td>';
                    Newrow += '<td class="ItemName">' + selectedSampleDetails[x].ActualNameValue + '</td>';
                    Newrow += '<td><input type="text" class="form-control form-control-sm Qty" placeholder="Quantity" id="txtQty"></td>';
                    Newrow += '<td ><input type="text" class="form-control form-control-sm Rate" placeholder="Rate" id="txtRate" value="' + selectedSampleDetails[x].Rate + '"></td>';
                    Newrow += '<td ><input type="text" class="form-control form-control-sm Packing" placeholder="Packing" id="txtPacking"></td>';
                    Newrow += '<td ><input type="text" class="form-control form-control-sm TdPer" placeholder="TD %" id="txtTDPer"></td>';
                    Newrow += '<td ><input type="text" class="form-control form-control-sm BatchNo" placeholder="Batch No" id="txtBatchNo"></td>';
                    Newrow += '<td ><input type="text" class="form-control form-control-sm InternalCode" placeholder="Internal Code" id="txtInternalCode"></td>';
                    Newrow += '<td ><input type="text" class="form-control form-control-sm txtMfgDate MfgDate" placeholder="Mfg Date(dd/mm/yyyy)" id="txtMfgDate' + x + '"></td>';
                    Newrow += "<td><a onclick=DeleteDetailsRow(this)><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
                    Newrow += '</tr>';
                    $('#ViewQutationDataBody').append(Newrow);
                }
            }
        }
    }
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
        $('#btnSavePurchaseOrder').hide();

    }
}

$('#btnSavePurchaseOrder').click(function (e) {

    e.preventDefault();
    var url = "/PurchaseOrder/PurchaseOrder/AddPurchaseOrder";
    var purchaseOrderDetails = [];
    if ($('#ViewQuotationTableData > tbody > tr').length > 0) {
        $('#ViewQuotationTableData > tbody > tr').each(function (index, tr) {
            //appUsage[$(this).val()] = $(this).text();
            var row = $(tr).closest("tr");
            var purchaseOrderDetail = {};
            purchaseOrderDetail.ItemName = row.find('.ItemName')[0].innerText
            purchaseOrderDetail.Qty = row.find('.Qty')[0].value
            purchaseOrderDetail.Rate = row.find('.Rate')[0].value
            purchaseOrderDetail.Packing = row.find('.Packing')[0].value
            purchaseOrderDetail.TDPer = row.find('.TdPer')[0].value
            purchaseOrderDetail.BatchNo = row.find('.BatchNo')[0].value
            purchaseOrderDetail.InternalCode = row.find('.InternalCode')[0].value
            purchaseOrderDetail.MfgDate = ConvertDateFormatYYMMDD(row.find('.MfgDate')[0].value)
            purchaseOrderDetails.push(purchaseOrderDetail)
        });
    }
    var obj = {

        SNo: $('#txtSNo').val(), ////////
        Date: ConvertDateFormatYYMMDD($('#txtDate').val()), /////////
        PONo: $('#txtPoNo').val(), /////////////
        PODate: ConvertDateFormatYYMMDD($('#txtPoDate').val()), //////////////
        GSTNo: $('#txtGstNo').val(),/////
        DispatchCity: $('#txtDispatchCity').val(), /////////
        DispatchVia: $('#txtDispatchVia').val(),
        CourierChg: $('#txtCourierChg').val(),
        ExecutiveName: $('#txtExecutiveName').val(),
        Remark: $('#txtRemarks').val(), /////////////
        MaterialDelAddress: $('#txtDeliveryAddress').val(), //////////////
        PackedBy: $('#txtPackedBy').val(), ////////
        //PackedDate: $('#txtRegisterNo').val(), /////////
        Label: $('#txtLabel').val(), /////////////
        Bottle: $('#txtBottle').val(), //////////////
        InvoiceNo: $('#txtInvoiceNo').val(),/////
        PaymentTerms: $('#txtPaymentTerms').val(),/////
        PartyName: $('#ddlCompany').find(':selected').text(), /////////
        PartyAddress: $('#ddlAddress').find(':selected').text(),
        SampleNumber: $('#ddlSamples').find(':selected').text(),
        PartyId: $('#ddlCompany').val(), /////////
        PartyAddressId: $('#ddlAddress').val(),
        SampleNumberId: $('#ddlSamples').val(),
        PurchaseOrderDetails: purchaseOrderDetails
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
                    setTimeout(function () { window.location = "/PurchaseOrder/PurchaseOrderDetails/Index"; }, 1000);
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
$('#btnUpdatePurchaseOrder').click(function (e) {

    e.preventDefault();
    var url = "/PurchaseOrder/EditPurchaseOrder/UpdatePurchaseOrder";
    var purchaseOrderDetails = [];
    if ($('#ViewQuotationTableData > tbody > tr').length > 0) {
        $('#ViewQuotationTableData > tbody > tr').each(function (index, tr) {
            //appUsage[$(this).val()] = $(this).text();
            var row = $(tr).closest("tr");
            var purchaseOrderDetail = {};
            purchaseOrderDetail.PurchaseOrderDetailsId = row.find('.purchaseOrderDetailsId')[0].innerText
            purchaseOrderDetail.ItemName = row.find('.ItemName')[0].innerText
            purchaseOrderDetail.Qty = row.find('.Qty')[0].value
            purchaseOrderDetail.Rate = row.find('.Rate')[0].value
            purchaseOrderDetail.Packing = row.find('.Packing')[0].value
            purchaseOrderDetail.TDPer = row.find('.TdPer')[0].value
            purchaseOrderDetail.BatchNo = row.find('.BatchNo')[0].value
            purchaseOrderDetail.InternalCode = row.find('.InternalCode')[0].value
            purchaseOrderDetail.MfgDate = ConvertDateFormatYYMMDD(row.find('.MfgDate')[0].value)
            purchaseOrderDetails.push(purchaseOrderDetail)
        });
    }
    var obj = {
        PurchaseOrderId: $('#txtPurchaseOrderId').val(),
        SNo: $('#txtSNo').val(), ////////
        Date: ConvertDateFormatYYMMDD($('#txtDate').val()), /////////
        PONo: $('#txtPoNo').val(), /////////////
        PODate: ConvertDateFormatYYMMDD($('#txtPoDate').val()), //////////////
        GSTNo: $('#txtGstNo').val(),/////
        DispatchCity: $('#txtDispatchCity').val(), /////////
        DispatchVia: $('#txtDispatchVia').val(),
        CourierChg: $('#txtCourierChg').val(),
        ExecutiveName: $('#txtExecutiveName').val(),
        Remark: $('#txtRemarks').val(), /////////////
        MaterialDelAddress: $('#txtDeliveryAddress').val(), //////////////
        PackedBy: $('#txtPackedBy').val(), ////////
        //PackedDate: $('#txtRegisterNo').val(), /////////
        Label: $('#txtLabel').val(), /////////////
        Bottle: $('#txtBottle').val(), //////////////
        InvoiceNo: $('#txtInvoiceNo').val(),/////
        PaymentTerms: $('#txtPaymentTerms').val(),/////
        PartyName: $('#ddlCompany').find(':selected').text(), /////////
        PartyAddress: $('#ddlAddress').find(':selected').text(),
        SampleNumber: $('#ddlSamples').find(':selected').text(),
        PartyId: $('#ddlCompany').val(), /////////
        PartyAddressId: $('#ddlAddress').val(),
        SampleNumberId: $('#ddlSamples').val(),
        PurchaseOrderDetails: purchaseOrderDetails
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
            type: "PUT",
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
                    setTimeout(function () { window.location = "/PurchaseOrder/PurchaseOrderDetails/Index"; }, 1000);
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
 function EditPurchaseOrder(Id) {
    if (Id > 0) {
        ShowProgress();
         $.ajax({
            url: "/PurchaseOrder/EditPurchaseOrder/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
             success: function (result) {
                 originalPONo = result.PONo;
                bindMasters();
                $('#txtPurchaseOrderId').val(result.PurchaseOrderId);
                $('#ddlCompany').val((result.PartyId)).attr('selected', 'selected');
                bindContactDetails();
                $('#ddlAddress').val((result.PartyAddressId)).attr('selected', 'selected');
                GetQuotationByPartyId();
                $('#ddlSamples').val((result.SampleNumberId)).attr('selected', 'selected');
                $('#txtSampleId').val(result.SampleNumberId);
                $('#txtSNo').val(result.SNo);
                $('#txtDate').val(ConvertDateDDMMYYYY(result.Date));
                $('#txtPoNo').val(result.PONo);
                $('#txtPoDate').val(ConvertDateDDMMYYYY(result.PODate));
                $('#txtGstNo').val(result.GSTNo);
                $('#txtDispatchCity').val(result.DispatchCity);
                $('#txtDispatchVia').val(result.DispatchVia);
                $('#txtCourierChg').val(result.CourierChg);
                $('#txtExecutiveName').val(result.ExecutiveName);
                $('#txtRemarks').val(result.Remark);
                $('#txtDeliveryAddress').val(result.MaterialDelAddress);
                $('#txtPackedBy').val(result.PackedBy);
                $('#txtLabel').val(result.Label);
                $('#txtBottle').val(result.Bottle);
                $('#txtInvoiceNo').val(result.InvoiceNo);
                $('#txtPaymentTerms').val(result.PaymentTerms);
                bindEditPurchaseOrderDetails(result.PurchaseOrderDetails);
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
function bindEditPurchaseOrderDetails(poDetails) {
    if ($('#ddlAddress').val() == 0) {
        toastr.error('Please select address.');
        return false;
    }

    $('#txtSNo').val($('#txtPurchaseOrderId').val());
    $('#divQuotationDetails').show();
    $('#submitButton').show();
    //var sampleId = $('#ddlSamples').val();
    //var address = $('#ddlAddress').text();
    //if (sampleId > 0) {
    var data = localStorage.getItem('samples');
    var result = JSON.parse(data);
    if (result != null) {
        $('#ViewQuotationTableData tbody').html('');
        $('#ViewQuotationTableData thead').html('');
        //var selectedSample = result.filter(x => x.QuotationMasterId == sampleId);
        //var selectedSampleDetails = selectedSample[0].QuotationDetails;
        var thead = "<tr role='row'>";
        thead += '<tr>';
        thead += '<th>SR. NO.</th><th>ITEM NAME</th><th>QTY</th><th>RATE</th><th>PACKING</th> <th>TD %</th> <th>BATCH NO.</th><th>INTERNAL CODE</th><th>MFG. DATE</th>';
        thead += '</tr>';
        $('#ViewQuotationTableData thead').append(thead);

        if (poDetails.length > 0) {
            for (x = 0; x < poDetails.length; x++) {
                var Newrow = "";
                Newrow += '<tr>';
                Newrow += '<td>' + (x + 1) + '</td>';
                Newrow += '<td class="ItemName">' + poDetails[x].ItemName + '</td>';
                Newrow += '<td><input type="text" class="form-control form-control-sm Qty" placeholder="Quantity" id="txtQty" value="' + poDetails[x].Qty + '"></td>';
                Newrow += '<td ><input type="text" class="form-control form-control-sm Rate" placeholder="Rate" id="txtRate" value="' + poDetails[x].Rate + '"></td>';
                Newrow += '<td ><input type="text" class="form-control form-control-sm Packing" placeholder="Packing" id="txtPacking" value="' + poDetails[x].Packing + '"></td>';
                Newrow += '<td ><input type="text" class="form-control form-control-sm TdPer" placeholder="TD %" id="txtTDPer" value="' + poDetails[x].TDPer + '"></td>';
                Newrow += '<td ><input type="text" class="form-control form-control-sm BatchNo" placeholder="Batch No" id="txtBatchNo" value="' + poDetails[x].BatchNo + '"></td>';
                Newrow += '<td ><input type="text" class="form-control form-control-sm InternalCode" placeholder="Internal Code" id="txtInternalCode" value="' + poDetails[x].InternalCode + '"></td>';
                Newrow += '<td ><input type="text" class="form-control form-control-sm txtMfgDate MfgDate" placeholder="Mfg Date(dd/mm/yyyy)" id="txtMfgDate' + x + '" value="' + ConvertDateDDMMYYYY(poDetails[x].MfgDate) + '"></td>';
                Newrow += "<td><a onclick=DeleteDetailsRow(this)><i class='far fa-trash-alt' style='font-size:20px;color:red'></i></a></td>";
                Newrow += "<td class='purchaseOrderDetailsId' style='display:none'>" + poDetails[x].PurchaseOrderDetailsId + "</td>";
                Newrow += '</tr>';
                $('#ViewQutationDataBody').append(Newrow);
            }
        }
    }
    //}
}

async function PrintPO(Id) {
    if (Id > 0) {
        ShowProgress();
        await $.ajax({
            url: "/PurchaseOrder/EditPurchaseOrder/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                viewSampleDetails(result);
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
function viewSampleDetails(result) {
    $('#modal-PO').modal('toggle');
    $('#dvContents').show();

    $('#ViewQuotationTableData tbody').html('');
    var Newrow = "";
    Newrow += '<tr>';
    Newrow += '<th rowspan="2" class="th" colspan="7" style="padding:5px;text-align:center">PRODUCTION ADVICE (PRODUCTION)</th>';
    Newrow += '<th class="th" style="padding:5px;text-align:center">S NO</th>';
    Newrow += '<th class="th" style="padding:5px;text-align:center">DATE</th>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td style="padding:5px;text-align:center" class="SNo td">' + result.PurchaseOrderId + '</td>';
    Newrow += '<td style="padding:5px" class="Date td">' + ConvertDateDDMMYYYY(result.Date) + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<th colspan="6" class="th" style="padding:5px;text-align:center">';
    Newrow += '<strong>PARTYS NAME & BILLING ADDRESS</strong>';
    Newrow += '</th>';
    Newrow += '<td class="td" style="padding-left:10px">PO NO</td>';
    Newrow += '<td colspan="2" class="PoNo td">' + result.PONo + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td rowspan="4" colspan="6" class="td" style="padding-bottom:80px;padding-left:10px">' + result.PartyName + '</br>' + result.PartyAddress + '</td>';
    Newrow += '<td class="td" style="padding-left:10px">PO Date</td>';
    Newrow += '<td colspan="2" class="PoDate td">' + ConvertDateDDMMYYYY(result.PODate) + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td class="td" style="padding-left:10px">GST NO</td>';
    Newrow += '<td colspan="2" class="GstNo td">' + result.GSTNo + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td class="td" style="padding-left:10px">Dispatch City</td>';
    Newrow += '<td colspan="2" class="DispatchCity td">' + result.DispatchCity + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td class="td" style="padding-left:10px">Dispatch Via</td>';
    Newrow += '<td colspan="2" class="DispatchVia td">' + result.DispatchVia + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<th class="th" style="padding:5px;text-align:center">SR. NO.</th><th class="th" style="padding:5px;text-align:center">ITEM NAME</th><th class="th" style="padding:5px;text-align:center">QTY</th><th class="th" style="padding:5px;text-align:center">RATE</th><th class="th" style="padding:5px;text-align:center">PACKING</th> <th class="th" style="padding:5px;text-align:center">TD %</th> <th class="th" style="padding:5px;text-align:center">BATCH NO.</th><th class="th">INTERNAL CODE</th><th class="th" >MFG. DATE</th>';
    Newrow += '</tr>';
    var purchaseOrderDetails = result.PurchaseOrderDetails;
    if (purchaseOrderDetails.length > 0) {
        for (x = 0; x < purchaseOrderDetails.length; x++) {
            Newrow += '<tr>';
            Newrow += '<td class="td center" style="padding:5px;text-align:center">' + (x + 1) + '</td>';
            Newrow += '<td class="ItemName td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].ItemName + '</td>';
            Newrow += '<td class="Qty td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].Qty + '</td>';
            Newrow += '<td class="Rate td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].Rate + '</td>';
            Newrow += '<td class="Packing td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].Packing + '</td>';
            Newrow += '<td class="TdPer td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].TDPer + '</td>';
            Newrow += '<td class="BatchNo td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].BatchNo + '</td>';
            Newrow += '<td class="InternalCode td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].InternalCode + '</td>';
            Newrow += '<td class="MfgDate td center" style="padding:5px;text-align:center">' + ConvertDateDDMMYYYY(purchaseOrderDetails[x].MfgDate) + '</td>';
            Newrow += '</tr>';
        }
    }
    Newrow += '<tr>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>Executive Name</strong></th>';
    Newrow += '<td colspan="2" class="ExecutiveName td" style="padding:5px;text-align:center">' + result.ExecutiveName + '</td>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>REMARK</strong></th>';
    Newrow += '<td colspan="3" class="Remarks td" style="padding:5px;text-align:center">' + result.Remark + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>QC Signature</strong></th>';
    Newrow += '<td colspan="2" ></td>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>MATERIAL DELIVERY ADDRESS</strong></th>';
    Newrow += '<td colspan="3" class="DeliveryAddress td" style="padding:5px;text-align:center">' + result.MaterialDelAddress + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td colspan="3" class="PackedBy td"><strong>Packed By / Date :-    </strong>' + result.PackedBy + '</td>';
    Newrow += '<td colspan="3" class="Label td"><strong>Label :-    </strong>' + result.Label + '</td>';
    Newrow += '<td class="Bottle td"><strong>Bottle :-   </strong>' + result.Bottle + '</td>';
    Newrow += '<td colspan="2" class="InvoiceNo td"><strong>Invoice No. :-    </strong>' + result.InvoiceNo + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<td style="padding:25px" colspan="9"></td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<th rowspan="2" class="th" colspan="7" style="padding:5px;text-align:center">PRODUCTION ADVICE (ACCOUNTS)</th>';
    Newrow += '<th class="th" style="padding:5px;text-align:center">S NO</th>';
    Newrow += '<th class="th" style="padding:5px;text-align:center">DATE</th>';
    Newrow += ' </tr>';
    Newrow += '<tr>';
    Newrow += '<td class="AccSNo td" style="padding:5px;text-align:center">' + result.PurchaseOrderId + '</td>';
    Newrow += '<td class="AccDate td" style="padding:5px;text-align:center">' + ConvertDateDDMMYYYY(result.Date) + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += ' <th colspan="6" class="th" style="padding:5px;text-align:center">';
    Newrow += ' <strong>PARTYS NAME & BILLING ADDRESS</strong>';
    Newrow += '</th>';
    Newrow += ' <td class="td" style="padding-left:10px">PO NO</td>';
    Newrow += '<td colspan="2" class="AccPoNo td" style="padding:5px;text-align:center">' + result.PONo + '</td>';
    Newrow += ' </tr>';
    Newrow += '<tr>';
    Newrow += ' <td rowspan="5" colspan="6" class="td" style="padding-bottom:80px;padding-left:10px">' + result.PartyName + '</br>' + result.PartyAddress + '</td>';
    Newrow += '<td class="td" style="padding-left:10px">PO Date</td>';
    Newrow += '<td colspan="2" class="AccPoDate td" style="padding:5px;text-align:center">' + ConvertDateDDMMYYYY(result.PODate) + '</td>';
    Newrow += ' </tr>';
    Newrow += ' <tr>';
    Newrow += ' <td class="td" style="padding-left:10px">GST NO</td>';
    Newrow += ' <td colspan="2" class="AccGstNo td" style="padding:5px;text-align:center">' + result.GSTNo + '</td>';
    Newrow += '</tr>';
    Newrow += ' <tr>';
    Newrow += ' <td class="td" style="padding-left:10px">Dispatch City</td>';
    Newrow += '<td colspan="2" class="AccDispatchCity td" style="padding:5px;text-align:center">' + result.DispatchCity + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += ' <td class="td" style="padding-left:10px">Dispatch Via</td>';
    Newrow += '<td colspan="2" class="AccDispatchVia td" style="padding:5px;text-align:center">' + result.DispatchVia + '</td>';
    Newrow += ' </tr>';
    Newrow += '<tr>';
    Newrow += '<td class="td" style="padding-left:10px">Courier Chg</td>';
    Newrow += '<td colspan="2" class="AccCourierChg td" style="padding:5px;text-align:center">' + result.CourierChg + '</td>';
    Newrow += '</tr>';
    Newrow += ' <tr>';
    Newrow += '<th class="th" style="padding:5px;text-align:center">SR. NO.</th><th class="th" style="padding:5px;text-align:center">ITEM NAME</th><th class="th" style="padding:5px;text-align:center">QTY</th><th class="th" style="padding:5px;text-align:center">RATE</th><th class="th" style="padding:5px;text-align:center">PACKING</th><th class="th" style="padding:5px;text-align:center">TD %</th><th class="th" style="padding:5px;text-align:center">BATCH NO.</th><th colspan="2" class="th" style="padding:5px;text-align:center">INVOICE NUMBER</th>';
    Newrow += ' </tr>';
    if (purchaseOrderDetails.length > 0) {
        for (x = 0; x < purchaseOrderDetails.length; x++) {
            Newrow += '<tr>';
            Newrow += '<td class="td center" style="padding:5px;text-align:center">' + (x + 1) + '</td>';
            Newrow += '<td class="AccPartyName td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].ItemName + '</td>';
            Newrow += '<td class="AccQty td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].Qty + '</td>';
            Newrow += '<td class="AccRate td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].Rate + '</td>';
            Newrow += '<td class="AccPacking td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].Packing + '</td>';
            Newrow += '<td class="AccTdPer td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].TDPer + '</td>';
            Newrow += '<td class="AccBatchNo td center" style="padding:5px;text-align:center">' + purchaseOrderDetails[x].BatchNo + '</td>';
            Newrow += '<td colspan="2" class="AccInvoiceNo td center" style="padding:5px;text-align:center">' + result.InvoiceNo + '</td>';
            Newrow += ' </tr>';
        }
    }
    Newrow += ' <tr>';
    Newrow += ' <th colspan="2" class="th" style="padding:5px;text-align:center"><strong>Executive Name</strong></th>';
    Newrow += '<td colspan="2" class="AccExecutiveName td" style="padding:5px;text-align:center">' + result.ExecutiveName + '</td>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>REMARK</strong></th>';
    Newrow += '<td colspan="3" class="AccRemark td" style="padding:5px;text-align:center">' + result.Remark + '</td>';
    Newrow += '</tr>';
    Newrow += ' <tr>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>QC Signature</strong></th>';
    Newrow += '<td colspan="2"></td>';
    Newrow += ' <th rowspan="2" colspan="2" class="th" style="padding:5px;text-align:center"><strong>MATERIAL DELIVERY ADDRESS</strong></th>';
    Newrow += '<td  rowspan="2" colspan="3" class="AccDeliveryAddress td" style="padding:5px;text-align:center">' + result.MaterialDelAddress + '</td>';
    Newrow += '</tr>';
    Newrow += '<tr>';
    Newrow += '<th colspan="2" class="th" style="padding:5px;text-align:center"><strong>Payment Terms</strong></th>';
    Newrow += '<td colspan="2" class="AccPaymentTerms td" style="padding:5px;text-align:center">' + result.PaymentTerms + '</td>';
    Newrow += '</tr>';
    $('#ViewQutationDataBody').append(Newrow);

}
$(function () {
    $("#btnPrints").click(function () {
        $('#dvContents').printThis({
            //printDelay: 1,
        });
    });
});
function viewSampleDetailsTest() {
    if ($('#ddlAddress').val() == 0) {
        toastr.error('Please select address.');
        return false;
    }
    $('#divQuotationDetails').show();
    var sampleId = $('#ddlSamples').val();
    var address = $('#ddlAddress').text();
    if (sampleId > 0) {
        var data = localStorage.getItem('samples');
        var result = JSON.parse(data);
        if (result != null) {
            $('#ViewQuotationTableData tbody').html('');
            var selectedSample = result.filter(x => x.QuotationMasterId == sampleId);
            var selectedSampleDetails = selectedSample[0].QuotationDetails;
            var Newrow = "";
            Newrow += '<tr>';
            Newrow += '<th rowspan="2" colspan="7">PRODUCTION ADVICE (PRODUCTION)</th>';
            Newrow += '<th>S NO</th>';
            Newrow += '<th>DATE</th>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td style="padding:15px;text-align:center" class="SNo">' + $('#txtPurchaseOrderId').val() + '</td>';
            Newrow += '<td style="padding:15px" class="Date"><input type="text" class="form-control form-control-sm" placeholder="Date(dd/mm/yyyy)" id="txtDate"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<th colspan="6">';
            Newrow += '<strong>PARTYS NAME & BILLING ADDRESS</strong>';
            Newrow += '</th>';
            Newrow += '<td>PO NO</td>';
            Newrow += '<td colspan="2" class="PoNo"><input type="text" class="form-control form-control-sm" placeholder="PO No" id="txtPoNo"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td rowspan="4" colspan="6">' + selectedSample[0].PartyName + '</br>' + address + '</td>';
            Newrow += '<td>PO Date</td>';
            Newrow += '<td colspan="2" class="PoDate"><input type="text" class="form-control form-control-sm" placeholder="PO Date(dd/mm/yyyy)" id="txtPoDate"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td>GST NO</td>';
            Newrow += '<td colspan="2" class="GstNo"><input type="text" class="form-control form-control-sm" placeholder="GST No" id="txtGSTNo"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td>Dispatch City</td>';
            Newrow += '<td colspan="2" class="DispatchCity"><input type="text" class="form-control form-control-sm" placeholder="Dispatch City" id="txtDispatchCity"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td>Dispatch Via</td>';
            Newrow += '<td colspan="2" class="DispatchVia"><input type="text" class="form-control form-control-sm" placeholder="Dispatch Via" id="txtDispatchVia"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<th>SR. NO.</th><th>ITEM NAME</th><th>QTY</th><th>RATE</th><th>PACKING</th> <th>TD %</th> <th>BATCH NO.</th><th>INTERNAL CODE</th><th>MFG. DATE</th>';
            Newrow += '</tr>';
            if (selectedSampleDetails.length > 0) {
                for (x = 0; x < selectedSampleDetails.length; x++) {
                    Newrow += '<tr>';
                    Newrow += '<td>' + (x + 1) + '</td>';
                    Newrow += '<td class="ItemName">' + selectedSampleDetails[x].ActualNameValue + '</td>';
                    Newrow += '<td class="Qty"><input type="text" class="form-control form-control-sm" placeholder="Quantity" id="txtQty"></td>';
                    Newrow += '<td class="Rate"><input type="text" class="form-control form-control-sm" placeholder="Rate" id="txtRate" value="' + selectedSampleDetails[x].Rate + '"></td>';
                    Newrow += '<td class="Packing"><input type="text" class="form-control form-control-sm" placeholder="Packing" id="txtPacking"></td>';
                    Newrow += '<td class="TdPer"><input type="text" class="form-control form-control-sm" placeholder="TD %" id="txtTDPer"></td>';
                    Newrow += '<td class="BatchNo"><input type="text" class="form-control form-control-sm" placeholder="Batch No" id="txtBatchNo"></td>';
                    Newrow += '<td class="InternalCode"><input type="text" class="form-control form-control-sm" placeholder="Internal Code" id="txtInternalCode"></td>';
                    Newrow += '<td class="MfgDate"><input type="text" class="form-control form-control-sm" placeholder="Mfg Date" id="txtMfgDate"></td>';
                    Newrow += '</tr>';
                }
            }
            Newrow += '<tr>';
            Newrow += '<th colspan="2"><strong>Executive Name</strong></th>';
            Newrow += '<td colspan="2" class="ExecutiveName"><input type="text" class="form-control form-control-sm" placeholder="Executive Name" id="txtExecutiveName"></td>';
            Newrow += '<th colspan="2"><strong>REMARK</strong></th>';
            Newrow += '<td colspan="3" class="Remarks"><input type="text" class="form-control form-control-sm" placeholder="Remarks" id="txtRemarks"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<th colspan="2"><strong>QC Signature</strong></th>';
            Newrow += '<td colspan="2"></td>';
            Newrow += '<th colspan="2"><strong>MATERIAL DELIVERY ADDRESS</strong></th>';
            Newrow += '<td colspan="3" class="DeliveryAddress"><input type="text" class="form-control form-control-sm" placeholder="Delivery Address" id="txtDeliveryAddress"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td colspan="3" class="PackedBy"><strong>Packed By / Date</strong><input type="text" class="form-control form-control-sm" placeholder="Packed By" id="txtPackedBy"></td>';
            Newrow += '<td colspan="3" class="Label"><strong>Label</strong><input type="text" class="form-control form-control-sm" placeholder="Label" id="txtLabel"></td>';
            Newrow += '<td class="Bottle"><strong>Bottle</strong><input type="text" class="form-control form-control-sm" placeholder="Bottle" id="txtBottle"></td>';
            Newrow += '<td colspan="2" class="InvoiceNo"><strong>Invoice No.</strong><input type="text" class="form-control form-control-sm" placeholder="Invoice No" id="txtInvoiceNo"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<td style="padding:25px" colspan="9"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<th rowspan="2" colspan="7">PRODUCTION ADVICE (ACCOUNTS)</th>';
            Newrow += '<th>S NO</th>';
            Newrow += '<th>DATE</th>';
            Newrow += ' </tr>';
            Newrow += '<tr>';
            Newrow += '<td style="padding:15px" class="AccSNo"></td>';
            Newrow += '<td style="padding:15px" class="AccDate"><input type="text" class="form-control form-control-sm" placeholder="Date(dd/mm/yyyy)" id="txtAccDate"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += ' <th colspan="6">';
            Newrow += ' <strong>PARTYS NAME & BILLING ADDRESS</strong>';
            Newrow += '</th>';
            Newrow += ' <td>PO NO</td>';
            Newrow += '<td colspan="2" class="AccPoNo"><input type="text" class="form-control form-control-sm" placeholder="PO No" id="txtAccPoNo"></td>';
            Newrow += ' </tr>';
            Newrow += '<tr>';
            Newrow += ' <td rowspan="5" colspan="6">' + selectedSample[0].PartyName + '</br>' + address + '</td>';
            Newrow += '<td>PO Date</td>';
            Newrow += '<td colspan="2" class="AccPoDate"><input type="text" class="form-control form-control-sm" placeholder="PO Date(dd/mm/yyyy)" id="txtAccPoDate"></td>';
            Newrow += ' </tr>';
            Newrow += ' <tr>';
            Newrow += ' <td>GST NO</td>';
            Newrow += ' <td colspan="2" class="AccGstNo"><input type="text" class="form-control form-control-sm" placeholder="GST No" id="txtAccGSTNo"></td>';
            Newrow += '</tr>';
            Newrow += ' <tr>';
            Newrow += ' <td>Dispatch City</td>';
            Newrow += '<td colspan="2" class="AccDispatchCity"><input type="text" class="form-control form-control-sm" placeholder="Dispatch City" id="txtAccDispatchCity"></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += ' <td>Dispatch Via</td>';
            Newrow += '<td colspan="2" class="AccDispatchVia"><input type="text" class="form-control form-control-sm" placeholder="Dispatch Via" id="txtAccDispatchVia"></td>';
            Newrow += ' </tr>';
            Newrow += '<tr>';
            Newrow += '<td>Courier Chg</td>';
            Newrow += '<td colspan="2" class="AccCourierChg"><input type="text" class="form-control form-control-sm" placeholder="Courier chg" id="txtAccCourierChg"></td>';
            Newrow += '</tr>';
            Newrow += ' <tr>';
            Newrow += '<th>SR. NO.</th><th>ITEM NAME</th><th>QTY</th><th>RATE</th><th>PACKING</th><th>TD %</th><th>BATCH NO.</th><th colspan="2">INVOICE NUMBER</th>';
            Newrow += ' </tr>';
            if (selectedSampleDetails.length > 0) {
                for (x = 0; x < selectedSampleDetails.length; x++) {
                    Newrow += '<tr>';
                    Newrow += '<td>' + (x + 1) + '</td>';
                    Newrow += '<td class="AccPartyName">' + selectedSampleDetails[x].ActualNameValue + '</td>';
                    Newrow += '<td class="AccQty"><input type="text" class="form-control form-control-sm" placeholder="Quantity" id="txtQty"></td>';
                    Newrow += '<td class="AccRate"><input type="text" class="form-control form-control-sm" placeholder="Rate" id="txtRate" value="' + selectedSampleDetails[x].Rate + '"></td>';
                    Newrow += '<td class="AccPacking"><input type="text" class="form-control form-control-sm" placeholder="Packing" id="txtPacking"></td>';
                    Newrow += '<td class="AccTdPer"><input type="text" class="form-control form-control-sm" placeholder="TD %" id="txtTDPer"></td>';
                    Newrow += '<td class="AccBatchNo"><input type="text" class="form-control form-control-sm" placeholder="Batch No" id="txtBatchNo"></td>';
                    Newrow += '<td colspan="2" class="AccInvoiceNo"><input type="text" class="form-control form-control-sm" placeholder="Invoice No" id="txtAccInvoiceNo"></td>';
                    Newrow += ' </tr>';
                }
            }
            Newrow += ' <tr>';
            Newrow += ' <th colspan="2"><strong>Executive Name</strong></th>';
            Newrow += '<td colspan="2" class="AccExecutiveName"><input type="text" class="form-control form-control-sm" placeholder="Executive Name" id="txtAccExecutiveName"></td>';
            Newrow += '<th colspan="2"><strong>REMARK</strong></th>';
            Newrow += '<td colspan="3" class="AccRemark"><input type="text" class="form-control form-control-sm" placeholder="Remarks" id="txtAccRemarks"></td>';
            Newrow += '</tr>';
            Newrow += ' <tr>';
            Newrow += '<th colspan="2"><strong>QC Signature</strong></th>';
            Newrow += '<td colspan="2"></td>';
            Newrow += ' <th rowspan="2" colspan="2"><strong>MATERIAL DELIVERY ADDRESS</strong></th>';
            Newrow += '<td  rowspan="2" colspan="3" class="AccDeliveryAddress"><textarea row="2" cols="3" class="form-control form-control-sm" placeholder="Delivery Address" id="txtAccDeliveryAddress"></textarea></td>';
            Newrow += '</tr>';
            Newrow += '<tr>';
            Newrow += '<th colspan="2"><strong>Payment Terms</strong></th>';
            Newrow += '<td colspan="2" class="AccPaymentTerms"><input type="text" class="form-control form-control-sm" placeholder="Payment Terms" id="txtAccPaymentTerms"></td>';
            Newrow += '</tr>';
            $('#ViewQutationDataBody').append(Newrow);
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
            $('#txtDate').val(output);
            $('#txtAccDate').val(output);
        }
    }
}