
    var currentLocations = [];
var currentDepartments = [];


$(function (){
    

$.ajax({
    type: 'GET',
    url: "php/getAll.php",
    data: {},
    dataType: 'json',
    async: false,
    success: function(results) {

        // Update Main HTML Table  
        let data = results["data"];              
        let usersArray = [];
        let html_table = ``;
       
        
        for(let i=0; i < data.length; i++){
            usersArray.push(data[i]);
        }

        for(let i=0; i < usersArray.length; i++){
            html_table += `<tr class="tableRow" id="${usersArray[i].id}"><td scope="row" class="tableIcon"style="display:none;"></td><td scope="row">${usersArray[i].firstName}</td><td scope="row">${usersArray[i].lastName}</td><td scope="row" class="em">${usersArray[i].email}</td><td scope="row" class="job">${usersArray[i].jobTitle}</td><td scope="row" class="dep">${usersArray[i].department}</td><td scope="row" class="loc">${usersArray[i].location}</td><td scope="row" class="edit"><button type="button"id="editbtn${usersArray[i].id}" class="btn btn-secondary"data-bs-toggle="modal" data-bs-target="#userSelectModal"><i class="fas fa-edit"></i></button> <button type="button"id="delete${usersArray[i].firstName}" class="btn btn-danger"data-bs-toggle="modal" data-bs-target="#userDeleteModal"><i class="fas fa-trash"></i></button></td></tr>`;
            
        };
        
        $('#mainTable').html(html_table); 
        

    },
    error: function(jqXHR, exception){
        errorajx(jqXHR, exception);
        console.log("Get profiles");
    }    
}); 

    
        $('.tableRow').click(function() {

            var current_user;
            current_user = this.id
            console.log(current_user)
    
           
    
            // Generate specific user details
            $.ajax({
                type: 'GET',
                url: "php/getemployeeByID.php",
                data: {
                    id: current_user
                },
                dataType: 'json',
                async: false,
                success: function(results) {
    
                    const data = results["data"]
                    const returned_user = data.personnel['0'];
                    
                    $('#userSelectModalLabel').html(`${returned_user.firstName} ${returned_user.lastName}`);
                    $('#employeeid').val(returned_user.id);
                    $('#employeefirstName').val(returned_user.firstName);
                    $('#employeelastName').val(returned_user.lastName);
                    $('#employeeemail').val(returned_user.email);
                    $('#employeejobTitle').val(returned_user.jobTitle);
                    $('#employeedepartment').val(returned_user.department);
                    $('#employeelocation').val(returned_user.location);
                    $("#edit").attr("userID", returned_user.id);
    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
            // Delete User
       
            $('#deleteConfirm').html(`${$('#userSelectModalLabel').html()}<br>`);
          
            $(`#delUserConfirm`).on('click', event => {
                var userID = $('#employeeid').val();
               
                $.ajax({

                    type: 'POST',
                    url: "php/deleteUserByID.php",
                    data: {
                        id: userID,
                    },
                    dataType: 'json',
                    async: false,
                    success: function(results) {
                        getdata();
                       // location.reload();
                       
                    },
            
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                }) 
            })
$.ajax({
        type: 'GET',
        url: "php/getDepartmentsByUser.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {
    
            let data = results["data"];
            let depArray = [];
           
    
            for(let i=0; i < data.length; i++){
                depArray.push(data[i]);
                $("#deptm").append(`<option value="${depArray[i].department}">${depArray[i].department}</option>`);
            }
    
            
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }) ;
    $('#deptm').on('change', function() {
        var srch = $('#deptm').val();
        
       
       $.ajax({
            type: 'POST',
            url: "php/searchdept.php",
            data: {
                srch: srch,
            },
            dataType: 'json',
            async: false,
            success: function(results) {
                let searchData = results["data"];
                let list = searchData['personnel'];
            
                var search_html_table = "";
            
                // Update Main HTML Table
                for(i=0; i < list.length; i++){
                    
                    search_html_table += `<tr class="tableRow" id="${list[i].id}"><td scope="row" class="tableIcon"style="display:none;"></td><td scope="row">${list[i].firstName}</td><td scope="row">${list[i].lastName}</td><td scope="row" class="em">${list[i].email}</td><td scope="row" class="job">${list[i].jobTitle}</td><td scope="row" class="dep">${list[i].department}</td><td scope="row" class="loc">${list[i].location}</td><td scope="row" class="edit"><button type="button"id="editbtn${list[i].id}" class="btn btn-secondary"data-bs-toggle="modal" data-bs-target="#userSelectModal"><i class="fas fa-edit"></i></button> <button type="button"id="delete${list[i].firstName}" class="btn btn-danger"data-bs-toggle="modal" data-bs-target="#userDeleteModal"><i class="fas fa-trash"></i></button></td></tr>`;
                    
                }
                
                $('#mainTable').html(`${search_html_table}`);
                //$('#sqlTable').find('tbody').html(`${search_html_table}`);
           
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    
    })



        });
        
       

        
            // Generate specific user det
            $("#edit").click(function(){      

                $("#userEditModal").modal('show'); 
                $('.modal-backdrop').show(); // Show the grey overlay.
        
                // Generate specific user details
                $.ajax({
                    type: 'GET',
                    url: "php/getemployeeByID.php",
                    data: {
                        id: $("#edit").attr("userID")
                    },
                    dataType: 'json',
                    async: false,
                    success: function(results) {
        
                        const data = results["data"]
                        const returned_user = data.personnel['0'];
                        
                        $('#edit_user_firstName').val(returned_user.firstName);
                        $('#edit_user_lastName').val(returned_user.lastName);
                        $('#edit_user_email').val(returned_user.email);
                        $('#edit_user_jobTitle').val(returned_user.jobTitle);
                        $('#edit_user_department').html(returned_user.department);
                        $('#edit_user_location').html(returned_user.location);
                        $("#editUserConfirm").attr("userID", returned_user.id);
        
        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                })
        
            $.ajax({
                type: 'GET',
                url: "php/getDepartmentsByUser.php",
                data: {},
                dataType: 'json',
                async: false,
                success: function(results) {
        
                    currentDepartments = [];
                    let data = results["data"];
        
                    for(let i=0; i < data.length; i++){
                        currentDepartments.push(data[i]);
                    }
        
                },
        
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            })   
        
            let departmentSelection = "";
            for(i=0; i<currentDepartments.length; i++){
                if(currentDepartments[i].department == $('#edit_user_department').html()){
                    departmentSelection += `<option value="${currentDepartments[i].id}" selected="selected">${currentDepartments[i].department}</option>`
                } else {
                    departmentSelection += `<option value="${currentDepartments[i].id}">${currentDepartments[i].department}</option>`
                }                
            }
        
            $('#edit_user_department').html(departmentSelection);
        
            $("#edit_user_department").change(function(){
                
                let locationSelectionHTML = "";
                let locationID = document.getElementById('edit_user_department').value;
                
                for(let i=0; i < currentDepartments.length; i++){
                    if (currentDepartments[i]['id'] == locationID){
                        locationSelectionHTML = `${currentDepartments[i]['location']}`
                    }
                }
                
                $('#edit_user_location').html(locationSelectionHTML);
            })
        })
      
    
        
        // Confirm Edit User -> PHP Routine
        
        $("#editUserForm").submit(function(e) {
        
           
        
            $.ajax({
                type: 'POST',
                url: "php/updateUser.php",
                data: {
                    firstName: $('#edit_user_firstName').val(),
                    lastName: $('#edit_user_lastName').val(),
                    email: $('#edit_user_email').val(),
                    jobTitle: $('#edit_user_jobTitle').val(),
                    departmentID: $('#edit_user_department').val(),
                    id: $("#editUserConfirm").attr("userID")
                },
                dataType: 'json',
                async: false,
                success: function(results) {
                    getdata();
                   
                },
        
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            }) 
            
        });
        
    
   
  

//add employee
$(`#addEmp`).on('click', event => {
            
    $('.modal-backdrop').show(); // Show the grey overlay.
    getDepartmentsByUser();
   
    let departmentSelection = ``;

    for(i=0; i<currentDepartments.length; i++){
        departmentSelection += `<option value="${currentDepartments[i].id}">${currentDepartments[i].department}</option>`
    }

    $('#add_department').html(departmentSelection);

    function updateLocation(){
        let locationSelectionHTML = "";
        let locationID = document.getElementById('add_department').value;
        
        for(let i=0; i < currentDepartments.length; i++){
            if (currentDepartments[i]['id'] == locationID){
                locationSelectionHTML = `${currentDepartments[i]['location']}`
            }
        }
        
        $('#add_location').html(locationSelectionHTML);
    }

    updateLocation();

    $("#add_department").change(function(){
        updateLocation();
    })

});

// Confirm Add User -> PHP Routine
$("#EmployeeForm").submit(function(e) {

   

    $.ajax({
        type: 'POST',
        url: "php/addemployee.php",
        data: {
            firstName: $('#add_firstName').val(),
            lastName: $('#add_lastName').val(),
            email: $('#add_email').val(),
            jobTitle: $('#add_jobTitle').val(),
            departmentID: $('#add_department').val()
        },
        dataType: 'json',
        async: false,
        success: function(results) {
           getdata();
           
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
});


    


   


//generate department list
function getDepartmentsByUser(){
    $.ajax({
        type: 'GET',
        url: "php/getDepartmentsByUser.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {

            currentDepartments = [];
            let data = results["data"];

            for(let i=0; i < data.length; i++){
                currentDepartments.push(data[i]);
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })   
}


$.ajax({
    type: 'GET',
    url: "php/getDepartmentsByUser.php",
    data: {},
    dataType: 'json',
    async: false,
    success: function(results) {

        let data = results["data"];
        let depArray = [];
        let dep_html = ``;

        for(let i=0; i < data.length; i++){
            depArray.push(data[i]);
        }

        for(let i=0; i < depArray.length; i++){
            dep_html += `<tr id="${depArray[i].id}" class=" departmentEdit depTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentEditModal" title="${depArray[i].department}" location="${depArray[i].locationID}" users="${depArray[i].users}" departmentID="${depArray[i].id}"><td scope="row" class="department"> ${depArray[i].department} </td><td scope="row" class="department_location"> ${depArray[i].location} </td><td scope= "row"> <button type="update" id = "editdep${depArray[i].id}"class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="departmentEditModal"><i class="fas fa-edit"></i></button><button type="button" class="btn btn-danger" id="departmentDelete" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentDeleteModal"><i class="fas fa-trash"></i></button>
            </td></tr>`;
        }

        $('#departmentsList').html(dep_html);


    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    }
}) ;

//edit department..................................................................................................................





//generate location list.....................................................................................................
$(`#location`).on('click', event => {

    // Generate the html table with locations list 
    $.ajax({
        type: 'GET',
        url: "php/getallLoc.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {
            let data = results["data"];
            let locArray = [];
            let loc_html = ``;
            
            for(let i=0; i < data.length; i++){
                locArray.push(data[i]); 
                    
                    
                    
                    

            }

            for(let i=0; i < locArray.length; i++){
                loc_html += `<tr id="${locArray[i].id}" class=" locationEdit locTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#locationEditModal" locationName="${locArray[i].location}" locationID="${locArray[i].id}" departments="${locArray[i].departments}"><td scope="row" class="locationHeader">${locArray[i].location}</td><td scope= "row">${locArray[i].departments}</td><td scope= "row"> <button type="update" id = "editloc"class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="locationEditModal"><i class="fas fa-edit"></i></button> <button type="button" class="btn btn-danger" id="locationDelete" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#locationDeleteModal"><i class="fas fa-trash"></i></button>  
                </td></tr>`;
                
                
            }

            $('#locationsList').html(loc_html);
           
           
           
        
           
                
        },

      error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })   
$(".locationEdit").click(function(){      
            
    $('.modal-backdrop').show();

    $('#edit_location_name').val(this.attributes.locationName.value);
    $('#edit_location_name').attr("locID", this.attributes.locationID.value);

    var locID = this.attributes.locationID.value;
    alert(locID)
    $.ajax({
        type: 'GET',
        url: "php/countdep.php",
        data: {
    
            id:locID,
        },
        dataType: 'json',
        async: false,
        success: function(result) {
           
          alert(result.data[0]['dept'])
           
            if (result.data[0]['dept'] == 0){
                $("#delLocConfirm").show();
                document.getElementById("delmessage").innerHTML = "Warning! Location will be  deleted permanently.";
                
            } else {
                $("#delLocConfirm").hide();
                let text = document.getElementById("delmessage").innerHTML = "Location cannot be deleted. It consists of "+ result.data[0]['dept']  + " departments.";
            }
                   
    
                        
                
                
        },
    
      error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })   

   
  /*  if (this.attributes.departments.value == 0){
        $("#delLocConfirm").show();
        $("#locationDelete").attr("locationName",this.attributes.locationName.value);
        $("#locationDelete").attr("locationID",this.attributes.locationID.value);
    } else {
        $("#delLocConfirm").hide();
        let text = document.getElementById("delmessage").innerHTML = "Location cannot be deleted. It consists of "+ this.attributes.departments.value  + " departments.";
    }*/


});


//delete location
$(".locationEdit").click(function(){
            
    $('#delLocName').html(`${this['attributes']['locationName']['value']}`);
   
  
        
        
    var locID = this.attributes.locationID.value;
  

    $("#delLocForm").submit(function(e) {

       
        $.ajax({
            type: 'POST',
            url: "php/delloc.php",
            data: {
                locationID: locID,
            },
            dataType: 'json',
            async: false,
            success: function(results) {
                  
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }) 
    })
});
}); 

// Edit Location -> PHP Routine
$("#editLocForm").submit(function(e) {



$.ajax({
    type: 'POST',
    url: "php/updateloc.php",
    data: {
        name: $('#edit_location_name').val(),
        locationID: $('#edit_location_name').attr("locID"),
    },
    dataType: 'json',
    async: false,
    success: function(results) {
      
        getall();
    },

    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    }
}) 
})



//add new location
$("#addLocation").click(function(){
    $('.modal-backdrop').show();
    $('#newLocName').val("");
})

// Add Location -> PHP Routine
$("#addLocForm").submit(function(e) {

   

    $.ajax({
        type: 'POST',
        url: "php/addlocation.php",
        data: {
            name: $('#newLocName').val(),
        },
        dataType: 'json',
        async: false,
        success: function(results) {
            getall();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })

});
//add department


 $("#addDepartment").on(function(){      
        
        document.getElementById('newDepName').value = "";
        $.ajax({
            type: 'GET',
            url: "php/getallLoc.php",
            data: {},
            dataType: 'json',
            async: false,
            success: function(results) {
    
                currentLocations = [];
                let data = results["data"];
    
                for(let i=0; i < data.length; i++){
                    currentLocations.push(data[i]);
                }
    
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });   
        let locationSelection = "";
        for(i=0; i<currentLocations.length; i++){
            locationSelection += `<option value="${currentLocations[i].id}">${currentLocations[i].location}</option>`
        }

        $('#newDepLocation').html(locationSelection);

    });
//edit department................................
$(`#department`).on('click', event => {

    $('.modal-backdrop').show(); // Show the grey overlay.
    $.ajax({
        type: 'GET',
        url: "php/getDepartmentsByUser.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {
    
            let data = results["data"];
            let depArray = [];
            let dep_html = ``;
    
            for(let i=0; i < data.length; i++){
                depArray.push(data[i]);
            }
    
            for(let i=0; i < depArray.length; i++){
                dep_html += `<tr id="${depArray[i].id}" class=" departmentEdit depTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentEditModal" title="${depArray[i].department}" location="${depArray[i].locationID}" users="${depArray[i].users}" departmentID="${depArray[i].id}"><td scope="row" class="department"> ${depArray[i].department} </td><td scope="row" class="department_location"> ${depArray[i].location} </td> <td scope ="row">${depArray[i].users}</td><td scope= "row"> <button type="update" id = "editdep${depArray[i].id}"class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="departmentEditModal"><i class="fas fa-edit"></i> </button><button type="button" class="btn btn-danger" id="departmentDelete" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentDeleteModal"><i class="fas fa-trash"></i></button>
                </td></tr>`;
            }
          
    
            $('#departmentsList').html(dep_html);
    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }) ;
    $("#addDepartment").click(function(){      
            
        document.getElementById('newDepName').value = "";
       $.ajax({
        type: 'GET',
        url: "php/getallLoc.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {

            currentLocations = [];
            let data = results["data"];

            for(let i=0; i < data.length; i++){
                currentLocations.push(data[i]);
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })   
    
        let locationSelection = "";
        for(i=0; i<currentLocations.length; i++){
            locationSelection += `<option value="${currentLocations[i].id}">${currentLocations[i].location}</option>`
        }
    
        $('#newDepLocation').html(locationSelection);
    
    });
$('.depTableRow').click(function(){
            
    $('.modal-backdrop').show(); // Show the grey overlay.

    $('#editDepName').val(`${this.title}`);
    $('#editDepForm').attr("depID", `${this.attributes.departmentID.value}`);
    
    var depID = this.attributes.departmentID.value;
    var locID = this.attributes.location.value;
    alert(depID)
    $.ajax({
        type: 'GET',
        url: "php/countuser.php",
        data: {
    
            id:depID,
        },
        dataType: 'json',
        async: false,
        success: function(result) {
           
          alert(result.data[0]['users'])
           
            if (result.data[0]['users'] == 0){
                $("#delDepConfirm").show();
                document.getElementById("deldepmessage").innerHTML = "Warning !! Department  will be deleted permanently.";
                
            } else {
                document.getElementById("deldepmessage").innerHTML = "Department cannot be deleted. It consists of " + result.data[0]['users']  + " Employees records.";
                $("#delDepConfirm").hide();
               
            }
                   
    
                        
                
                
        },
    
      error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })   

    
    /*if (this.attributes.users.value == 0){
        $("#delDepConfirm").show();
        $("#departmentDelete").attr("departmentName",this.attributes.title.value);
        $("#departmentDelete").attr("departmentID",this.attributes.departmentID.value);
    } else {
         document.getElementById("deldepmessage").innerHTML = "Department cannot be deleted. It consists of " + this.attributes.users.value + " Employees records.";
        $("#delDepConfirm").hide();
       
    }*/

    $.ajax({
        type: 'GET',
        url: "php/getallLoc.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {

            currentLocations = [];
            let data = results["data"];

            for(let i=0; i < data.length; i++){
                currentLocations.push(data[i]);
            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })   
    let locationSelection = "";
    for(i=0; i<currentLocations.length; i++){
        
        if(currentLocations[i].id == locID){
            locationSelection += `<option value="${currentLocations[i].id}" selected="selected">${currentLocations[i].location}</option>`
        }
        else {
            locationSelection += `<option value="${currentLocations[i].id}">${currentLocations[i].location}</option>`
        }
    }

    $('#editDepLocation').html(locationSelection);
});


// Confirm Edit Department -> PHP Routine
$("#editDepForm").submit(function(e) {

    
    $.ajax({
        type: 'POST',
        url: "php/updatedept.php",
        data: {
            name: $('#editDepName').val(),
            locationID: $('#editDepLocation').val(),
            departmentID: this.attributes.depID.value
        },
        dataType: 'json',
        async: false,
        success: function(results) {
        
           getalldept();
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }) 

})
//delete department
$('.depTableRow').click(function(){      
    
   
    $('#delDepName').html(`${this['attributes']['title']['value']}`);

    var depID = this.attributes.departmentID.value;
    
    $("#delDepConfirm").click(function(){ 
        var depIDInt = parseInt(depID)
        
        $.ajax({
            type: 'POST',
            url: "php/deldep.php",
            data: {
                id: depIDInt,
            },
            dataType: 'json',
            async: false,
            success: function(results) {
              getalldept();
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
        
    })
});

});


  //add dept........................... 
 

    $("#addDepForm").submit(function(e) {

       

        $.ajax({
            type: 'POST',
            url: "php/addDepartment.php",
            data: {
                name: $('#newDepName').val(),
                locationID: $('#newDepLocation').val()
            },
            dataType: 'json',
            async: false,
            success: function(results) {
                getalldept();
            },

            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })

    })
     //populate search department dropdown//////////////////////////////////////////////////////////////////////////
 $.ajax({
        type: 'GET',
        url: "php/getDepartmentsByUser.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {
    
            let data = results["data"];
            let depArray = [];
           
    
            for(let i=0; i < data.length; i++){
                depArray.push(data[i]);
                $("#deptm").append(`<option value="${depArray[i].department}">${depArray[i].department}</option>`);
            }
    
            
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }) ;
    //Search department //////
    $('#deptm').on('change', function() {
        var srch = $('#deptm').val();
        
       
       $.ajax({
            type: 'POST',
            url: "php/searchname.php",
            data: {
                department: srch,
            },
            dataType: 'json',
            async: false,
            success: function(results) {
                alert('hello')
                generateSearchResultsUsers(results);
           
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    
    })
//populate search location dropdown/////////////////////////////////////////////////////////////////////////////////////
$.ajax({
    type: 'GET',
    url: "php/getallLoc.php",
    data: {},
    dataType: 'json',
    async: false,
    success: function(results) {
        let data = results["data"];
        let locArray = [];
        let loc_html = ``;

        for(let i=0; i < data.length; i++){
            locArray.push(data[i]);
            $("#loca").append(`<option value="${locArray[i].location}">${locArray[i].location}</option>`);
        }

       
       
        
    
    
    },

  error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })   
    /////search location
$('#loca').on('change', function() {
    var loca = $('#loca').val();
   
    $.ajax({
        type: 'POST',
        url: "php/searchname.php",
        data: {
            location: loca,
        },
        dataType: 'json',
        async: false,
        success: function(results) {
            alert('hello')
            generateSearchResultsUsers(results);
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
})


  

 
function generateSearchResultsUsers(results){
    let searchData = results["data"];
    let list = searchData['personnel'];

    var search_html_table = "";

    // Update Main HTML Table
    for(i=0; i < list.length; i++){
        
        search_html_table += `<tr class="tableRow" id="${list[i].id}"><td scope="row" class="tableIcon"style="display:none;"></td><td scope="row">${list[i].firstName}</td><td scope="row">${list[i].lastName}</td><td scope="row" class="em">${list[i].email}</td><td scope="row" class="job">${list[i].jobTitle}</td><td scope="row" class="dep">${list[i].department}</td><td scope="row" class="loc">${list[i].location}</td><td scope="row" class="edit"><button type="button"id="editbtn${list[i].id}" class="btn btn-secondary"data-bs-toggle="modal" data-bs-target="#userSelectModal"><i class="fas fa-edit"></i></button> <button type="button"id="delete${list[i].firstName}" class="btn btn-danger"data-bs-toggle="modal" data-bs-target="#userDeleteModal"><i class="fas fa-trash"></i></button></td></tr>`;
        
    }
    
    //$('#mainTable').html(`${search_html_table}`);
    $('#sqlTable').find('tbody').html(`${search_html_table}`);
    $('.tableRow').click(function() {

        var current_user;
        current_user = this.id
        console.log(current_user)

       

        // Generate specific user details
        $.ajax({
            type: 'GET',
            url: "php/getemployeeByID.php",
            data: {
                id: current_user
            },
            dataType: 'json',
            async: false,
            success: function(results) {

                const data = results["data"]
                const returned_user = data.personnel['0'];
                
                $('#userSelectModalLabel').html(`${returned_user.firstName} ${returned_user.lastName}`);
                $('#employeeid').val(returned_user.id);
                $('#employeefirstName').val(returned_user.firstName);
                $('#employeelastName').val(returned_user.lastName);
                $('#employeeemail').val(returned_user.email);
                $('#employeejobTitle').val(returned_user.jobTitle);
                $('#employeedepartment').val(returned_user.department);
                $('#employeelocation').val(returned_user.location);
                $("#edit").attr("userID", returned_user.id);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
        // Delete User
   
        $('#deleteConfirm').html(`${$('#userSelectModalLabel').html()}<br>`);
      
        $(`#delUserConfirm`).on('click', event => {
            var userID = $('#employeeid').val();
           
            $.ajax({

                type: 'POST',
                url: "php/deleteUserByID.php",
                data: {
                    id: userID,
                },
                dataType: 'json',
                async: false,
                success: function(results) {
                    getdata();
                   // location.reload();
                   
                },
        
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            }) 
        })





    });
    
   

    
        // Generate specific user det
        $("#edit").click(function(){      

            $("#userEditModal").modal('show'); 
            $('.modal-backdrop').show(); // Show the grey overlay.
    
            // Generate specific user details
            $.ajax({
                type: 'GET',
                url: "php/getemployeeByID.php",
                data: {
                    id: $("#edit").attr("userID")
                },
                dataType: 'json',
                async: false,
                success: function(results) {
    
                    const data = results["data"]
                    const returned_user = data.personnel['0'];
                    
                    $('#edit_user_firstName').val(returned_user.firstName);
                    $('#edit_user_lastName').val(returned_user.lastName);
                    $('#edit_user_email').val(returned_user.email);
                    $('#edit_user_jobTitle').val(returned_user.jobTitle);
                    $('#edit_user_department').html(returned_user.department);
                    $('#edit_user_location').html(returned_user.location);
                    $("#editUserConfirm").attr("userID", returned_user.id);
    
    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            })
    
        $.ajax({
            type: 'GET',
            url: "php/getDepartmentsByUser.php",
            data: {},
            dataType: 'json',
            async: false,
            success: function(results) {
    
                currentDepartments = [];
                let data = results["data"];
    
                for(let i=0; i < data.length; i++){
                    currentDepartments.push(data[i]);
                }
    
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })   
    
        let departmentSelection = "";
        for(i=0; i<currentDepartments.length; i++){
            if(currentDepartments[i].department == $('#edit_user_department').html()){
                departmentSelection += `<option value="${currentDepartments[i].id}" selected="selected">${currentDepartments[i].department}</option>`
            } else {
                departmentSelection += `<option value="${currentDepartments[i].id}">${currentDepartments[i].department}</option>`
            }                
        }
    
        $('#edit_user_department').html(departmentSelection);
    
        $("#edit_user_department").change(function(){
            
            let locationSelectionHTML = "";
            let locationID = document.getElementById('edit_user_department').value;
            
            for(let i=0; i < currentDepartments.length; i++){
                if (currentDepartments[i]['id'] == locationID){
                    locationSelectionHTML = `${currentDepartments[i]['location']}`
                }
            }
            
            $('#edit_user_location').html(locationSelectionHTML);
        })
    })
  

    
    // Confirm Edit User -> PHP Routine
    
    $("#editUserForm").submit(function(e) {
    
       
    
        $.ajax({
            type: 'POST',
            url: "php/updateUser.php",
            data: {
                firstName: $('#edit_user_firstName').val(),
                lastName: $('#edit_user_lastName').val(),
                email: $('#edit_user_email').val(),
                jobTitle: $('#edit_user_jobTitle').val(),
                departmentID: $('#edit_user_department').val(),
                id: $("#editUserConfirm").attr("userID")
            },
            dataType: 'json',
            async: false,
            success: function(results) {
                getdata();
               
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }) 
        
    });
    

}

$("#advanced-button").on("click", function() {
    $("#advanced-button").hide();
    $("#advancedRow").show();
    $("#remove-button").show();
});

// Function to do the oppsite of before and hide the advanced search
$("#remove-button").on("click", function() {
    $("#remove-button").hide();
    $("#advancedRow").is(":visible")?$("#advancedRow").hide():$("#advancedRow").show();
    $("#advanced-button").is(":visible")?$("#advanced-button").hide():$("#advanced-button").show();
    $('.loca').val('all').trigger('change');
    $('.deptm').val('all').trigger('change');
});


});
    

function getdata(){
$.ajax({
    type: 'GET',
    url: "php/getAll.php",
    data: {},
    dataType: 'json',
    async: false,
    success: function(results) {

        // Update Main HTML Table  
        let data = results["data"];              
        let usersArray = [];
        let html_table = ``;
       
        
        for(let i=0; i < data.length; i++){
            usersArray.push(data[i]);
        }

        for(let i=0; i < usersArray.length; i++){
            html_table += `<tr class="tableRow" id="${usersArray[i].id}"><td scope="row" class="tableIcon"style="display:none;"></td><td scope="row">${usersArray[i].firstName}</td><td scope="row">${usersArray[i].lastName}</td><td scope="row" class="em">${usersArray[i].email}</td><td scope="row" class="job">${usersArray[i].jobTitle}</td><td scope="row" class="dep">${usersArray[i].department}</td><td scope="row" class="loc">${usersArray[i].location}</td><td scope="row" class="edit"><button type="button"id="editbtn${usersArray[i].id}" class="btn btn-secondary"data-bs-toggle="modal" data-bs-target="#userSelectModal"><i class="fas fa-edit"></i></button> <button type="button"id="delete${usersArray[i].firstName}" class="btn btn-danger"data-bs-toggle="modal" data-bs-target="#userDeleteModal"><i class="fas fa-trash"></i></button></td></tr>`;
            
        };
        
        $('#mainTable').html(html_table); 

    },
    error: function(jqXHR, exception){
        errorajx(jqXHR, exception);
        console.log("Get profiles");
    }   

}); 
}
function allloc(){
$.ajax({
    type: 'GET',
    url: "php/getallLoc.php",
    data: {},
    dataType: 'json',
    async: false,
    success: function(results) {
        let data = results["data"];
        let locArray = [];
        let loc_html = ``;
        
        for(let i=0; i < data.length; i++){
            locArray.push(data[i]); 
                
                
                
                

        }

        for(let i=0; i < locArray.length; i++){
            loc_html += `<tr id="${locArray[i].id}" class=" locationEdit locTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#locationEditModal" locationName="${locArray[i].location}" locationID="${locArray[i].id}" departments="${locArray[i].departments}"><td scope="row" class="locationHeader">${locArray[i].location}</td><td scope= "row">${locArray[i].departments}</td><td scope= "row"> <button type="update" id = "editloc"class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="locationEditModal"><i class="fas fa-edit"></i></button> <button type="button" class="btn btn-danger" id="locationDelete" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#locationDeleteModal"><i class="fas fa-trash"></i></button>  
            </td></tr>`;
            
            
        }

        $('#locationsList').html(loc_html);
            
    },

  error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })   
}
function getalldept(){
    $.ajax({
        type: 'GET',
        url: "php/getDepartmentsByUser.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(results) {
    
            let data = results["data"];
            let depArray = [];
            let dep_html = ``;
    
            for(let i=0; i < data.length; i++){
                depArray.push(data[i]);
            }
    
            for(let i=0; i < depArray.length; i++){
                dep_html += `<tr id="${depArray[i].id}" class=" departmentEdit depTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentEditModal" title="${depArray[i].department}" location="${depArray[i].locationID}" users="${depArray[i].users}" departmentID="${depArray[i].id}"><td scope="row" class="department"> ${depArray[i].department} </td><td scope="row" class="department_location"> ${depArray[i].location} </td><td scope= "row"> <button type="update" id = "editdep${depArray[i].id}"class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="departmentEditModal"<i class="fas fa-edit"></i></button><button type="button" class="btn btn-danger" id="departmentDelete" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentDeleteModal"><i class="fas fa-trash"></i></button>
                </td></tr>`;
            }
    
            $('#departmentsList').html(dep_html);
            
    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }) ;
}


$( "#searchbar" ).keyup(function() {
    $.ajax({
                
        url: "php/searchname.php",
        type: 'GET',
        data: {
            searchTerm:$("#searchbar").val(),
        },
        dataType: 'json',
        async: false,
        
       
       
        success: function(results) {
            
        
            let data = results["data"];              
            let usersArray = [];
            let html_table = ``;
           
            
            for(let i=0; i < data.length; i++){
                usersArray.push(data[i]);
            }
    
            for(let i=0; i < usersArray.length; i++){
                html_table += `<tr class="tableRow" id="${usersArray[i].id}"><td scope="row" class="tableIcon"style="display:none;"></td><td scope="row">${usersArray[i].firstName}</td><td scope="row">${usersArray[i].lastName}</td><td scope="row" class="em">${usersArray[i].email}</td><td scope="row" class="job">${usersArray[i].jobTitle}</td><td scope="row" class="dep">${usersArray[i].department}</td><td scope="row" class="loc">${usersArray[i].location}</td><td scope="row" class="edit"><button type="button"id="editbtn${usersArray[i].id}" class="tableRow btn btn-secondary" data-bs-toggle="modal" data-bs-target="#userSelectModal"><i class="fas fa-edit"></i></button> <button type="button"id="delete${usersArray[i].firstName}" class="btn btn-danger"data-bs-toggle="modal" data-bs-target="#userDeleteModal"><i class="fas fa-trash"></i></button></td></tr>`;
                
            };
            
            $('#mainTable').html(html_table);
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    
    
        $('.tableRow').click(function() {

            var current_user;
            current_user = this.id
            console.log(current_user)
    
           
    
            // Generate specific user details
            $.ajax({
                type: 'GET',
                url: "php/getemployeeByID.php",
                data: {
                    id: current_user
                },
                dataType: 'json',
                async: false,
                success: function(results) {
    
                    const data = results["data"]
                    const returned_user = data.personnel['0'];
                    
                    $('#userSelectModalLabel').html(`${returned_user.firstName} ${returned_user.lastName}`);
                    $('#employeeid').val(returned_user.id);
                    $('#employeefirstName').val(returned_user.firstName);
                    $('#employeelastName').val(returned_user.lastName);
                    $('#employeeemail').val(returned_user.email);
                    $('#employeejobTitle').val(returned_user.jobTitle);
                    $('#employeedepartment').val(returned_user.department);
                    $('#employeelocation').val(returned_user.location);
                    $("#edit").attr("userID", returned_user.id);
    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
            // Delete User
       
            $('#deleteConfirm').html(`${$('#userSelectModalLabel').html()}<br>`);
          
            $(`#delUserConfirm`).on('click', event => {
                var userID = $('#employeeid').val();
               
                $.ajax({

                    type: 'POST',
                    url: "php/deleteUserByID.php",
                    data: {
                        id: userID,
                    },
                    dataType: 'json',
                    async: false,
                    success: function(results) {
                        getdata();
                       // location.reload();
                       
                    },
            
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                }) 
            })

})
})
        