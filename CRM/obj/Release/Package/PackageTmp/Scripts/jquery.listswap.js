
(function ($) {
    $.fn.listswap = function (options) {
        var settings = $.extend({
            truncate: false,
            height: null,
            is_scroll: false,
            label_add: 'Add',
            label_remove: 'Remove',
            add_class: null,
            rtl: false,
        }, options);

        var i = 1;
        var wrapper = this.parent();
        var destination_search = '';
        var source_search = '';
        var rand = Math.floor((Math.random() * 999999) + 1);
        var div_id = "#listboxswap_" + rand;
        var div_id_ = "listboxswap_" + rand;
        var div_class_ = '';
        var rtl_class_ = '';
        (settings.rtl === true) ? rtl_class_ = ' rtl' : rtl_class_;
        (settings.add_class) ? div_class_ = ' ' + settings.add_class : div_class_;
        $(this).wrapAll("<div id='" + div_id_ + "' class='listboxswap" + rtl_class_ + div_class_ + "'></div>");
        wrapper = $(div_id + '.listboxswap');

        if (this.size() != 2) {
            var warning = '<p>You must choose a <strong>source select list</strong> and a <strong>destination select list</strong> only.</p>';
            $(this.parent()).append(warning);
            return;
        }

        var source_select_id = this[0].id;
        var destination_select_id = this[1].id;

        this.each(function () {
            console.log(wrapper[0]);
            var class_name = '';
            var select_id = $(this)[0].id;
            var listbox_id = 'listbox_' + select_id + '_wrapper';
            var parent_wrapper = wrapper[0];
            var parent_element = '<div id="' + listbox_id + '"></div>';
            var options_count = $(div_id + " #" + select_id + " > option").length;
            var truncate_class = '';
            var round_class = '';

            create_element(parent_wrapper, parent_element);
            (settings.truncate) ? truncate_class = ' class="truncate"' : truncate_class;
            (i % 2 !== 0) ? class_name = 'source_wrapper' : class_name = 'destination_wrapper';

            $('#' + listbox_id).addClass(class_name);

            if ($(this).attr('data-text')) {
                var text_data = '<p' + truncate_class + '>' + $(this).attr('data-text') + '</p>';
                $(div_id + ' .' + class_name).append(text_data);
            }

            if ($(this).attr('data-search')) {
                var search_data = '<div class="listbox_search">' +
								  	'<input type="text" id="search_listbox" name="search_listbox" value="' + $(this).attr('data-search') + '" />' +
									'<span class="clear"></span>' +
								  '</div>';
                $(div_id + ' .' + class_name).append(search_data);
                if (!$(this).attr('data-text')) {
                    $(div_id + ' .listbox_search').addClass('listbox_round_class');
                }
            }

            create_element('div#' + listbox_id, '<ul></ul>');

            if (!$(this).attr('data-text') && !$(this).attr('data-search')) {
                $(div_id + ' .source_wrapper ul, ' + div_id + ' .destination_wrapper ul').addClass('listbox_round_class');
            }

            $(div_id + " #" + select_id + " > option").each(function () {
                var value = this.value;
                var label = this.text;
                var wrapper = 'div#' + listbox_id;

                var element = '<li class="listbox_option" data-value="' + value + '"><span' + truncate_class + '>' + label + '</span></li>';
                $(div_id + ' ' + wrapper + ' ul').append(element);
            });

            (i % 2 !== 0) ? source_search = $(this).attr('data-search') : destination_search = $(this).attr('data-search');

            i++;
        });

        if (settings.height) {
            $(div_id + ' .source_wrapper ul, ' + div_id + ' .destination_wrapper ul').css('height', settings.height);
        }

        if (settings.is_scroll === true) {
            $(div_id + ' .source_wrapper ul, ' + div_id + ' .destination_wrapper ul').css('overflow-y', 'scroll');
        }

        $(this).css('display', 'none');
        $(this).css('visibility', 'hidden');

        var controls = '<div class="listbox_controls">' +
							'<ul>' +
					   			'<li class="add"><span class="arrow"></span><span class="label">' + settings.label_add + '</span></li>' +
					   			'<li class="remove"><span class="arrow"></span><span class="label">' + settings.label_remove + '</span></li>' +
							'</ul>' +
					   '</div>';

        $(controls).insertAfter(div_id + " .source_wrapper");

        $(div_id).append('<div class="listbox_clear"></div>');

        $(div_id + ' .source_wrapper .listbox_option, ' + div_id + ' .destination_wrapper .listbox_option').click(function () {
            $(this).toggleClass('selected');
        });

        $(div_id + ' .listbox_controls .add').click(function () {
            $(div_id + ' .source_wrapper .listbox_option.selected').each(function () {
                add_remove_handler($(this), div_id + ' .destination_wrapper ul', source_select_id, destination_select_id);
            });
            refresh_list();
        });

        $(div_id + ' .listbox_controls .remove').click(function () {
            $(div_id + ' .destination_wrapper .listbox_option.selected').each(function () {
                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
            });
            refresh_list();
        });

        if (source_search) {
            var search_selector = div_id + ' .source_wrapper';
            search_filter(search_selector);
            reset_search_input(search_selector, source_select_id);
            clear_button(search_selector);
        }

        if (destination_search) {
            var search_selector = div_id + ' .destination_wrapper';
            search_filter(search_selector);
            reset_search_input(search_selector, destination_select_id);
            clear_button(search_selector);
        }

        refresh_list();

        function add_remove_handler(target, destination, select_1, select_2) {
            var selected_options = target.clone(true);
            var data_value = target.attr('data-value');
            var text = target[0].textContent;
            $(selected_options).removeClass('selected');
            $(destination).append(selected_options);
            $(div_id + " select#" + select_1 + " option[value='" + data_value + "']").remove();
            $(div_id + " select#" + select_2).append($("<option></option>").attr("value", data_value).text(text));
            target.remove();
        }

        /*************************************************CreatedBy   start*******************************/
        /*User Role Mapping start*/
        $("#drpUserToAllot").change(function () {
            $("#drpUserFrom").val(-1);
            PopulateAllotedRoles();
        });
        $("#drpUserFrom").change(function () {
            PopulateAllotedRoles();
        });
        var PopulateAllotedRoles = function () {
            ShowProgress();
            var copyFrmUsr = $("#drpUserFrom").val();
            var userId = '';
            if (copyFrmUsr != "-1")
                userId = copyFrmUsr;
            else
                userId = $("#drpUserToAllot").val();

            $.ajax({
                type: "GET",
                //url: apiUlr + "/Role/GetRolesForUser?UserId=" + userId,
                url: "/RolePage/GetRolesForUser?UserId=" + userId,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result != null && result.LstRoleDetail != null) {
                        if (result.LstRoleDetail.length > 0) {
                            var arrAllotedRoles = [];
                            for (var i = 0; i < result.LstRoleDetail.length; i++) {
                                var value = (result.LstRoleDetail[i].RoleName + '-' + result.LstRoleDetail[i].Description).toLowerCase();
                                if ($.inArray(value, arrAllotedRoles) == -1)
                                    arrAllotedRoles.push(value);
                            }
                            /*Remove all item found in result from destination dropdown*/
                            $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                            });
                            refresh_list();
                            $(div_id + ' .source_wrapper .listbox_option').each(function () {
                                var iteratedValue = $.trim($(this).find('span').html()).toLowerCase();
                                if ($.inArray(iteratedValue, arrAllotedRoles) >= 0) {
                                    add_remove_handler($(this), div_id + ' .destination_wrapper ul', source_select_id, destination_select_id);
                                }
                            });
                            refresh_list();
                            HideProgress();
                        }
                        else {
                            $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                            });
                            refresh_list();
                            HideProgress();
                        }
                    }//resulty!=null
                    else {
                        $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                            add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                        });
                        refresh_list();
                        HideProgress();
                    }
                },
                error: function (result) {
                    bootbox.alert('Error - ' + result.ResponseCode + "; Message - " + result.ResponseMessage);
                    HideProgress();
                }
            });
        }
        /*User Role Mapping end*/

        /*Role Page Mapping start*/
        $("#drpRoles").change(function () {
            PopulateAllotedPages();
        });
        var PopulateAllotedPages = function () {
            ShowProgress();
            var roleId = $("#drpRoles").val();

            $.ajax({
                type: "GET",
                //url: apiUlr + "/Role/GetPagesForRole?RoleId=" + roleId,
                url: "/RolePage/GetPagesForRole?RoleId=" + roleId,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function (result) {

                    if (result != null && result.LstPageDetail!=null) {
                        if (result.LstPageDetail.length > 0) {
                            var arrAllotedRoles = [];
                            for (var i = 0; i < result.LstPageDetail.length; i++) {
                                var value = (result.LstPageDetail[i].PageName + '-' + result.LstPageDetail[i].Description).toLowerCase();
                                if ($.inArray(value, arrAllotedRoles) == -1)
                                    arrAllotedRoles.push(value);
                            }
                            /*Remove all item found in result from destination dropdown*/
                            $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                            });
                            refresh_list();
                            $(div_id + ' .source_wrapper .listbox_option').each(function () {
                                var iteratedValue = $.trim($(this).find('span').html()).toLowerCase();
                                if ($.inArray(iteratedValue, arrAllotedRoles) >= 0) {
                                    add_remove_handler($(this), div_id + ' .destination_wrapper ul', source_select_id, destination_select_id);
                                }
                            });
                            refresh_list();
                            HideProgress();
                        }
                        else {
                            $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                            });
                            refresh_list();
                            HideProgress();
                        }
                    }//result!=null
                    else {
                        $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                            add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                        });
                        refresh_list();
                        HideProgress();
                    }
                },
                error: function (result) {
                    bootbox.alert('Error - ' + result.ResponseCode + "; Message - " + result.ResponseMessage);
                    HideProgress();
                }
            });
        }
        /*Role Page Mapping end*/

        /*User Validation Mapping start*/
        $("#drpUsers").change(function () {
            PopulateAllotedValidations();
        });
        var PopulateAllotedValidations = function () {
            ShowProgress();
            var userId = $("#drpUsers").val();

            $.ajax({
                type: "GET",
                //url: apiUlr + "/ValidationManagement/GetValidationsForUser?UserId=" + userId,
                url: "/ValidationManagement/GetValidationsForUser?UserId=" + userId,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result != null && result.LstValidationsDetail!=null) {
                        if (result.LstValidationsDetail.length > 0) {
                            var arrAllotedRoles = [];
                            for (var i = 0; i < result.LstValidationsDetail.length; i++) {
                                var value = (result.LstValidationsDetail[i].Description).toLowerCase();
                                if ($.inArray(value, arrAllotedRoles) == -1)
                                    arrAllotedRoles.push(value);
                            }
                            /*Remove all item found in result from destination dropdown*/
                            $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                            });
                            refresh_list();

                            /*Remove all item found in result from source dropdown*/
                            $(div_id + ' .source_wrapper .listbox_option').each(function () {
                                var iteratedValue = $.trim($(this).find('span').html()).toLowerCase();
                                if ($.inArray(iteratedValue, arrAllotedRoles) >= 0) {
                                    add_remove_handler($(this), div_id + ' .destination_wrapper ul', source_select_id, destination_select_id);
                                }
                            });
                            refresh_list();
                            HideProgress();
                        }
                        else {
                            /*Remove all item found in result from destination dropdown*/
                            $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                                add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                            });
                            refresh_list();
                            HideProgress();
                        }
                    }//result!=-null
                    else
                    {
                        /*Remove all item found in result from destination dropdown*/
                        $(div_id + ' .destination_wrapper .listbox_option').each(function () {
                            add_remove_handler($(this), div_id + ' .source_wrapper ul', destination_select_id, source_select_id);
                        });
                        refresh_list();
                        HideProgress();
                    }
                },
                error: function (result) {
                    bootbox.alert('Error - ' + result.ResponseCode + "; Message - " + result.ResponseMessage);
                    HideProgress();
                }
            });
        }
        /*User Validation Mapping end*/
        /*************************************************CreatedBy   end*******************************/

        function create_element(wrapper, element) {
            return $(element).appendTo(wrapper);
        }



        function search_filter(selector) {
            $(selector + ' .listbox_search input#search_listbox').keyup(function () {
                remove_selection(selector);
                var val = $(this).val().toString().toLowerCase();
                $(selector + ' ul > li').each(function () {
                    var text = $(this).text().toString().toLowerCase();
                    (text.indexOf(val) != -1) ? $(this).show() : $(this).hide();
                    if ($(this).hasClass('even'))
                        $(this).removeClass('even');
                    if ($(this).hasClass('odd'))
                        $(this).removeClass('odd');
                });
                if (!val)
                    refresh_list();
            });
        }

        function reset_search_input(search_selector, select_id) {
            $(search_selector + ' .listbox_search input#search_listbox').focus(function () {
                var val = $(this).val().toString().toLowerCase();
                var data_search = $(div_id + ' select#' + select_id).attr('data-search').toString().toLowerCase();
                if (val == data_search)
                    $(this).val('');
            });
            $(search_selector + ' .listbox_search input#search_listbox').blur(function () {
                var val = $(this).val().toString().toLowerCase();
                var data_search = $(div_id + ' select#' + select_id).attr('data-search').toString();
                if (val == '')
                    $(this).val(data_search);
            });
        }

        function clear_button(selector) {
            $(selector + ' .listbox_search .clear').click(function () {
                $(selector + ' .listbox_search input#search_listbox').val('');
                $(selector + ' .listbox_search input#search_listbox').focus();
                $(selector + ' ul > li').each(function () {
                    $(this).show();
                });
                refresh_list();
            });
        }

        function remove_selection(selector) {
            $(selector + ' li.listbox_option').each(function () {
                if ($(this).hasClass('selected'))
                    $(this).removeClass('selected');
            });
        }

        function refresh_list() {
            $(div_id + ' .source_wrapper li.listbox_option, .listboxswap .destination_wrapper li.listbox_option').each(function () {
                if ($(this).hasClass('even'))
                    $(this).removeClass('even');
                if ($(this).hasClass('odd'))
                    $(this).removeClass('odd');
            });
            $(div_id + ' .source_wrapper li.listbox_option').filter(":even").addClass('even');
            $(div_id + ' .source_wrapper li.listbox_option').filter(":odd").addClass('odd');
            $(div_id + ' .destination_wrapper li.listbox_option').filter(":even").addClass('even');
            $(div_id + ' .destination_wrapper li.listbox_option').filter(":odd").addClass('odd');
        }
    }


}(jQuery));