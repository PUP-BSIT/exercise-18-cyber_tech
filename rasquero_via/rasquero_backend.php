<?php

header("Access-Control-Allow-Origin: https://cybertech-exercise18.netlify.app/");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "127.0.0.1:3306";
$username = "u952592082_exercise_18";
$password = "Cybertech_18";
$dbname = "u952592082_cybertech_ex18";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = 
        isset($_POST["name"]) 
        ? $_POST["name"] 
        : '';
    $location = 
        isset($_POST["location"]) 
        ? $_POST["location"] 
        : '';
    $description = 
        isset($_POST["description"]) 
        ? $_POST["description"] 
        : '';
    $rating = 
        isset($_POST["rating"]) 
        ? $_POST["rating"] 
        : '';
    $popularAttractions = 
        isset($_POST["popularAttractions"]) 
        ? $_POST["popularAttractions"] 
        : '';

    $sql = "INSERT INTO travel_destinations 
            (name, location, description, rating, popular_attractions)
            VALUES ('$name', 
                    '$location', 
                    '$description', 
                    '$rating', 
                    '$popularAttractions')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Travel destination created successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Error creating travel destination: ' 
            . $conn->error
        ]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT * FROM travel_destinations";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $rows = array();

        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $rows]);
    } else {
        echo json_encode(['status' => 'success', 'data' => []]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] === "PATCH") {
    $input_data = json_decode(file_get_contents("php://input"), true);

    $id = 
        isset($input_data["id"]) 
        ? $input_data["id"] 
        : '';
    $name = 
        isset($input_data["name"]) 
        ? $input_data["name"] 
        : '';
    $location = 
        isset($input_data["location"]) 
        ? $input_data["location"] 
        : '';
    $description = 
        isset($input_data["description"]) 
        ? $input_data["description"] 
        : '';
    $rating = 
        isset($input_data["rating"]) 
        ? $input_data["rating"] 
        : '';
    $popularAttractions = 
        isset($input_data["popularAttractions"]) 
        ? $input_data["popularAttractions"] 
        : '';

    $stmt = $conn->prepare(
            "UPDATE travel_destinations
            SET name = ?, 
                location = ?, 
                description = ?, 
                rating = ?, 
                popular_attractions = ?
            WHERE id = ?"
    );
    
    $stmt->bind_param("sssssi", 
            $name, 
            $location, 
            $description, 
            $rating, 
            $popularAttractions, 
            $id
    );

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Travel destination updated successfully']);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Error updating travel destination: ' 
            . $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Invalid request method'
    ]);
}

$conn->close();
?>