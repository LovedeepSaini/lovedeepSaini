let appState = "Employee";
const refreshPersonnel = () => {
        $.ajax({
            url: "libs/php/getAll.php",
            type: "POST",
            dataType: "json",
            success: function (e) {
                const t = e.data;
                updateEmployeeTable(t)
            },
            error: function (e, t, a) {
                console.log("Error getAll.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    refreshDepartments = () => {
        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "POST",
            dataType: "json",
            success: function (e) {
                const t = e.data;
                populateDepartmentSelects(t), updateDepartmentTable(t)
            },
            error: function (e, t, a) {
                console.log("Error getAllDepartments.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    refreshLocations = () => {
        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "POST",
            dataType: "json",
            success: function (e) {
                const t = e.data;
                populateLocationSelects(t), updateLocationTable(t)
            },
            error: function (e, t, a) {
                console.log("Error getAllLocations.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    populateDepartmentSelects = (e, t) => {
        const a = t ? $(t) : $(".departmentSelect");
        a.each(function () {
            const t = $(this);
            t.empty(), id = t.attr("id"), "addEmployeeDepartment" == id ? t.append('<option value="">Select Department</option>') : "searchDepartmentSelect" == id && t.append('<option value="">All Departments</option>'), e.forEach(e => {
                t.append(`<option value="${e.id}">${e.name}</option>`)
            })
        })
    },
    populateLocationSelects = e => {
        const t = $(".locationSelect");
        t.each(function () {
            const t = $(this);
            t.empty(), id = t.attr("id");
            const a = "searchLocationSelect" == id ? "All Locations" : "addEmployeeLocation" == id ? "" : "Select Location";
            "editDepartmentLocation" != id && t.append(`<option value="">${a}</option>`), e.forEach(e => {
                t.append(`<option value="${e.id}">${e.name}</option>`)
            })
        })
    };
$(".departmentSelect").change(function () {
    const e = $(this).val(),
        t = $(this).attr("id"),
        a = "searchDepartmentSelect" == t ? $("#searchLocationSelect") : "addEmployeeDepartment" == t ? $("#addEmployeeLocation") : $("#editEmployeeLocation");
    $.ajax({
        url: "libs/php/getLocationByDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            id: e
        },
        success: function (e) {
            a.val(e.data.locationID)
        },
        error: function (e, t, a) {
            console.log("Error getLocationByDepartment.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
        }
    })
}), $("#searchLocationSelect").change(function () {
    const e = $(this).val();
    $.ajax({
        url: "libs/php/getDepartmentsByLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            id: e
        },
        success: function (e) {
            const t = e.data;
            populateDepartmentSelects(t, "#searchDepartmentSelect")
        },
        error: function (e, t, a) {
            console.log("Error getLocationsByDepartment.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
        }
    })
}), $("#searchButton").click(function () {
    clearFeedback(), $("#searchEmployeeForm").trigger("reset"), $("#searchEmployee").modal("toggle")
}), $("#searchEmployeeForm").submit(function () {
    const e = $("#searchFirstName").val(),
        t = $("#searchLastName").val(),
        a = $("#searchDepartmentSelect").val(),
        o = $("#searchLocationSelect").val();
    return $.ajax({
        url: "libs/php/getPersonnelByMultiple.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: e,
            lastName: t,
            departmentId: a,
            locationId: o
        },
        success: function (e) {
            const t = e.data;
            if (t.length > 0) updateEmployeeTable(e.data), $("#searchEmployee").modal("toggle"), $("#searchEmployeeForm").trigger("reset");
            else {
                const e = {
                    id: "#searchEmployeeFeedback",
                    type: "danger",
                    message: "No results returned, please refine the search criteria."
                };
                displayFeedback(e)
            }
        },
        error: function (e, t, a) {
            console.log("Error getPersonnelByMultiple.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
        }
    }), !1
});
const updateEmployeeTable = e => {
        let t = "";
        e.forEach(e => {
            const a = getEmployeeRow(e);
            t += a
        }), $("#searchResultsData").html(t)
    },
    getEmployeeRow = e => {
        const t = `<td>${e.firstName} ${e.lastName}</td>`,
            a = `<td class="d-none d-lg-table-cell">${e.jobTitle}</td>`,
            o = `<td class="d-none d-lg-table-cell">${e.email}</td>`,
            n = `<td>${e.department}</td>`,
            l = `<td class="d-none d-md-table-cell">${e.location}</td>`,
            s = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteEmployeeBtn" data-employee-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
        return `<tr class="employeeRow" data-employee-id="${e.id}">${t}${a}${o}${n}${l}${s}</tr>`
    },
    updateDepartmentTable = e => {
        let t = "";
        e.forEach(e => {
            const a = getDepartmentRow(e);
            t += a
        }), $("#departmentResultsData").html(t)
    },
    getDepartmentRow = e => {
        const t = `<td>${e.name}</td>`,
            a = `<td>${e.location}</td>`,
            o = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteDepartmentBtn" data-department-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
        return `<tr class="departmentRow" data-department-id="${e.id}">${t}${a}${o}</tr>`
    },
    updateLocationTable = e => {
        let t = "";
        e.forEach(e => {
            const a = getLocationRow(e);
            t += a
        }), $("#locationResultsData").html(t)
    },
    getLocationRow = e => {
        const t = `<td>${e.name}</td>`,
            a = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteLocationBtn" data-location-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
        return `<tr class="locationRow" data-location-id="${e.id}">${t}${a}</tr>`
    };
$("#addButton").click(function () {
    clearFeedback(), $("#addEmployeeForm").trigger("reset"), $("#addDepartmentForm").trigger("reset"), $("#addLocationForm").trigger("reset"), "Employee" == appState ? $("#addEmployee").modal("toggle") : "Department" == appState ? $("#addDepartment").modal("toggle") : "Location" == appState && $("#addLocation").modal("toggle")
}), $("#addEmployeeForm").submit(function () {
    const e = {
        firstName: $("#addEmployeeFirstName").val(),
        lastName: $("#addEmployeeLastName").val(),
        jobTitle: $("#addEmployeeJobTitle").val(),
        email: $("#addEmployeeEmail").val(),
        departmentId: $("#addEmployeeDepartment").val()
    };
    return validateNewEmployee(e), !1
}), $("#addDepartmentForm").submit(function () {
    const e = {
        departmentName: $("#departmentName").val(),
        locationID: $("#locationSelectForAddDept").val()
    };
    return validateNewDepartment(e), !1
}), $("#addLocationForm").submit(function () {
    const e = {
        locationName: $("#addLocationName").val()
    };
    return validateNewLocation(e), !1
});
const validateNewEmployee = e => {
        if ("" == e.firstName) {
            const e = {
                id: "#addEmployeeFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter a first name."
            };
            displayFeedback(e)
        } else if ("" == e.lastName) {
            const e = {
                id: "#addEmployeeFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter a last name."
            };
            displayFeedback(e)
        } else if ("" == e.departmentId) {
            const e = {
                id: "#addEmployeeFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter a department."
            };
            displayFeedback(e)
        } else if ("" == e.jobTitle) {
            const e = {
                id: "#addEmployeeFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter a job title."
            };
            displayFeedback(e)
        } else if ("" == e.email) {
            const e = {
                id: "#addEmployeeFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter an email."
            };
            displayFeedback(e)
        } else $.ajax({
            url: "libs/php/getPersonnelByName.php",
            type: "POST",
            dataType: "json",
            data: {
                firstName: e.firstName,
                lastName: e.lastName,
                id: 0
            },
            success: function (t) {
                const a = `${e.firstName} ${e.lastName}`;
                if (0 == t.data.pc) $("#addEmployee").modal("toggle"), showConfirmCreateModal(a, e, "employee");
                else {
                    const e = {
                        id: "#addEmployeeFeedback",
                        type: "danger",
                        message: `Submit unsuccessful.<br> An employee called ${a} already exists on the database.`
                    };
                    displayFeedback(e), $("#addEmployeeModalBody").scrollTop()
                }
            },
            error: function (e, t, a) {
                console.log("Error getPersonnelByName.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    validateNewDepartment = e => {
        if ("" == e.departmentName) {
            const e = {
                id: "#addDepartmentFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter a department name."
            };
            displayFeedback(e)
        } else if ("" == e.locationID) {
            const e = {
                id: "#addDepartmentFeedback",
                type: "danger",
                message: "Update unsuccessful. Please enter a location."
            };
            displayFeedback(e)
        } else $.ajax({
            url: "libs/php/getDepartmentByName.php",
            type: "POST",
            dataType: "json",
            data: {
                departmentName: e.departmentName,
                locationID: e.locationID,
                id: 0
            },
            success: function (t) {
                const a = e.departmentName;
                if (0 == t.data.dc) $("#addDepartment").modal("toggle"), showConfirmCreateModal(a, e, "department");
                else {
                    const e = {
                        id: "#addDepartmentFeedback",
                        type: "danger",
                        message: `Update unsuccessful.<br> ${a} already exists on the database.`
                    };
                    displayFeedback(e)
                }
            },
            error: function (e, t, a) {
                console.log("Error libs/php/getDepartmentByName.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    validateNewLocation = e => {
        "" == e.locationName ? (feedback = {
            id: "#addLocationFeedback",
            type: "danger",
            message: "Update unsuccessful. Please enter the name of a location."
        }, displayFeedback(feedback)) : $.ajax({
            url: "libs/php/getLocationByName.php",
            type: "POST",
            dataType: "json",
            data: {
                locationName: e.locationName,
                id: 0
            },
            success: function (t) {
                const a = e.locationName;
                0 == t.data.lc ? ($("#addLocation").modal("toggle"), showConfirmCreateModal(a, a, "location")) : (feedback = {
                    id: "#addLocationFeedback",
                    type: "danger",
                    message: `Update unsuccessful.<br> ${a} already exists on the database.`
                }, displayFeedback(feedback))
            },
            error: function (e, t, a) {
                console.log("Error getLocationByName.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    showConfirmCreateModal = (e, t, a) => {
        clearFeedback(), $("#confirmCreateButton").data("creation-type", a), $("#confirmCreateButton").data("new-item", t), $("#confirmCreateName").text(e), $("#confirmCreate").modal("toggle")
    };
$("#confirmCreateButton").click(function () {
    const e = $("#confirmCreateButton").data("new-item"),
        t = $("#confirmCreateButton").data("creation-type");
    $("#confirmCreate").modal("toggle"), "employee" == t ? insertEmployee(e) : "department" == t ? insertDepartment(e) : "location" == t && insertLocation(e)
});
const insertEmployee = e => {
        $.ajax({
            url: "libs/php/insertPersonnel.php",
            type: "POST",
            dataType: "json",
            data: e,
            success: function (t) {
                const a = {
                    title: "Addition Success",
                    type: "success",
                    message: `Successfully added ${e.firstName} ${e.lastName}`
                };
                $("#personnelSearch").trigger("reset"), $("#addEmployeeForm").trigger("reset"), displayFeedbackModal(a), refreshPersonnel()
            },
            error: function (e, t, a) {
                console.log("Error insertPersonnel.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    insertDepartment = e => {
        $.ajax({
            url: "libs/php/insertDepartment.php",
            type: "POST",
            dataType: "json",
            data: e,
            success: function (t) {
                const a = {
                    title: "Addition Successful",
                    type: "success",
                    message: `Successfully added ${e.departmentName}`
                };
                $("#addDepartmentForm").trigger("reset"), displayFeedbackModal(a), refreshDepartments()
            },
            error: function (e, t, a) {
                console.log("Error insertDepartment.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    insertLocation = e => {
        $.ajax({
            url: "libs/php/insertLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                locationName: e
            },
            success: function (t) {
                feedback = {
                    title: "Addition Successful",
                    type: "success",
                    message: `Successfully added ${e}`
                }, $("#addLocationForm").trigger("reset"), displayFeedbackModal(feedback), refreshLocations()
            },
            error: function (e, t, a) {
                console.log("Error insertLocation.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    };
$("body").on("click", ".employeeRow", function () {
    clearFeedback();
    const e = $(this),
        t = e[0].dataset.employeeId;
    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: t
        },
        success: function (e) {
            const t = e.data[0];
            $("#editEmployeeFirstNameLabel").text(t.firstName), $("#editEmployeeLastNameLabel").text(t.lastName), $("#editEmployeeOrigDeptId").val(t.departmentID), $("#editEmployeeOrigLocId").val(t.locationID), $("#editEmployeeOrigJob").val(t.jobTitle), $("#editEmployeeOrigEmail").val(t.email), $("#editEmployeeId").val(t.id), $("#editEmployeeFirstName").val(t.firstName), $("#editEmployeeLastName").val(t.lastName), $("#editEmployeeDepartment").val(t.departmentID), $("#editEmployeeLocation").val(t.locationID), $("#editEmployeeJobTitle").val(t.jobTitle), $("#editEmployeeEmail").val(t.email), $("#editEmployee").modal("toggle")
        },
        error: function (e, t, a) {
            console.log("Error getPersonnelByID.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
        }
    })
}), $("body").on("click", ".departmentRow", function () {
    clearFeedback();
    const e = $(this),
        t = e[0].dataset.departmentId;
    $.ajax({
        url: "libs/php/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: t
        },
        success: function (e) {
            const t = e.data[0];
            $("#editDepartmentLabel").text(t.name), $("#editDepartmentName").val(t.name), $("#editDepartmentOrigLocation").val(t.locationID), $("#editDepartmentLocation").val(t.locationID), $("#editDepartmentId").val(t.id), $("#editDepartment").modal("toggle")
        },
        error: function (e, t, a) {
            console.log("Error getDepartmentByID.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
        }
    })
}), $("body").on("click", ".locationRow", function () {
    clearFeedback();
    const e = $(this),
        t = e[0].dataset.locationId;
    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: t
        },
        success: function (e) {
            const a = e.data;
            $("#editLocationLabel").text(a.name), $("#editLocationName").val(a.name), $("#editLocationId").val(t), $("#editLocation").modal("toggle")
        },
        error: function (e, t, a) {
            console.log("Error getLocationByID.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
        }
    })
}), $("#editEmployeeForm").submit(function () {
    const e = {
        firstName: $("#editEmployeeFirstName").val(),
        lastName: $("#editEmployeeLastName").val(),
        jobTitle: $("#editEmployeeJobTitle").val(),
        email: $("#editEmployeeEmail").val(),
        departmentId: $("#editEmployeeDepartment").val(),
        id: $("#editEmployeeId").val()
    };
    return validateEmployeeUpdate(e), !1
}), $("#editDepartmentForm").submit(function () {
    const e = {
        name: $("#editDepartmentName").val(),
        locationID: $("#editDepartmentLocation").val(),
        id: $("#editDepartmentId").val()
    };
    return validateDepartmentUpdate(e), !1
}), $("#editLocationForm").submit(function () {
    const e = {
        name: $("#editLocationName").val(),
        id: $("#editLocationId").val()
    };
    return validateLocationUpdate(e), !1
});
const validateEmployeeUpdate = e => {
        if ("" == e.firstName) {
            const e = {
                id: $("#editEmployeeFeedback"),
                type: "danger",
                message: "Please enter a First Name."
            };
            displayFeedback(e)
        } else if ("" == e.lastName) {
            const e = {
                id: $("#editEmployeeFeedback"),
                type: "danger",
                message: "Please enter a Last Name."
            };
            displayFeedback(e)
        } else if ("" == e.jobTitle) {
            const e = {
                id: $("#editEmployeeFeedback"),
                type: "danger",
                message: "Please enter a Job Title."
            };
            displayFeedback(e)
        } else if ("" == e.email) {
            const e = {
                id: $("#editEmployeeFeedback"),
                type: "danger",
                message: "Please enter a Email."
            };
            displayFeedback(e)
        } else $.ajax({
            url: "libs/php/getPersonnelByName.php",
            type: "POST",
            dataType: "json",
            data: {
                firstName: e.firstName,
                lastName: e.lastName,
                id: e.id
            },
            success: function (t) {
                const a = `${e.firstName} ${e.lastName}`;
                if (0 == t.data.pc) {
                    e.originalFirstName, e.originalLastName;
                    $("#editEmployee").modal("toggle"), showConfirmUpdateModal(a, e, "employee")
                } else {
                    const e = {
                        id: "#editEmployeeFeedback",
                        type: "danger",
                        message: `Unsuccessful update.<br>There is already an employee with the name ${a}.`
                    };
                    displayFeedback(e)
                }
            },
            error: function (e, t, a) {
                console.log("Error getPersonnelByName.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    validateDepartmentUpdate = e => {
        if ("" == location.name) {
            const e = {
                id: $("#editDepartmentFeedback"),
                type: "danger",
                message: "Please enter a new name."
            };
            displayFeedback(e)
        } else $.ajax({
            url: "libs/php/getDepartmentByName.php",
            type: "POST",
            dataType: "json",
            data: {
                departmentName: e.name,
                id: e.id
            },
            success: function (t) {
                if (0 == t.data.dc) $("#editDepartment").modal("toggle"), showConfirmUpdateModal(e.name, e, "department");
                else {
                    const t = {
                        id: "#editDepartmentFeedback",
                        type: "danger",
                        message: `Update unsuccessful.<br>There is already a department called ${e.name}.`
                    };
                    displayFeedback(t)
                }
            },
            error: function (e, t, a) {
                console.log("Error getDepartmentByName.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    validateLocationUpdate = e => {
        if ("" == e.name) {
            const e = {
                id: $("#editLocationFeedback"),
                type: "danger",
                message: "Please enter a new name."
            };
            displayFeedback(e)
        } else $.ajax({
            url: "libs/php/getLocationByName.php",
            type: "POST",
            dataType: "json",
            data: {
                locationName: e.name,
                id: e.id
            },
            success: function (t) {
                if (0 == t.data.lc) $("#editLocation").modal("toggle"), showConfirmUpdateModal(e.name, e, "location");
                else {
                    const t = {
                        id: $("#editLocationFeedback"),
                        type: "danger",
                        message: `Update unsuccessful.<br>There is already a location called ${e.name}.`
                    };
                    displayFeedback(t)
                }
            },
            error: function (e, t, a) {
                console.log("Error getLocationByName.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    showConfirmUpdateModal = (e, t, a) => {
        clearFeedback(), $("#confirmUpdateButton").data("update-type", a), $("#confirmUpdateButton").data("update-item", t), $("#confirmUpdateName").text(e), $("#confirmUpdate").modal("toggle")
    };
$("#confirmUpdateButton").click(function () {
    const e = $("#confirmUpdateButton").data("update-item"),
        t = $("#confirmUpdateButton").data("update-type");
    $("#confirmUpdate").modal("toggle"), "employee" == t ? updateEmployee(e) : "department" == t ? updateDepartment(e) : "location" == t && updateLocation(e)
});
const updateEmployee = e => {
        $.ajax({
            url: "libs/php/updatePersonnel.php",
            type: "POST",
            dataType: "json",
            data: e,
            success: function (e) {
                const t = {
                    title: "Successful Update",
                    type: "success",
                    message: "Successfully updated employee."
                };
                $("#personnelSearch").trigger("reset"), displayFeedbackModal(t), refreshPersonnel()
            },
            error: function (e, t, a) {
                console.log("Error updatePersonnel.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    updateDepartment = e => {
        $.ajax({
            url: "libs/php/updateDepartment.php",
            type: "POST",
            dataType: "json",
            data: e,
            success: function (e) {
                const t = {
                    title: "Sucessful Update",
                    type: "success",
                    message: "Successfully updated department."
                };
                displayFeedbackModal(t), refreshPersonnel(), refreshDepartments()
            },
            error: function (e, t, a) {
                console.log("Error updateDepartment.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    updateLocation = e => {
        $.ajax({
            url: "libs/php/updateLocation.php",
            type: "POST",
            dataType: "json",
            data: e,
            success: function (t) {
                const a = {
                    title: "Successful Update",
                    type: "success",
                    message: `Successfully updated ${e.name}.`
                };
                displayFeedbackModal(a), refreshPersonnel(), refreshDepartments(), refreshLocations()
            },
            error: function (e, t, a) {
                console.log("Error updateLocation.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    };
$("body").on("click", ".deleteEmployeeBtn", function (e) {
    e.stopPropagation();
    const t = $(this),
        a = t[0].dataset.employeeId;
    showConfirmDeletionModal(a, "this employee", "employee")
}), $("body").on("click", ".deleteDepartmentBtn", function (e) {
    e.stopPropagation();
    const t = $(this),
        a = t[0].dataset.departmentId;
    showConfirmDeletionModal(a, "this department", "department")
}), $("body").on("click", ".deleteLocationBtn", function (e) {
    e.stopPropagation();
    const t = $(this),
        a = t[0].dataset.locationId;
    showConfirmDeletionModal(a, "this location", "location")
});
const showConfirmDeletionModal = (e, t, a) => {
    $("#confirmDeletionButton").data("deletion-type", a), $("#confirmDeletionButton").val(e), $("#confirmDeletionName").text(t), $("#confirmDeletion").modal("toggle")
};
$("#confirmDeletionButton").click(function () {
    const e = $("#confirmDeletionButton").val(),
        t = $("#confirmDeletionButton").data("deletion-type");
    "employee" == t ? deleteEmployee(e) : "department" == t ? validateDeleteDepartment(e) : "location" == t && validateDeleteLocation(e)
});
const validateDeleteDepartment = e => {
        $.ajax({
            url: "libs/php/getPersonnelByDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                id: e
            },
            success: function (t) {
                if (0 == t.data.pc) deleteDepartment(e);
                else {
                    const e = {
                        title: "Deletion Unsuccessful",
                        type: "danger",
                        message: "Deletion unsuccessful. Please remove all employees from this department before deleting."
                    };
                    displayFeedbackModal(e)
                }
            },
            error: function (e, t, a) {
                console.log("Error getPersonnelByDepartment.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    validateDeleteLocation = e => {
        $.ajax({
            url: "libs/php/getDepartmentCountByLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                id: e
            },
            success: function (t) {
                if (0 == t.data.dc) deleteLocation(e);
                else {
                    const e = {
                        title: "Deletion Unsuccessful",
                        type: "danger",
                        message: "Deletion unsuccessful. Please remove all departments from this location before deleting."
                    };
                    displayFeedbackModal(e)
                }
            },
            error: function (e, t, a) {
                console.log("Error getDepartmentsByLocation.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    deleteEmployee = e => {
        $.ajax({
            url: "libs/php/deletePersonnel.php",
            type: "POST",
            dataType: "json",
            data: {
                id: e
            },
            success: function (e) {
                const t = {
                    title: "Deletion Successful",
                    type: "success",
                    message: "Successfully deleted employee."
                };
                displayFeedbackModal(t), refreshPersonnel()
            },
            error: function (e, t, a) {
                console.log("Error deletePersonnel.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    deleteDepartment = e => {
        $.ajax({
            url: "libs/php/deleteDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: e
            },
            success: function (e) {
                const t = {
                    title: "Deletion Successful",
                    type: "success",
                    message: "Successfully deleted department."
                };
                displayFeedbackModal(t), refreshDepartments()
            },
            error: function (e, t, a) {
                console.log("Error deleteDepartmentByID.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    deleteLocation = e => {
        $.ajax({
            url: "libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: e
            },
            success: function (e) {
                const t = {
                    title: "Deletion Successful",
                    type: "success",
                    message: "Successfully deleted location."
                };
                displayFeedbackModal(t), refreshLocations()
            },
            error: function (e, t, a) {
                console.log("Error deleteLocationByID.php"), console.log(e.responseText), console.log(`${t} : ${a}`)
            }
        })
    },
    clearFeedback = () => {
        $(".feedbackMessage").empty()
    };
$("#navEmployee").click(function () {
    setActiveState("#employeeState")
}), $("#navDepartment").click(function () {
    setActiveState("#departmentState")
}), $("#navLocation").click(function () {
    setActiveState("#locationState")
});
const displayFeedbackModal = e => {
        $(".modal").modal("hide"), $("#feedbackModalTitle").text(e.title);
        const t = `<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
        $("#feedbackMessage").html(t), $("#feedbackModal").modal("show")
    },
    displayFeedback = e => {
        $("feedbackModalTitle").text = e.title;
        const t = `<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
        $(e.id).html(t)
    },
    setActiveNav = e => {
        $(".nav-link").removeClass("active"), e && $(e).addClass("active")
    },
    setActiveState = e => {
        clearFeedback();
        let t = "";
        $(".state").addClass("d-none"), $(e).removeClass("d-none"), "#employeeState" == e ? (t = "#navEmployee", $("#searchButton").removeClass("d-none"), appState = "Employee") : "#departmentState" == e ? (t = "#navDepartment", $("#searchButton").addClass("d-none"), appState = "Department") : "#locationState" == e && (t = "#navLocation", $("#searchButton").addClass("d-none"), appState = "Location"), setActiveNav(t)
    };
$(window).on("load", function () {
    $("#preloader").length && $("#preloader").delay(100).fadeOut("slow", function () {
        $(this).remove()
    })
});
const btn = $("#toTopButton");
btn.on("click", function (e) {
    e.preventDefault(), $("html, body").animate({
        scrollTop: 0
    }, "300")
}), refreshPersonnel(), refreshDepartments(), refreshLocations();