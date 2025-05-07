var selectedApplicationUsage = new Array();
var getApplicationUsageDetailsData = new Array();
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
            $('.breadCrumbItem')[0].innerHTML = "Material";
            $('.contentHeader')[0].innerHTML = "Material";
        }
    });
});





toastr.options = { "timeOut": 5000 };



jQuery(document).ready(function ($) {
    bindMasters();
    if ($('#hdnPageLoadOption').val() == 'ViewMaterialDetails') {
        GetDetails();
    }
    if ($('#hdnPageLoadOption').val() == 'LoadEditMaterial') {
        if ($('#hiddenMaterialId').val() != '') {
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
            EditMaterial($('#hiddenMaterialId').val());
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
    $("#txtWEF").datepicker({ dateFormat: 'dd/mm/yy', changeYear: true, });
    $("#txtNewWEF").datepicker({ dateFormat: 'dd/mm/yy', changeYear: true, });
});
function bindMasters() {
    if ($('#hdnParty').val() != null && $('#hdnParty').val() != '') {
        $("#ddlCompany").html('');
        var res = JSON.parse($('#hdnParty').val());
        $("#ddlCompany").append('<option value=0>Select</option>');
        for (var i = 0; i < res.length; i++) {
            $("#ddlCompany").append('<option value=' + res[i].Party_Id + '>' + res[i].Party_Name + '</option>');
        }
    }
    //if ($('#hdnProduct').val() != null && $('#hdnProduct').val() != '') {
    //    $("#ddlProduct").html('');
    //    var res = JSON.parse($('#hdnProduct').val());
    //    $("#ddlProduct").append('<option value=0>Select</option>');
    //    for (var i = 0; i < res.length; i++) {
    //        $("#ddlProduct").append('<option value=' + res[i].Product_Id + '>' + res[i].Product_Name + '</option>');
    //    }
    //}
}
$('#btnAddMaterial').click(function () {
    $('#btnSave').css('display', 'block');
    $('#btnUpdate').css('display', 'none');
    $('#header')[0].innerText = "Add Material";
    Refresh();
    bindMasters();
    $('#modal-lg').modal('toggle');
});

$('#btnSave').click(function (e) {

    e.preventDefault();
    var url = "/Material/Material/AddMaterial";
    var materialRates = [];
    var matRates = {};
    matRates.Rate = $('#txtRate').val();
    matRates.OldRate = $('#txtOldRate').val();
    matRates.WEF = ConvertDateFormatYYMMDD($('#txtWEF').val());
    materialRates.push(matRates);
    var obj = {
        PartyName: $('#ddlCompany :selected').text(),
        ProductName: $('#ddlProduct :selected').text(),
        ActualCode: $('#txtActualCode').val(),
        TradeDiscount: $('#txtTradeRate').val() == "" ? 0 : $('#txtTradeRate').val(),
        PartyId: $('#ddlCompany :selected').val(),
        ProductId: $('#txtProductId').val(),
        MaterialRates: materialRates
    }
    if ($('#txtActualCode').val() == '') {
        toastr.error('Actual code is required.');
        return false;
    }
    else if ($('#ddlCompany').val() == '0') {
        toastr.error('Company is required.');
        return false;
    }
    else if ($('#ddlProduct').val() == '0') {
        toastr.error('Product is required.');
        return false;
    }
    else if ($('#txtRate').val() == '') {
        toastr.error('Rate is required.');
        return false;
    }
    else if ($('#txtWEF').val() == '') {
        toastr.error('WEF is required.');
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
                    $('#modal-lg').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(SuccessMessage());
                    SweetSuccessMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-lg').modal('hide');
                    GetDetails();
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
    var url = "/Material/Material/UpdateMaterial";
    var materialRates = [];
    var matRates = {};
    matRates.MaterialRateId = $('#txtMaterialRateId').val();
    matRates.Rate = $('#txtRate').val();
    matRates.OldRate = $('#txtOldRate').val();
    matRates.WEF = ConvertDateFormatYYMMDD($('#txtWEF').val());
    materialRates.push(matRates);
    var obj = {
        MaterialId: $('#txtMaterialId').val(),
        PartyName: $('#ddlCompany :selected').text(),
        ProductName: $('#ddlProduct :selected').text(),
        ActualCode: $('#txtActualCode').val(),
        TradeDiscount: $('#txtTradeRate').val() == "" ? 0 : $('#txtTradeRate').val(),
        PartyId: $('#ddlCompany :selected').val(),
        ProductId: $('#txtProductId').val(),
        MaterialRates: materialRates
    }
    if ($('#txtActualCode').val() == '') {
        toastr.error('Actual code is required.');
        return false;
    }
    else if ($('#ddlCompany').val() == '0') {
        toastr.error('Company is required.');
        return false;
    }
    else if ($('#ddlProduct').val() == '0') {
        toastr.error('Product is required.');
        return false;
    }
    else if ($('#txtRate').val() == '') {
        toastr.error('Rate is required.');
        return false;
    }
    else if ($('#txtWEF').val() == '') {
        toastr.error('WEF is required.');
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
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    $('#modal-lg').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(UpdateMessage());
                    SweetUpdateMessage();
                    Refresh();
                    HideProgress();
                    $('#modal-lg').modal('hide');
                    GetDetails();
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
    $('#txtMaterial').val('');
    $('#txtPrice').val('');
    $('#txtDate').val('');

    $('#txtTradeRate').val('');
    $('#txtActualCode').val('');
    $('#txtOldRate').val('');
    $('#txtRate').val('');
    $('#txtWEF').val('');
}
function RefreshNewRate() {
    $('#txtNewRate').val('');
    $('#txtNewWEF').val('');
}

function GetDetails() {

    ShowProgress();
    var obj = {};
    $.ajax({
        url: "/Material/Material/GetDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "data": JSON.stringify(obj) }),
        type: "Get",
        success: function (result) {
            if (result == null) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.Material.IsAdd) {
                    $('#dvAddButton').show();
                }
                HideProgress();
            }
            else {
                var permissions = JSON.parse($('#hiddenPermission').val());
                if (permissions.Material != null) {
                    if (permissions.Material.IsView) {
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

function EditMaterial(Id) {
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/Material/Material/GetDetailsById",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { id: Id },
            type: "Get",
            success: function (result) {
                bindMasters();
                $('#btnSave').css('display', 'none');
                $('#btnUpdate').css('display', 'block');
                $('#header')[0].innerText = "Update Material";
                $('#modal-lg').modal('toggle');

                $('#ddlCompany').val(result.PartyId);
                GetSampleProductDetails();
                $('#txtMaterialId').val(result.MaterialId);
                $('#ddlProduct').val(result.ProductName)
                $('#txtTradeRate').val(result.TradeDiscount);
                $('#txtActualCode').val(result.ActualCode);
                $('#txtProductId').val(result.ProductId)
                var rate = result.MaterialRates.sort().reverse();
                $('#txtOldRate').val(rate[0].OldRate).attr("disabled", "disabled");
                $('#txtRate').val(rate[0].Rate);
                var date = ConvertDateDDMMYYYY(rate[0].WEF);
                $('#txtWEF').val(date);
                $('#txtMaterialRateId').val(rate[0].MaterialRateId);
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
function DeleteConfirmation(Id) {
    $("#txtMaterialId").val(Id);
    $('#ConfirmBox').modal('show');
}
function DeleteMaterial(Id) {
    var Id = $("#txtMaterialId").val();
    if (Id > 0) {
        ShowProgress();
        $.ajax({
            url: "/Material/Material/DeleteDetails/" + Id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //data: { id: Id },
            type: "Delete",
            success: function (result) {
                if (result.ErrorCodes != null) {
                    //toastr.error(ErrorCodes(result.ErrorCodes));
                    SweetErrorMessage(result.ErrorCodes);
                    $('#ConfirmBox').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(DeleteMessage());
                    SweetDeleteMessage();
                    $('#ConfirmBox').modal('hide');
                    GetDetails();
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
        //toastr.error('No details found for this record.');
        NoDataForId();
        HideProgress();
    }
}

//function bindData(result) {
//    $('#tblMaterialData thead').html('');
//    $('#tblMaterialData tbody').html('');
//    var permissions = JSON.parse($('#hiddenPermission').val());
//    if (permissions.Material.IsAdd) {
//        $('#dvAddButton').show();
//    }
//    if (result.length > 0) {
//        var thead = "<tr role='row'>";
//        thead += "<th style='display:none'>  </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Sr No: activate to sort column descending'> Sr.No. </th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Party Name</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Product Name</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Actual Code</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Trade Discount(%)</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Rate</th>";
//        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'>Old Rate</th>";
//        thead += "<th> New Rate / History </th>";
//        if (permissions.Material.IsEdit || permissions.Material.IsDeleted) {
//            thead += "<th> Action </th>";
//        }
//        //thead += "<th> Delete </th>";
//        thead += "</tr>";
//        $('#tblMaterialData thead').append(thead);
//        var display = permissions.Material.IsEdit == true ? "inline" : "none";
//        var displayDel = permissions.Material.IsDeleted == true ? "inline" : "none";
//        var row = '';
//        for (var i = 0; i < result.length; i++) {
//            var rate = result[i].MaterialRates.sort().reverse();
//            row += "<tr role='row'>";
//            row += "<td class='sorting_1' id='MaterialId" + result[i].Material_Id + "' style='display:none'>" + result[i].Material_Id + "</td>";
//            row += "<td>" + (parseInt(i) + parseInt(1)) + "</td>";
//            row += "<td>" + result[i].PartyName + "</td>";
//            row += "<td>" + result[i].ProductName + "</td>";
//            row += "<td>" + result[i].ActualCode + "</td>";
//            row += "<td>" + result[i].TradeDiscount + "</td>";
//            row += "<td>" + rate[0].Rate + "</td>";
//            row += "<td>" + rate[0].OldRate + "</td>";
//            row += "<td><a><i class='fas fa-plus-square' style='font-size:20px;color:#902ca8' onclick=AddNewRate(" + result[i].MaterialId + ") title='Add New Rate'></i></a><a><i class='fas fa-file' style='font-size:18px;color:green;padding-left:7px' onclick=ViewHistory(" + result[i].MaterialId + ") title='History'></i></a></td>";
//            //row += "<td><a href='/Material/EditMaterial/Index?id=" + result.listclsMaterialDetailsModel[i].Id + "'><img src='../Images/edit.png' style='width:15px; height:15px'/></a></td>";
//            //row += "<td><img onclick=EditMaterial(" + result[i].Rep_ID + ") src='/Images/edit.png' style='width:25px; height:25px'/></td>";
//            if (permissions.Material.IsEdit || permissions.Material.IsDeleted) {
//                row += "<td><a onclick=EditMaterial(" + result[i].MaterialId + ")><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "' title='Edit'></i></a></td>";
//            }
//            //row += "<td><img onclick=DeleteMaterial(" + result.listclsMaterialDetailsModel[i].Id + ") src='/Images/delete.png' style='width:25px; height:25px'/></td>";
//            row += "</tr>";

//        }
//        HideProgress();
//        if ($.fn.DataTable.isDataTable('#tblMaterialData')) {
//            $('#tblMaterialData').DataTable().clear().destroy();
//        }
//        $('#tblMaterialDataBody').append(row);
//        $('#tblMaterialData').DataTable();
//    }
//    else {
//        HideProgress();
//    }
//}





function bindData(result) {
    $('#tblMaterialData thead').html('');
    $('#tblMaterialData tbody').html('');
    var permissions = JSON.parse($('#hiddenPermission').val());
    if (permissions.Material.IsAdd) {
        $('#dvAddButton').show();
    }
    if (result.length > 0) {
        var thead = "<tr role='row'>";
        thead += "<th style='display:none'>  </th>";
        thead += "<th style='width: 55px;'> Sr.No. </th>"; // Fixed width for Sr.No.
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Party Name</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Product Name</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Actual Code</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Trade Discount(%)</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'> Rate</th>";
        thead += "<th class='sorting_asc' tabindex='0' aria-controls='tblMaterialData' rowspan='1' colspan='1' aria-sort='ascending' aria-label='Material : activate to sort column descending'>Old Rate</th>";
        thead += "<th> New Rate / History </th>";
        if (permissions.Material.IsEdit || permissions.Material.IsDeleted) {
            thead += "<th> Action </th>";
        }
        thead += "</tr>";
        $('#tblMaterialData thead').append(thead);

        var display = permissions.Material.IsEdit == true ? "inline" : "none";
        var displayDel = permissions.Material.IsDeleted == true ? "inline" : "none";
        var row = '';

        for (var i = 0; i < result.length; i++) {
            var rate = result[i].MaterialRates.sort().reverse();
            row += "<tr role='row'>";
            row += "<td class='sorting_1' id='MaterialId" + result[i].Material_Id + "' style='display:none'>" + result[i].Material_Id + "</td>";
            row += "<td></td>"; // Placeholder for Sr.No.
            row += "<td>" + result[i].PartyName + "</td>";
            row += "<td>" + result[i].ProductName + "</td>";
            row += "<td>" + result[i].ActualCode + "</td>";
            row += "<td>" + result[i].TradeDiscount + "</td>";
            row += "<td>" + rate[0].Rate + "</td>";
            row += "<td>" + rate[0].OldRate + "</td>";
            row += "<td><a><i class='fas fa-plus-square' style='font-size:20px;color:#902ca8' onclick=AddNewRate(" + result[i].MaterialId + ") title='Add New Rate'></i></a><a><i class='fas fa-file' style='font-size:18px;color:green;padding-left:7px' onclick=ViewHistory(" + result[i].MaterialId + ") title='History'></i></a></td>";
            if (permissions.Material.IsEdit || permissions.Material.IsDeleted) {
                row += "<td><a onclick=EditMaterial(" + result[i].MaterialId + ")><i class='fas fa-edit' style='font-size:20px;color:#902ca8;display:" + display + "' title='Edit'></i></a></td>";
            }
            row += "</tr>";
        }

        HideProgress();
        if ($.fn.DataTable.isDataTable('#tblMaterialData')) {
            $('#tblMaterialData').DataTable().clear().destroy();
        }

        $('#tblMaterialData tbody').append(row);

        // Initialize DataTable with dynamic Sr.No. logic
        var table = $('#tblMaterialData').DataTable({
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























function AddNewRate(id) {
    $('#txtMaterialId').val(id);
    $('#btnSave').css('display', 'block');
    $('#modal-addNewRate').modal('toggle');
}
$('#btnSaveNewRate').click(function (e) {

    e.preventDefault();
    var url = "/Material/Material/AddNewRate";

    var obj = {
        MaterialId: $('#txtMaterialId').val(),
        Rate: $('#txtNewRate').val(),
        WEF: ConvertDateFormatYYMMDD($('#txtNewWEF').val())
    }
    if ($('#txtNewRate').val() == '') {
        toastr.error('Rate is required.');
        return false;
    }
    else if ($('#txtNewWEF').val() == '') {
        toastr.error('WEF is required.');
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
                    $('#modal-addNewRate').modal('hide');
                    HideProgress();
                }
                else {
                    //toastr.success(SuccessMessage());
                    SweetSuccessMessage();
                    RefreshNewRate();
                    HideProgress();
                    $('#modal-addNewRate').modal('hide');
                    GetDetails();
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
function ViewHistory(id) {
    ShowProgress();
    $.ajax({
        url: "/Material/Material/GetDetailsById",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { id: id },
        type: "Get",
        success: function (result) {
            if (result == null) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                HideProgress();
            }
            else {
                $('#modal-viewHistory').modal('toggle');
                $('#lblPartyName')[0].innerText = result.PartyName;
                $('#tblHistory thead').html('');
                $('#tblHistory tbody').html('');
                var thead = "<tr role='row'>";
                thead += "<td><b>Old Rate</b></td>";
                thead += "<td><b>WEF</b></td>"
                thead += "</tr>";
                $('#tblHistory thead').append(thead);
                if (result.MaterialRates.length > 0) {
                    for (var i = 0; i < result.MaterialRates.length; i++) {
                        var row = "<tr role='row'>";
                        row += "<td>" + result.MaterialRates[i].OldRate + "</td>";
                        row += "<td>" + ConvertDateDDMMYYYY(result.MaterialRates[i].WEF) + "</td>";
                        row += "</tr>";
                        $('#tblHistory').append(row);
                    }
                }
                else {
                    var tbody = "<tr role='row' style='text-align:center'>";
                    tbody += "<td colspan='2'>No Records</td>";
                    tbody += "</tr>";
                    $('#tblHistory tbody').append(tbody);
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
function GetSampleProductDetails() {

    ShowProgress();
    var partyId = $("#ddlCompany").val();
    $.ajax({
        url: "/Material/Material/GetSampleProductDetails",
        async: false, 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { partyId: partyId },
        type: "Get",
        success: function (result) {
            if (result == null) {
                //toastr.error(NoRecordMessage());
                NoRecordFound();
                HideProgress();
            }
            else {
                $("#ddlProduct").html('');
                $("#ddlProduct").append('<option value=0>Select</option>');
                for (var i = 0; i < result.SampleNames.length; i++) {
                    $("#ddlProduct").append('<option value="' + result.SampleNames[i].SampleName + '">' + result.SampleNames[i].SampleName + '</option>');
                }
                var jsonArray = JSON.stringify(result)
                localStorage.removeItem('samples');
                localStorage.setItem('samples', jsonArray);
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
function GetLastSamplePrice() {
    var selectedSampleName = $('#ddlProduct').val();
    var data = localStorage.getItem('samples');
    var result = JSON.parse(data);
    var lastRate = result.SampleNames.filter(x => x.SampleName == selectedSampleName);
    $('#txtOldRate').val(lastRate[0].LastSampleRate);
    $('#txtRate').val(lastRate[0].LastSampleRate);
    $('#txtActualCode').val(lastRate[0].ProductName);
    $('#txtProductId').val(lastRate[0].ProductId);
}
