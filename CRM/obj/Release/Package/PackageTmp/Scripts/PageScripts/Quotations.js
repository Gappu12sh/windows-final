
//$(function () {
//    function stripTrailingSlash(str) {
//        if (str.substr(-1) == '/') {
//            return str.substr(0, str.length - 1);
//        }
//        return str;
//    }
//    var url = window.location.pathname;
//    var activePage = stripTrailingSlash(url);
//    $('.nav li a').each(function () {
//        var currentPage = stripTrailingSlash($(this).attr('href'));

//        if (activePage == currentPage) {
//            $('.nav-link').removeClass("active");
//            $('.nav-item').removeClass("active menu-open");
//            $(this).parent().parent().parent().addClass("active menu-open");
//            //$(this).parent().parent().parent()[0].firstElementChild.className = "nav-link active";
//            $(this).parent().addClass('active');
//            $(this).css('background-color', '#dee2e6');
//            $(this).css('color', 'black');
//            $('.breadCrumbItem').addClass("active");
//            $('.breadCrumbItem')[0].innerHTML = "View Quotations";
//            $('.contentHeader')[0].innerHTML = "View Quotations";
//        }
//    });
//});
//jQuery(document).ready(function ($) {
//    bindMasters();
//    if ($('#hdnPageLoadOption').val() == 'ViewQuotationsDetails') {

//    }
//    $('.select2').select2();
//    $('.select2bs4').select2({
//        theme: 'bootstrap4',
//    })
//});
//function bindMasters() {
//    if ($('#hdnCompanies').val() != null && $('#hdnCompanies').val() != '') {
//        $("#ddlParty").html('');
//        var res = JSON.parse($('#hdnCompanies').val());
//        $("#ddlParty").append('<option value=0>Select</option>');
//        for (var i = 0; i < res.length; i++) {
//            $("#ddlParty").append('<option value=' + res[i].Party_Id + '>' + res[i].Party_Name + '</option>');
//        }
//        const jsonArray = JSON.stringify(res);
//        localStorage.clear();
//        localStorage.setItem('parties', jsonArray);
//    }
//}
//function getQuotations(data) {
//    var Id = data.value;
//    if (Id > 0) {
//        ShowProgress();
//        $.ajax({
//            url: "/Quotations/Quotations/GetDetailsByParty",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: { id: Id },
//            type: "Get",
//            success: function (result) {
//                if (result[0].QuotationDetails.length > 0) {
//                    bindData(result);
//                }
//                else {
//                    //toastr.error('No details found for this record.');
//                    NoDataForId();
//                    $('#tblQuotationsData thead').html('');
//                    $('#tblQuotationsData tbody').html('');
//                }
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
//        //toastr.error('No details found for this record.');
//        NoDataForId();
//        $('#tblQuotationsData thead').html('');
//        $('#tblQuotationsData tbody').html('');
//        HideProgress();
//    }
//}
//function bindData(result) {
//    $('#tblQuotationsData thead').html('');
//    $('#tblQuotationsData tbody').html('');
//    if (result.length > 0) {
//        var theader = "<tr role='row'>";
//        theader += "<th colspan='12'> Company: <b>" + $('#ddlParty').find(':selected').text() + " </b></th>";
//        theader += "</tr>";
//        $('#tblQuotationsData thead').append(theader);
//        var thead = "<tr role='row'>";
//        //thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Quotation No: activate to sort column descending'> Quotation No </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Register No: activate to sort column descending'> Register No </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Party Name: activate to sort column descending'> Party Name </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Address: activate to sort column descending'> Address </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Remarks: activate to sort column descending'> Remarks </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Kind Attn. To: activate to sort column descending'> Kind Attn. To </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sample Name: activate to sort column descending'> Sample Name </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Original Code: activate to sort column descending'> Original Code </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Application/Usage: activate to sort column descending'> Application/Usage </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Quantity: activate to sort column descending'> Quantity </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Rate: activate to sort column descending'> Rate </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblQuotationsData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Quotation Date: activate to sort column descending'> Quotation Date </th>";
//        thead += "</tr>";
//        $('#tblQuotationsData thead').append(thead);
//        var row = '';
//        for (var i = 0; i < result.length; i++) {

//            row += "<tr role='row'>";
//            row += "<td>" + result[i].QuotationNo + "</td>";
//            row += "<td>" + result[i].RegisterNo + "</td>";
//            row += "<td>" + result[i].PartyName + "</td>";
//            row += "<td>" + result[i].ShippingAddress + "</td>";
//            row += "<td>" + result[i].ShippingAddressRemarks + "</td>";
//            row += "<td>" + result[i].KindAttTo + "</td>";
//            row += "<td>" + result[i].QuotationDetails[0].SampleName + "</td>";
//            row += "<td>" + result[i].QuotationDetails[0].ActualNameValue + "</td>";
//            row += "<td>" + result[i].QuotationDetails[0].Group + "</td>";
//            row += "<td>" + result[i].QuotationDetails[0].Quantity + "</td>";
//            row += "<td>" + result[i].QuotationDetails[0].Rate + "</td>";
//            row += "<td>" + ConvertDateFormat(result[i].Quotation_DOE) + "</td>";
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblQuotationsData')) {
//            $('#tblQuotationsData').DataTable().clear().destroy();
//        }
//        $('#tblQuotationsDataBody').append(row);
//        $('#tblQuotationsData').DataTable();
//        $('#tblQuotationsData').css('display', 'block');

//    }
//    else {
//        HideProgress();
//    }
//}
//$(function () {
//    $("#btnPrints").click(function () {
//        $('#dvContents').printThis({
//            //printDelay: 1,
//        });
//    });
//});





$(function () {
    // Remove trailing slash from URL for comparison
    function stripTrailingSlash(str) {
        return str.endsWith('/') ? str.slice(0, -1) : str;
    }

    // Set active navigation menu item
    var url = window.location.pathname;
    var activePage = stripTrailingSlash(url);
    $('.nav li a').each(function () {
        var currentPage = stripTrailingSlash($(this).attr('href'));
        if (activePage == currentPage) {
            $('.nav-link').removeClass("active");
            $('.nav-item').removeClass("active menu-open");
            $(this).parent().parent().parent().addClass("active menu-open");
            $(this).parent().addClass('active');
            $(this).css({
                'background-color': '#dee2e6',
                'color': 'black'
            });
            $('.breadCrumbItem').addClass("active").text("View Quotations");
            $('.contentHeader').text("View Quotations");
        }
    });
});






toastr.options = { "timeOut": 5000 };



// Document ready function
jQuery(document).ready(function ($) {
    bindMasters();

    // Initialize select2 controls
    $('.select2').select2();
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    // Handle print button click
    $("#btnPrints").click(function () {
        $('#dvContents').printThis();
    });
});

// Load companies into dropdown
function bindMasters() {
    if ($('#hdnCompanies').val()) {
        try {
            var res = JSON.parse($('#hdnCompanies').val());
            $("#ddlParty").html('<option value="0">Select</option>');

            $.each(res, function (i, company) {
                $("#ddlParty").append($('<option></option>').val(company.Party_Id).text(company.Party_Name));
            });

            localStorage.setItem('parties', $('#hdnCompanies').val());
        } catch (e) {
            console.error("Error parsing companies data:", e);
            toastr.error("Failed to load company data");
        }
    }
}

// Get quotations when company is selected
function getQuotations(selectElement) {
    var Id = selectElement.value;

    if (!Id || Id == "0") {
        clearTable();
        return;
    }

    ShowProgress();

    $.ajax({
        url: "/Quotations/Quotations/GetDetailsByParty",
        type: "GET",
        data: { id: Id },
        dataType: "json",
        success: function (response) {
            if (response && response.length > 0 && response[0].QuotationDetails && response[0].QuotationDetails.length > 0) {
                bindData(response);
            } else {
                showNoDataMessage();
                clearTable();
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Error loading quotations: " + (xhr.responseText || error));
            clearTable();
        },
        complete: function () {
            HideProgress();
        }
    });
}

// Bind data to table
function bindData(data) {
    clearTable();

    var $thead = $('#tblQuotationsData thead');
    var $tbody = $('#tblQuotationsData tbody');

    // Create header
    $thead.append(
        `<tr><th colspan="12">Company: <b>${$('#ddlParty').find(':selected').text()}</b></th></tr>`
    );

    var headers = [
        'Quotation No', 'Register No', 'Party Name', 'Address',
        'Remarks', 'Kind Attn. To', 'Sample Name', 'Original Code',
        'Application/Usage', 'Quantity', 'Rate', 'Quotation Date'
    ];

    var headerRow = '<tr role="row">';
    headers.forEach(function (header) {
        headerRow += `<th class="sorting_asc">${header}</th>`;
    });
    headerRow += '</tr>';
    $thead.append(headerRow);

    // Create rows
    var rows = '';
    $.each(data, function (i, quotation) {
        var details = quotation.QuotationDetails[0];
        rows += `<tr>
            <td>${quotation.QuotationNo || ''}</td>
            <td>${quotation.RegisterNo || ''}</td>
            <td>${quotation.PartyName || ''}</td>
            <td>${quotation.ShippingAddress || ''}</td>
            <td>${quotation.ShippingAddressRemarks || ''}</td>
            <td>${quotation.KindAttTo || ''}</td>
            <td>${details.SampleName || ''}</td>
            <td>${details.ActualNameValue || ''}</td>
            <td>${details.Group || ''}</td>
            <td>${details.Quantity || ''}</td>
            <td>${details.Rate || ''}</td>
            <td>${ConvertDateFormat(quotation.Quotation_DOE) || ''}</td>
        </tr>`;
    });

    $tbody.append(rows);

    // Initialize DataTable if not already initialized
    if (!$.fn.DataTable.isDataTable('#tblQuotationsData')) {
        $('#tblQuotationsData').DataTable();
    } else {
        $('#tblQuotationsData').DataTable().destroy();
        $('#tblQuotationsData').DataTable();
    }

    $('#tblQuotationsData').show();
}

// Helper functions
function clearTable() {
    $('#tblQuotationsData thead').empty();
    $('#tblQuotationsData tbody').empty();
    if ($.fn.DataTable.isDataTable('#tblQuotationsData')) {
        $('#tblQuotationsData').DataTable().destroy();
    }
}

function showNoDataMessage() {
    toastr.error('No quotation details found for the selected company.');
}

function ShowProgress() {
    // Implement your progress show logic
    $('.loading-overlay').show();
}

function HideProgress() {
    // Implement your progress hide logic
    $('.loading-overlay').hide();
}

function ConvertDateFormat(dateString) {
    // Implement your date formatting logic
    if (!dateString) return '';
    var date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
}