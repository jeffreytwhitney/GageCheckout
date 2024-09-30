$(document).ready(function() {
  $.getScript('https://pagination.js.org/dist/2.6.0/pagination.min.js');
  $("head").append('<link rel="stylesheet" href="https://pagination.js.org/dist/2.6.0/pagination.css">');
  $('.Submit').hide();
  $(document).prop('title', 'Gage Management');
  
  $(document).on("onloadlookupfinished", function() {
    $('.Submit').hide();
    generateFormButtons();
    formatDateFields();
   
    $('.gage-table .cf-table_parent').append('<div id="pagination" class="paginationjs-small"></div>');
    paginateTable();
    wireupComboBoxEvents();
    $('.gage-table').css("visibility", "visible");

  });

});


function generateFormButtons() {
   $('.gage-table-hidden table tbody tr').addClass( "gage-row");
   generateButtons(".ReturnButton", "return-button", "Return", "callReturn");
   generateButtons(".CalibrateButton", "cal-button", "Calibrate", "callCalibrate");
   generateButtons(".HistoryButton", "history-button", "History", "callHistory");
   generateButtons(".PrintButton", "print-button", "Print", "callPrint");
   generateGoBackButtons();
   generateMissingButtons();
}


function checkPermissions(){

  var employee_number = $("#Field87").val();
  var is_active_user = $("#Field88").val().toString();
  var return_val = true;

  if (is_active_user=="False") {
    return_val = false;
  }

  if (employee_number === ''){
    return_val = false;
  }

  //return return_val
  return true;
}


function wireupComboBoxEvents(){

  
  $("#cboFilter_TicketType").on("change", function() { 
    console.log('cboFilter_TicketType changed');
    paginateTable(); 
  });
  $("#cboFilter_Department").on("change", function() {
    console.log('cboFilter_Department changed');
    paginateTable(); 
  });
  $("#cboFilter_MachineGroup" ).on("change", function() {paginateTable(); } );
  $("#txtFilter_TicketNumber").on("change", function() {paginateTable(); });
  $("#cboFilter_Operator").on("change", function() {paginateTable(); });
  $("#cboFilter_CellLeader").on("change", function() {paginateTable(); });
  $("#cboFilter_Machine").on("change", function() {paginateTable();});
  $("#cboFilter_PartNumber").on("change", function() {paginateTable();});
  $("#cboFilter_JobLot").on("change", function() {paginateTable();});
  
}


function generateGoBackButtons(){
  var $goback_buttons = $(".gobackbutton");
  $goback_buttons.each(function( index ) {
	$(this).parent().append( "<input class='return' type='button' value='Go Back' onclick='callGoBack()' />" );
  });
}


function generateButtons(buttonSelector, buttonClass, buttonTitle, buttonFunction){
  var selectionString = buttonSelector + " input[type=text]";
  var buttons = $(selectionString);
  buttons.each(function() {
    var btn_value = $(this).val();
    var btn_html = "<input class='" + buttonClass + "' type='button' value='" + buttonTitle + "' onclick='" + buttonFunction + "(" + btn_value + ")' />";
    $(this).parent().append(btn_html);
  });
}


function generateMissingButtons(){
  var $missing_buttons = $(".MissingButton input[type=text]");
  var $btn_value;
  var $ticket_type;
  $missing_buttons.each(function( index ) {

    var $ticket_id = $(this).val();
    var $ticket_type = getTicketTypeIDByTicketID($ticket_id);
    if ($ticket_type == "3"){
      $(this).parent().append( "<input class='return' type='button' value='Missing' onclick='callMissing(" + $ticket_id + ")' />" );
    }
  });
}


function generateFilterRow() {
  var $filter_row = "<TR id='filterRow'><TD/><TD/><TD/><TD/><TD/><td><input type='text' name='txtFilter_TicketNumber' id='txtFilter_TicketNumber'></td><TD><select name='cboFilter_TicketType' id='cboFilter_TicketType' style='width:100%'/></TD><TD><select name='cboFilter_Department' id='cboFilter_Department' style='width:100%'/></td><td><select name='cboFilter_Machine' id='cboFilter_Machine'></td><TD><select name='cboFilter_MachineGroup' id='cboFilter_MachineGroup' style='width:100%'/></td><td><select name='cboFilter_Operator' id='cboFilter_Operator'></td><td><select name='cboFilter_CellLeader' id='cboFilter_CellLeader'></td><td><select name='cboFilter_PartNumber' id='cboFilter_PartNumber'></td><td><select name='cboFilter_JobLot' id='cboFilter_JobLot'></td><TD/><TD/><TD/><TD/><TD/><TD/><TD/><TD/></TR>";
  $('.gage-table table tbody tr:first').parent().prepend($filter_row);
  $("#cboFilter_Department").html($("#Field52").html());
  $("#cboFilter_TicketType").html($("#Field75").html());
  $("#cboFilter_MachineGroup").html($("#Field72").html());
  fillComboBoxWithUniqueValues('#cboFilter_Machine', "Field117");
  fillComboBoxWithUniqueValues('#cboFilter_Operator', "Field121");
  fillComboBoxWithUniqueValues('#cboFilter_CellLeader', "Field122");
  fillComboBoxWithUniqueValues('#cboFilter_PartNumber', "Field162");
  fillComboBoxWithUniqueValues('#cboFilter_JobLot', "Field163");
}


function callPrint(ticket_id){
  alert("I don't do anything!");
}


function callHistory(ticket_id){
  alert("I don't do anything!");
}




function callMissing(ticket_id){

  var has_permissions = checkPermissions();
  if (has_permissions){

	$("#Field41-3").prop("checked", true).change();
    $("#Field102").val(ticket_id).change();
    $("#Field73").val(ticket_id).change();
  	$('.Submit').show();
  }
  else{
   	alert("Sorry, you do not have permissions to do this.");
  }
}


function callReturn(ticket_id){
  var has_permissions = checkPermissions();
  if (has_permissions){
    $("#filterRow").remove();
    $("#Field41-0").prop("checked", true).change();
    $("#Field73").val(ticket_id).change();
    $("#form1").submit();
  }
  else{
   	alert("Sorry, you do not have permissions to do this.");
  }
}


function callCalibrate(ticket_id) {
  var has_permissions = checkPermissions();
  if (has_permissions){
    var $ticketTypeID = getTicketTypeIDByTicketID(ticket_id);

    $("#Field41-1").prop("checked", true);

    if ($ticketTypeID == "1"){
      $("#Field27").val(ticket_id).change();
    }
    else if ($ticketTypeID == "2"){
      $("#Field45").val(ticket_id).change();
    }
    else if ($ticketTypeID == "3"){
      $("#Field61").val(ticket_id).change();
    }

    $('.Submit').show();
  }
  else{
   	alert("Sorry, you do not have permissions to do this.");
  }
}


function callGoBack(){
  $("#Field27").val("").change();
  $("#Field45").val("").change();
  $("#Field61").val("").change();
  $("#Field102").val("").change();
  $('.Submit').hide();
}


function getTicketTypeIDByTicketID(ticket_id) {
  var $ticket_typeid;
  var $ticket_ids = $(".gage-table-hidden table .Gages_TicketID_Column");
	
  $ticket_ids.each(function( index ) {
  	var $row_ticket_id = $(this).find('input[type=text]:first').val();
    if ($row_ticket_id == ticket_id){
     	$ticket_typeid = $(this).parent().find(".Gages_TicketTypeID_Column").find('input[type=text]:first').val();
      	return;
    }
  });
  return $ticket_typeid;
}


function fillComboBoxWithUniqueValues(comboBoxSelector, rowSelector) {
  var comboBox = $(comboBoxSelector);
  var rowSelectorString = `.gage-table-hidden [id^=${rowSelector}]`;
  var comboSelectorString = `${comboBoxSelector} option`;
  comboBox.empty();
  comboBox.append($('<option>', {
    value: "",
    text: ""
  }));

  var rows = $(rowSelectorString);
  rows.each(function() {
    var row_Value = $(this).val();
    var isExist = !! $(comboSelectorString).filter(function() {
      return $(this).attr('value').toLowerCase() === row_Value.toLowerCase();
    }).length;

    if (!isExist) {
      $(comboBoxSelector).append($('<option>', {
        value: row_Value,
        text: row_Value
      }));
    }
  });
  sortComboBox(comboBoxSelector);
}
	
	
function sortComboBox(selector) {
  selector_options = `${selector} option`;
  var options = $(selector_options);
  var arr = options.map(function(_, o) {
    return {
      t: $(o).text(),
      v: o.value
    };
  }).get();
  arr.sort(function(o1, o2) {
    return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
  });
  options.each(function(i, o) {
    o.value = arr[i].v;
    $(o).text(arr[i].t);
  });
}



function formatDateFields(){
  var $last_cal_date_fields = $("[id^='Field123']");
  $last_cal_date_fields.each(function( index ) {
    $(this).val($(this).val().split(" ")[0]);
  });

  var $cal_due_date_fields = $("[id^='Field124']");
  $cal_due_date_fields.each(function( index ) {
    $(this).val($(this).val().split(" ")[0]);
  });
  
  var $created_date_fields = $("[id^='Field166']");
  $created_date_fields.each(function( index ) {
    $(this).val($(this).val().split(" ")[0]);
  });
  
  
  
}


function paginateTable(){
  console.log('paginateTable called');
  if (!$('#filterRow').length) {
    console.log('there is no filter row');
    generateFilterRow();
    
  }
  
  //var rows = getfilteredRows();
  
  $('#pagination').pagination({
    dataSource: getfilteredRows(),
    pageSize: 15,
    callback: function(data, pagination) {
      data.unshift($('#filterRow'));
      $('.gage-table tbody').html(data);
      wireupComboBoxEvents();
    }
  })
  
}


function shouldFilterRows() {
  var returnVal = false;
  
  if ($('#txtFilter_TicketNumber').val() != '') {returnVal = true;}
  if ($('#cboFilter_TicketType').val() != '') {returnVal = true;}
  if ($('#cboFilter_Operator').val() != '') {returnVal = true;}
  if ($('#cboFilter_CellLeader').val() != '') {returnVal = true;}
  if ($('#cboFilter_Department').val() != '') {returnVal = true;}
  if ($('#cboFilter_Machine').val() != '') {returnVal = true;}
  if ($('#cboFilter_MachineGroup').val() != '') {returnVal = true;}
  if ($('#cboFilter_PartNumber').val() != '') {returnVal = true;}
  if ($('#cboFilter_JobLot').val() != '') {returnVal = true;}
  
  return returnVal;
}


function getfilteredRows() {
  console.log('getfilteredRows called');
  var rows = [];
  
  var gage_rows = $(".gage-table-hidden .gage-row")
  var ticketNumberFilter = $('#txtFilter_TicketNumber').val().toLowerCase();
  var ticketTypeFilter = $('#cboFilter_TicketType').val().toLowerCase();
  var operatorFilter = $('#cboFilter_Operator').val().toLowerCase();
  var cellLeaderFilter = $('#cboFilter_CellLeader').val().toLowerCase();
  var departmentFilter = $('#cboFilter_Department').val().toLowerCase();
  var machineFilter = $('#cboFilter_Machine').val().toLowerCase();
  var machineGroupFilter = $('#cboFilter_MachineGroup').val().toLowerCase();
  var partNumberFilter = $('#cboFilter_PartNumber').val().toLowerCase();
  var joblotFilter = $('#cboFilter_JobLot').val().toLowerCase();
  
  var shouldFilterRow = shouldFilterRows();
  var okToAdd = true;
 

  
  console.log('TicketTypeFilter = ' + ticketTypeFilter);
  gage_rows.each(function(index) {

    if (shouldFilterRow == false) {
      console.log('push all rows');
      rows.push($(this).clone());
      return;
    }
    else {
      okToAdd = true;

      if (ticketNumberFilter !== '') {
        var row_ticketNumber = $(this).find('.ticket-number-col input[type=text]').val().toLowerCase();
        if (!row_ticketNumber.includes(ticketNumberFilter)) {
          okToAdd = false;
        }
      }

      if (ticketTypeFilter != '') {
        console.log('ticket type filter has a value');
        var row_ticketType = $(this).find('.ticket-type-col input[type=text]').val().toLowerCase();
        if (ticketTypeFilter != row_ticketType) {
          console.log('set okToAdd = false');
          okToAdd = false;
        }
      }

      if (operatorFilter != '') {
        var row_Operator = $(this).find('.operator-col input[type=text]').val().toLowerCase();
        if (operatorFilter != row_Operator) {
          okToAdd = false;
        }
      }

      if (cellLeaderFilter != '') {
        var row_CellLeader = $(this).find('.cell-leader-col input[type=text]').val().toLowerCase();
        if (cellLeaderFilter != row_CellLeader) {
          okToAdd = false;
        }
      }

      if (departmentFilter != '') {
        var row_department = $(this).find('.department-col input[type=text]').val().toLowerCase();
        if (departmentFilter != row_department) {
          okToAdd = false;
        }
      }

      if (machineFilter != '') {
        var row_Machine = $(this).find('.machine-name-col input[type=text]').val().toLowerCase();
        if (machineFilter != row_Machine) {
          okToAdd = false;
        }
      }

      if (machineGroupFilter != '') {
        var row_machineGroup = $(this).find('.machine-group-col input[type=text]').val().toLowerCase();
        if (machineGroupFilter != row_machineGroup) {
          okToAdd = false;
        }
      }
      
      if (partNumberFilter != '') {
        var row_partNumber = $(this).find('.part-number-col input[type=text]').val().toLowerCase();
        if (partNumberFilter != row_partNumber) {
          okToAdd = false;
        }
      }
            
      if (joblotFilter != '') {
        var row_joblot = $(this).find('.joblot-col input[type=text]').val().toLowerCase();
        if (joblotFilter != row_joblot) {
          okToAdd = false;
        }
      }
	  
      if (okToAdd){
        rows.push($(this).clone());
      }
      
    }
  });

  console.log('Filtered Row Count:' + rows.length);
  return rows;
}
