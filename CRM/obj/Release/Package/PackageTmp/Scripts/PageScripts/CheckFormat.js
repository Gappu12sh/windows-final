
function CheckDigit() {
    $('.numbers').keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            //$("#errmsg").html("Digits Only").show().fadeOut("slow");
            toastr.error('Enter Digits Only.');
            return false;
        }
    });
}


toastr.options = {
    "timeOut": 5000
};




function Rs(amount) {
    var words = new Array();
    words[0] = 'Zero'; words[1] = 'One'; words[2] = 'Two'; words[3] = 'Three'; words[4] = 'Four'; words[5] = 'Five'; words[6] = 'Six'; words[7] = 'Seven'; words[8] = 'Eight'; words[9] = 'Nine'; words[10] = 'Ten'; words[11] = 'Eleven'; words[12] = 'Twelve'; words[13] = 'Thirteen'; words[14] = 'Fourteen'; words[15] = 'Fifteen'; words[16] = 'Sixteen'; words[17] = 'Seventeen'; words[18] = 'Eighteen'; words[19] = 'Nineteen'; words[20] = 'Twenty'; words[30] = 'Thirty'; words[40] = 'Forty'; words[50] = 'Fifty'; words[60] = 'Sixty'; words[70] = 'Seventy'; words[80] = 'Eighty'; words[90] = 'Ninety'; var op;
    amount = amount.toString();
    var atemp = amount.split('.');
    var number = atemp[0].split(',').join('');
    var n_length = number.length;
    var words_string = '';
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = '';
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + ' ';
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += 'Crores ';
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += 'Lakhs ';
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += 'Thousand ';
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += 'Hundred and ';
            } else if (i == 6 && value != 0) {
                words_string += 'Hundred ';
            }
        }
        words_string = words_string.split(' ').join(' ');
    }
    return words_string;
}
function RsPaise(n) {
    nums = n.toString().split('.')
    var op = '';
    var whole = Rs(nums[0])
    if (nums[1] == null) nums[1] = 0;
    if (nums[1].length == 1) nums[1] = nums[1] + '0';
    if (nums[1].length > 2) { nums[1] = nums[1].substring(2, length - 1) }
    if (nums.length == 2) {
        if (nums[0] <= 9) { nums[0] = nums[0] * 10 } else { nums[0] = nums[0] };
        var fraction = Rs(nums[1])
        if (whole == '' && fraction == '') { op = 'Zero only'; }
        if (whole == '' && fraction != '') { op = 'paise ' + fraction + ' only'; }
        //if (whole != '' && fraction == '') { op = 'Rupees ' + whole + ' only'; }
        //if (whole != '' && fraction != '') { op = 'Rupees ' + whole + 'and paise ' + fraction + ' only'; }
        if (whole != '' && (fraction == '' || fraction == '00')) { op = whole + ' only'; }
        if (whole != '' && fraction != '') { op = whole + 'and paise ' + fraction + ' only'; }
        //amt = document.getElementById('amt').value;
        //if (amt > 999999999.99) { op = 'Oops!!! The amount is too big to convert'; }
        //if (isNaN(amt) == true) { op = 'Error : Amount in number appears to be incorrect. Please Check.'; }
        //document.getElementById('op').innerHTML = op;
    }
    return op;
}

// Validate Decimal//
$(document).on('keypress', '.decimalValidate', function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        toastr.error('Enter digits only.');
        event.preventDefault();
    }
    //var text = $(this).val();
    //if ((text.indexOf('.') != -1) &&
    //    (text.substring(text.indexOf('.')).length > 4) &&
    //    (event.which != 0 && event.which != 8) &&
    //    ($(this)[0].selectionStart >= text.length - 2)) {
    //    event.preventDefault();
    //}
    //var number = $(this).val();
    //if (number.length == 2) {
    //    if (number.indexOf('/') == 1) {
    //        $('#' + $(this)[0].id).val(number);
    //    }
    //    else {
    //        if (event.key != '.') {
    //            $('#' + $(this)[0].id).val(number + '.');
    //        }
    //    }
    //}
})
// Validate Numeric //
$(document).on('keypress', '.numericValidate', function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        toastr.error('Enter digits only.');
        event.preventDefault();
    }
    var text = $(this).val();
    if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.')).length > 3) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 3)) {
        event.preventDefault();
    }
})


// Validate email//
$(document).on('keyup', '.validateEmail', function (event) {
    var emailReg = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(this.value);
    
    return emailReg;
})
function validateEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.value);
    if (!regex) {
        $('#' + email.id).addClass('is-invalid');
    }
    else {
        $('#' + email.id).removeClass('is-invalid')
    }
    return regex;
}
