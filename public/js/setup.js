var checkLogIn = function () {
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	$.getJSON('/' + id +'/profile.json', function(js) { //return json of employee tuple from their id 
	  $('#id').attr("id", js.data[0].empID);
	  $('#employeeID').attr("value", js.data[0].empID);
	  $('#fName').html(js.data[0].firstName);
	  $('#lName').html(js.data[0].lastName);
	  if(js.data[0].empType == "admin"){
	  }
	  else if(js.data[0].empType == "pl"){
		$( ".admin" ).remove();
	  }
	  else{
		$( ".admin" ).remove();
		$( ".pl" ).remove();
	  }
   })
	  .done(function() {
		  $.getJSON('/' + id +'/homeLoad.json', function(js) { //return json of array of project tuples where employee id is in employee id list
			  if(js.data != null){
				  $("#ifNoProj").remove();
			  }
			  $.each( js.data, function( id, project){
				var m = (project.finDate).split('-');
				$("#projects").append(
				'<div class = "project" id = "' + project.projectID + '"><h1 style="margin: 0px;" onclick = "sendToProjectView(&apos;' + project.projectID + '&apos;)">' + project.title + '</h1><div>Status: ' + project.status + '</div><div>Due Date: ' + m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + '</div></div><p></p>');
			});
		  })
			.fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			})
	  })
	  .fail( function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
		})
};

var hourOrSal = function (binary){
	if (binary == "0"){
		return "Hourly";
	}
	else{
		return "Salary";
	}
};

var loadProfile = function (){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	hideAll(1);
		if($("#profileInfo").children().length == 0){
			$.getJSON('/' + id +'/profile.json', function(js) { //return json of employee tuple from their id
					var m = (js.data[0].datePayed).split('-');
                  $("#profileInfo").append(
				  		'<p> Employee ID: ' + js.data[0].empID + '</p><p> Email: ' + js.data[0].email + '</p><p> Department ID: ' + js.data[0].deptID + ' </p><p> Pay Rate: $' + js.data[0].payrate + '</p><p> Pay Type: ' + hourOrSal(js.data[0].hourOrSal) + ' </p><p> Last Paycheck: ' + m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + '</p><ul> Lead for Projects:</ul><form method="post" action="/changePassword" ><h3>New Password:</h3><input type="text" id="empIDForm" name="empIDForm" value = "' + js.data[0].empID + '" style = "display: none;" readonly><p>Email(if you want to change it):</p><input type="email" id="email" name="email"><p>Current Password:</p><input type="text" id="oldPass" name="passwordCurr"><p>New Password:</p><input type="text" id="newPass" name="passwordNew"><br><br><input type="submit" value="Set Password"></form>');
               })
			   	.done(function() {
				  $.getJSON('/' + id +'/homeLoad.json', function(js) { //return json of array of project tuples where employee id is in employee id list
					  $.each( js.data, function( id, project){
						if(project.projectLead == $($("#profile").children()[0]).attr("id")){
							$("#profileInfo").find("ul").append(
								'<li id = "' + project.projectID + '" onclick = "sendToProjectView(&apos;' + project.projectID + '&apos;)">' + project.title + '</li>');
						}
					  });
					})
					.fail( function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})
				  })
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})

		}
		
		$("#profileBlock").css("display", "block");
};

var loadDueToday = function (){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	var today = new Date();
	var n = (today.toString()).split(" ");
	var isEmpty = true;
	hideAll(1);
		if($("#dueToday").children().length == 0){
			$.getJSON('/' + id +'/dueToday.json', function(js) { // return json with task tuples that match employee ID and also match the current date.
					$.each( js.data, function( taskid, task){
						var m = (task.finDate).split('-');
						var date = new Date(m[0], m[1], m[2].substring(0,2));
						if($("#dueToday").find("#"+ task.projectID).length == 0 && today.getMonth() == date.getMonth() && today.getDate() == date.getDate() && today.getYear() == date.getYear()){
							isEmpty = false;
							$("#dueToday").append(
							'<h2 onclick = "sendToProjectView(' + task.projectID + ')" ></h2><ul id = "' + task.projectID + '"></ul>');
						}
						if(today.getMonth() == date.getMonth() && today.getDate() == date.getDate() && today.getYear() == date.getYear()){
							$("#dueToday").find("#"+ task.projectID).append(
							'<li id = "' + task.taskID + '">' + task.title + '</li>');
						}
					});	
					if(isEmpty){
						$("#dueToday").append(
							'<p>No tasks due on today&apos;s date:'  + n[1] + " " + n[2] + ", " + n[3] + '</p>');
					}
               })
			   	.done(function() {
					if(!isEmpty){
					  $.getJSON('/' + id +'/homeLoad.json', function(js) {  //return json of array of project tuples where employee id is in employee id list
						  $.each( js.data, function( id, project){
							$($("#dueToday").find("#"+ project.projectID).prev()).html(project.title);
						  });
						})
						.fail( function(d, textStatus, error) {
							console.error("getJSON failed, status: " + textStatus + ", error: "+error)
						})
					}
				  })
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})

		}
		
		$("#dueTodayBlock").css("display", "block");
};

var loadMeeting = function () {
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	hideAll(1);
		if($("#meetingBlock").children().length == 5){
			$.getJSON('/' + id + '/meetings.json', function(js) {  //return json of array of all meetings with employees ID inside its empID list ordered from oldest date to newest
					var today = new Date();
					var n = (today.toString()).split(" ");
					$.each( js.data, function( a, meeting){
						var m = (meeting.date).split('-');
						var date = new Date(m[0], m[1], m[2].substring(0,2));
						if(today.getMonth() == date.getMonth() && today.getDate() == date.getDate() && today.getYear() == date.getYear()){
							$("#meetingsToday").append(
							'<h3>' + m[2].substring(3, 8) + '</h3><p>' + meeting.projectID + '</p>');
						}
						else if(today < date){
							$("#meetings").append(
							'<h3>'+ m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + " at "+ m[2].substring(3, 8) + '</h3><p>' + meeting.projectID + '</p>');
						}
					});	
               })
			   	.done(function() {
				  $.getJSON('/' + id +'/homeLoad.json', function(js) {  // return json of array of project tuples where employee id is in employee id list
					  $.each( $("#meetingsToday").children("p") , function( n, div){
						$.each( js.data , function( n, project){
							if($(div).html() == project.projectID){
								$(div).html(project.title);
							}
						});
					  });
					  $.each( $("#meetings").children("p") , function( n, div){
						$.each( js.data , function( n, project){
							if($(div).html() == project.projectID){
								$(div).html(project.title);
							}
						});
					  });
					})
					.fail( function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})
				  })
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})


		}
		
		$("#meetingBlock").css("display", "block");
};

var loadFinances = function (){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	hideAll(1);
		if($("#finance").children().length == 0){
			$.getJSON('/' + id +'/homeLoad.json', function(js) {  //return json of array of project tuples where employee id is in employee id list
					$.each( js.data, function( n, project){
						if($("#finance").find("#"+ project.projectID + "2").length == 0 & project.projectLead == $($("#profile").children()[0]).attr("id")){
							$("#finance").append(
							'<h2 onclick = "sendToProjectView(' + project.projectID + '2)" >' + project.title + '</h2><p>Budget: $' + project.budget + '</p><p>Current Balance: $' + project.current_balance + '</p><h3>Last 3 Transactions:</h3><div id = "' + project.projectID + '"></div><button type="submit" onclick = "new function(){$(&quot;#form-' + project.projectID + '&quot;).css(&quot;display&quot;, &quot;block&quot;);}">New Transaction</button><form id = "form-'+ project.projectID +'" style = "display: none;" action = "/newTrans" method = "post"><h3> New Project Transaction </h3><label for="pID">Project ID:</label><br><input type="text" id="pID" name="pID" value = "'+ project.projectID +'" readonly><br><label for="payID">Employee ID:</label><br><input type="text" id="payID" name="payID" value = "' + $("#profile").children("p").attr("id") + '" readonly><br><label for="amount">Amount: (use negative if withdrawl)</label><br><input type="text" id="amount" name="amount" required><br><label for="desc">Description:</label><br><textarea type="text" id="desc" name="desc" rows = 3 required></textarea><br><label for="dest">Destination: </label><br><input type="text" id="dest" name="dest" required><br><button type="submit">Submit</button></form>');
						}
					});	
               })
			   	.done(function() {
				  $.getJSON('/' + id +'json/finances.json', function(js) {  // return last 3 transactions for all projects where employee is a project lead
					  $.each( js.data, function( id, trans){
						var m = (trans.date).split('-');
						$("#finance").find("#"+ trans.projectID).append(
						'<li style = "pointer-events: none;" id = "' + trans.transID + '">' + m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + ' - $' + trans.amount + ': ' + trans.description + '</li>');
					  });
					})
					.fail( function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})
				  })
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})


		}
		
		$("#financeBlock").css("display", "block");
};

var loadNewAcct = function (){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	hideAll(1);
		if($("#newAcct").children().length == 0){
			$.getJSON('/' + id +'/profile.json', function(js) { //return json of employee tuple from their id 
                  $("#newAcct").append(
				  '<form><label for="fname">First name:</label><br><input type="text" id="fname" name="fname" required><br><label for="mname">Middle name:</label><br><input type="text" id="mname" name="mname"><br><label for="lname">Last name:</label><br><input type="text" id="lname" name="lname" required><br><label for="deptID">Department ID:</label><br><input type="text" id="deptID" name="deptID" required><br><label for="payrate">Pay Rate: </label><br><input type="text" id="payrate" name="payrate" required><br><input type="radio" id="salary" name="salOrHour" value="Salary"><label for="Salary" required>Salary</label><br><input type="radio" id="hourly" name="salOrHour" value="Hourly"><label for="Hourly" required>Hourly</label><br><input type="submit" value="Submit"></form>');
               })
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})

		}
		
		$("#acctBlock").css("display", "block");
};

var loadAdmin = function (){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	hideAll(1);
		if($("#empList").children("tbody").children().length == 1){
			$.getJSON('/' + id +'/deptList', function(js) {
				$.each( js.data, function( n, dept){
                  $("#deptList").append(
				  	'<tr id = "' + dept.deptID + '-row"><th>' + dept.deptID + '</th><th class = "empRename" >'+ dept.deptHead + '</th><th class = "empRename" id = "'+ dept.deptID +'-empList"></th><th class = "projRename" id = "'+ dept.deptID +'-projList"></th><th>$'+ dept.current_balance +'</th></tr>');
				  $("#editDept").append(
					'<option value="' + dept.deptID + '">' + dept.deptID + '</option>');
				})
            })
				.done( function(){
					$.getJSON('/' + id +'/deptProjRelation', function(js) {
						$.each( js.data, function( n, dpRelation){
						  $("#" + dpRelation.deptID + "-projList").html($("#" + dpRelation.deptID + "-projList").html() + dpRelation.projectID + ",");
						})
					})
					.done( function(){
							$.getJSON('/' + id +'/projList', function(js) {
								$.each( js.data, function( n, project){
									var a = (project.startDate).split('-');
									var b = (project.finDate).split('-');
								  $("#projList").append(
								'<tr id = "' + project.projectID + '-row"><th>' + project.projectID + '</th><th> ' + project.title + '</th><th>' + project.deptID +'</th><th class = "empRename">'+ project.projectLead +'</th><th class = "empRename" id = "' + project.projectID + '-list"></th><th>'+ a[1] + "/" + a[2].substring(0,2) + "/" + a[0] +'</th><th>'+ b[1] + "/" + b[2].substring(0,2) + "/" + b[0] +'</th><th>$' + project.budget +'</th><th>$'+ project.current_balance +'</th><th>' + project.estTime + ' hrs.</th><th>' + project.timeTotal + ' hrs.</th><th>' + project.status + '</th></tr>');
								  $("#editProj").append(
											  '<option value="' + project.projectID + '">' + project.title + '</option>');
								})
								$("#projList").css("font-size","11px");
							})
							.done( function(){
								$.getJSON('/' + id +'/deptEmpRelation', function(js) {
									$.each( js.data, function( n, dpRelation){
									  $("#" + dpRelation.deptID + "-empList").html($("#" + dpRelation.deptID + "-empList").html() + dpRelation.empID + ",");
									})
								})
								.done( function(){
									$.getJSON('/' + id +'/projRelation', function(js) {
										$.each( js.data, function( n, dpRelation){
										  $("#" + dpRelation.projectID + "-list").html($("#" + dpRelation.projectID + "-list").html() + dpRelation.empID + ",");
										})
									})
									.done( function(){
									$.getJSON('/' + id +'/empList', function(js) {
											$.each( js.data, function( n, employee){
												var c = employee.datePayed.split('-');
												$.each( $(".empRename"), function( n, idHTML){
													var newHTML = "";
													$.each( $(idHTML).html().split(","), function( n, id){
														if(id == employee.empID){
															newHTML += employee.firstName + " " + employee.lastName + ",";
														}
														else if($(idHTML).html().split(",").length != n+1 || $(idHTML).html().split(",").length < 2){
															newHTML += id + ",";
														}
													})
													$(idHTML).html(newHTML);
												})
											  $("#empList").append(
												'<tr id = "' + employee.empID + '-row"><th>' + employee.firstName + '</th><th>' + employee.midName + '</th><th>' + employee.lastName + '</th><th>' + employee.deptID +'</th><th class = "projRename" id = "' + employee.empID + '-list"></th><th>$' + employee.payrate + '</th><th>' + hourOrSal(employee.hourOrSal) + '</th><th>' + c[1] + "/" + c[2].substring(0,2) + "/" + c[0] + '</th><th>' + employee.empID + '</th><th>' + employee.empType + '</th></tr>');
											  $("#editEmp").append(
											  '<option value="' + employee.empID + '">' + employee.lastName + ", " + employee.firstName + '</option>');
											})
											$.each( $(".empRename"), function( n, idHTML){
												$(idHTML).html($(idHTML).html().slice(0,-1));
												$(idHTML).html($(idHTML).html().replace(/,/g,", "));
											})
											$("#empList").css("font-size", "13px");
										})
										.done( function(){
											$.getJSON('/' + id +'/projRelation', function(js) {
												$.each( js.data, function( n, dpRelation){
													  $("#" + dpRelation.empID + "-list").html($("#" + dpRelation.empID + "-list").html() + dpRelation.projectID + ",");
													})
												})
											  .done( function(){
												$.getJSON('/' + id +'/projList', function(js) {
													$.each( js.data, function( n, project){
														$.each( $(".projRename"), function( n, idHTML){
															var newHTML = "";
															$.each( $(idHTML).html().split(","), function( n, id){
																if(id == project.projectID){
																	newHTML += project.title + ",";
																}
																else if($(idHTML).html().split(",").length != n+1){
																	newHTML += id + ",";
																}
															})
															$(idHTML).html(newHTML)
														})
													})
													$.each( $(".projRename"), function( n, idHTML){
														$(idHTML).html($(idHTML).html().slice(0,-1));
														$(idHTML).html($(idHTML).html().replace(/,/g,", "));
													})
													})
												  .fail( function(d, textStatus, error) {
													console.error("getJSON failed, status: " + textStatus + ", error: "+error)
													})
												})
											  .fail( function(d, textStatus, error) {
												console.error("getJSON failed, status: " + textStatus + ", error: "+error)
												})
											})
									  .fail( function(d, textStatus, error) {
										console.error("getJSON failed, status: " + textStatus + ", error: "+error)
										})
									})
								  .fail( function(d, textStatus, error) {
									console.error("getJSON failed, status: " + textStatus + ", error: "+error)
									})
								})
							  .fail( function(d, textStatus, error) {
								console.error("getJSON failed, status: " + textStatus + ", error: "+error)
								})
							})
						  .fail( function(d, textStatus, error) {
							console.error("getJSON failed, status: " + textStatus + ", error: "+error)
							})
						})
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})
				})
				.fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
				})

		}
		
		$("#adminBlock").css("display", "block");
};


var sendToProjectView = function(id){
	$("#projID").attr("value", id);
	document.getElementById("openProject").submit();
};

var hideAll = function (m){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	var divs = $("body").children("div");
	$.each(divs, function( n, block ){
		if(n > m){
			$(block).css("display", "none");
		}
	});
};

var loadProjView = function (){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	$.getJSON('/' + id +'/taskList.json', function(js) { // return json of all task tuples with selected project id
		  $("#backToHome").attr("action", "/" + id + "/home");
		  $.each( js.data, function( n, task ){
			  var m = task.startDate.split('-');
			$("#" + task.status).append('<div class = "task" id = "' + task.taskID + '"onclick = "loadTask(&apos;' + task.taskID+ '&apos;)" ><h3>' + task.title + '</h3><p id = "' + task.empID + '"></p><p> Start Date: ' + m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + ' </p><p> Tags: ' + task.tags + ' </p></div>');
		  });
	   })
		.done(function() {
			$.getJSON('/' + id +'/projectEmp.json', function(js) { // return json of all employee tuples who work on selected project
			  $.each( $("#projectBlock").children(".row").children().children("div"), function( n, task ){
				$.each(js.data, function (m, emp){
					if($($(task).children()[1]).attr("id") == emp.empID){
						$($(task).children()[1]).append(emp.firstName + " " + emp.lastName);
					}
				});
			  });
		   })
			.done(function() {
			$.getJSON('/' + id +'/projectData.json', function(js) { // return json of the selected projects tuple
				$("#overview").html(js.data[0].overview);
				$("#projectName").html(js.data[0].title);
				var url = window.location.href.split("/");
				$("#empID").attr("value", url[url.length-2]);
				$("#projectIDForm").attr("value", id);
		   })
		   	.fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			})
		})
		   	.fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			})
		})
		.fail( function(d, textStatus, error) {
			console.error("getJSON failed, status: " + textStatus + ", error: "+error)
		})
};

var loadTask = function (div){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	if($("#taskBlock").css("display") == "none"){
		$.getJSON('/' + id + '/taskList.json', function(js) { // return json of all task tuples with selected project id
				$.each( js.data, function(n, task) {
					if(task.taskID == div){
						$("#title").attr("value",task.title); 
						$("#overview2").html(task.overview);
						$("#tags").attr("value",task.tags);
						$("#empIDForm").attr("value",task.empID);
						$("#startDate").attr("value",task.startDate.slice(0,-1));
						$("#estTime").attr("value",task.estTime);
						$("#finDate").attr("value",task.finDate.slice(0,-1));
						$("#totalTime").attr("value",task.totalTime);
						$("#taskID").attr("value",task.taskID);
						$("#" + task.status + "2").attr("checked", true);
						$("#projectIDForm").attr("value", id);
					}
					
				})
		   })
			  .fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
				})		
		$("#taskBlock").css("display", "block");
	}
	else{
		$("#title").attr("value","(Task Name)"); 
		$("#overview2").html("");
		$("#tags").attr("value", "");
		$("#empIDForm").attr("value", "");
		$("#startDate").attr("value","");
		$("#estTime").attr("value","");
		$("#finDate").attr("value","");
		$("#totalTime").attr("value", "");
		$("#taskID").attr("value", "1" );
		$("#open2").attr("checked", true);
		$("#taskBlock").css("display", "none");
		$("#projectIDForm").attr("value", id);
		
	}
};

var loadMeetLog = function () {
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	hideAll(0);
		if($("#meetingLog").children().length == 1 && $("#futureMeetings").children().length == 1){
			$.getJSON('/' + id + '/meetings2.json', function(js) {  //return json of array of all meetings with project ID, ordered from oldest date to newest
					var today = new Date();
					$.each( js.data, function( n, meeting){
						var m = (meeting.date).split('-');
						var date = new Date(m[0], m[1], m[2].substring(0,2));
						if(today > date && !(today.getMonth() == date.getMonth() && today.getDate() == date.getDate() && today.getYear() == date.getYear())){
							$("#meetingLog").append('<h2 onclick="loadMeeting(&apos;' + meeting.meetingID + '&apos;);"> Meeting on ' + m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + " at "+ m[2].substring(3,8) + '</h2><p>"' + meeting.notes + '"</p>');
						}
						else{
							$("#futureMeetings").append('<h2 onclick="loadMeeting(&apos;' + meeting.meetingID + '&apos;);"> Meeting on ' + m[1] + "/" + m[2].substring(0,2) + "/" + m[0] + " at "+ m[2].substring(3,8) + '</h2>');
						}
					});	
               })
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})


		}
		
		$("#meetingBlock").css("display", "block");
};

var loadMeeting = function (div){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	if($("#editMeetBlock").css("display") == "none"){
		$.getJSON('/' + id + '/meetings2.json', function(js) { // return json of all task tuples with selected project id
				$.each( js.data, function(n, meet) {
					if(meet.meetingID == div){
						$("#date").attr("value",meet.date.slice(0,-1)); 
						$("#notes").html(meet.notes);
						$("#meetingID").attr("value", meet.meetingID);
					}
					
				})
		   })
			  .done( function(){
					$.getJSON('/' + id +'/meetRelation', function(js) {
						$.each( js.data, function( n, dpRelation){
							if(div == dpRelation.meetingID){
								console.log(div + "-" + dpRelation.empID);
								$("#empListForm").attr("value", $("#empListForm").html() + dpRelation.empID + ",");
							}
						})
					})
				  .fail( function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
					})
				})
			  .fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
				})		
		$("#editMeetBlock").css("display", "block");
	}
	else{
		$("#date").attr("value", ""); 
		$("#empListForm").attr("value", "");
		$("#notes").html("Enter notes here...");
		$("#meetingID").attr("value", "1");
		$("#editMeetBlock").css("display", "none");
		
	}
};

var collExp = function(div){
	if($(div).css("display") == "none"){
		$(div).css("display", "block");
	}
	else{
		$(div).css("display","none");
	}
};

var popEmp = function(){
	var empForm = $("#empForm").children("input");
	if($("#editEmp").children("option:selected").val() == ""){
		$("#empIDForm").attr("value", "1");
		$('#empForm')
            .find(':radio, :checkbox').removeAttr('checked').end()
            .find('textarea, :text, select').val('')
		return;
	}
	$($(empForm)[1]).attr("value", "");
	var rowInfo = $("#" + $("#editEmp").children("option:selected").val() + "-row").children();
	$($(empForm)[0]).attr("value", $($(rowInfo)[0]).html());
	$($(empForm)[1]).attr("value", $($(rowInfo)[1]).html());
	$($(empForm)[2]).attr("value", $($(rowInfo)[2]).html());
	$($(empForm)[3]).attr("value", $($(rowInfo)[3]).html());
	$($(empForm)[4]).attr("value", $($(rowInfo)[5]).html().substring(1));
	if($($(rowInfo)[6]).html() == "Salary"){
		$($(empForm)[6]).attr("checked", true);
		$($(empForm)[5]).removeAttr('checked');
	}
	else{
		$($(empForm)[5]).attr("checked", true);
		$($(empForm)[6]).removeAttr('checked');
	}
	if($($(rowInfo)[9]).html() == "admin"){
		$($(empForm)[7]).removeAttr('checked');
		$($(empForm)[8]).removeAttr('checked');
		$($(empForm)[9]).attr("checked", true);
	}
	else if($($(rowInfo)[9]).html() == "pl"){
		$($(empForm)[7]).removeAttr('checked');
		$($(empForm)[8]).attr("checked", true);
		$($(empForm)[9]).removeAttr('checked');
	}
	else{
		$($(empForm)[7]).attr("checked", true);
		$($(empForm)[8]).removeAttr('checked');
		$($(empForm)[9]).removeAttr('checked');
	}
	$("#empIDForm").attr("value", $($(rowInfo)[8]).html());
};

var popProj = function(){
	var empForm = $("#projForm").children("input");
	if($("#editProj").children("option:selected").val() == ""){
		$($(empForm)[4]).removeAttr("value");
		$($(empForm)[5]).removeAttr("value");
		$($(empForm)[6]).removeAttr("readonly");
		$("#projectIDForm").attr("value", "1");
		$('#projForm')
            .find(':radio, :checkbox').removeAttr('checked').end()
            .find('textarea, :text, select, input[type=datetime-local]').val('')
		return;
	}
	$("#overviewP").html("");
	$($(empForm)[3]).attr("value", "");
	$.getJSON('/' + $("#editProj").children("option:selected").val() +'/projectData.json', function(js) {
		$($(empForm)[0]).attr("value", js.data[0].title)
		$("#overviewP").html(js.data[0].overview);
		$($(empForm)[1]).attr("value", $($("#" + $("#editProj").children("option:selected").val() + "-row").children()[2]).html());
		$($(empForm)[2]).attr("value", js.data[0].projectLead);
		$($(empForm)[4]).attr("value", js.data[0].startDate.slice(0,-1));
		$($(empForm)[5]).attr("value", js.data[0].finDate.slice(0,-1));
		$($(empForm)[6]).attr("value", js.data[0].budget);
		$($(empForm)[6]).attr("readonly", "");
		$($(empForm)[7]).attr("value", js.data[0].estTime);
		$("#projectIDForm").attr("value", js.data[0].projectID);
	})
		.done( function(){
			$.getJSON('/' + $("#editProj").children("option:selected").val() + '/projRelation', function(js) {
				$.each( js.data, function( n, dpRelation){
					if( dpRelation.projectID == $("#editProj").children("option:selected").val()){
					$($(empForm)[3]).attr("value", $($(empForm)[3]).attr("value") + dpRelation.empID + ", ");
					}
				});
			})
			.fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			});
		})
		.fail( function(d, textStatus, error) {
			console.error("getJSON failed, status: " + textStatus + ", error: "+error)
		});
};

var popDept = function(){
	var arr = window.location.href.split("/");
	var id = arr[arr.length-2];
	var empForm = $("#deptForm").children("input");
	if($("#editDept").children("option:selected").val() == ""){
		$($(empForm)[2]).removeAttr("readonly");
		$('#deptForm')
            .find(':radio, :checkbox').removeAttr('checked').end()
            .find('textarea, :text, select, input[type=datetime-local]').val('')
		return;
	}
	$($(empForm)[1]).attr("value", "");
	$($(empForm)[2]).attr("value", $($("#" + $("#editDept").children("option:selected").val() + "-row").children()[4]).html().slice(1));
	$($(empForm)[2]).attr("readonly", "");
	$("#deptIDForm").attr("value", "1");
	$.getJSON('/' + id + '/deptList', function(js) {
		$.each( js.data, function( n, dept){
			if( dept.deptID == $("#editDept").children("option:selected").val()){
				$($(empForm)[0]).attr("value", dept.deptHead);
					$("#deptIDForm").attr("value", dept.deptID);
			}
		});
	})
		.done( function(){
			$.getJSON('/' + id + '/deptEmpRelation', function(js) {
				$.each( js.data, function( n, dpRelation){
					if( dpRelation.deptID == $("#editDept").children("option:selected").val()){
						$($(empForm)[1]).attr("value", $($(empForm)[1]).attr("value") + dpRelation.empID + ", ");
					}
				});
			})
			.fail( function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			});
		})
		.fail( function(d, textStatus, error) {
			console.error("getJSON failed, status: " + textStatus + ", error: "+error)
		});
};
