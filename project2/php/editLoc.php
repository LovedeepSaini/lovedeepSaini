<?php
    
    // Check that we have a value to use to add to databse
    if(isset($_POST['name'])){
    
        // Include the preset username, password etc. for database
        include("config.php");
    
        // Establish a statement to use in SQL where we are editing data in the table personnel
        $stmt = $conn->prepare("UPDATE location SET name = :name WHERE id = :id");
        // Use bind param to pass variable to use in the SQL statement 
        $stmt->bindParam(':name', ucwords(strtolower($_POST['name'])));
        $stmt->bindParam(':id', $_POST['id']);
        // Execute the statment
        $result = $stmt->execute();

        if (!$result) {

            $output['status']['code'] = "400";
            $output['status']['name'] = "executed";
            $output['status']['description'] = "query failed";	
            $output['data'] = [];
    
            mysqli_close($conn);
    
            echo json_encode($output); 
    
            exit;
    
        }
    
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        echo json_encode($output);
    }	 

?>