<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];

$conn = mysqli_connect(
    "127.0.0.1",      // Host
    "u952592082_exercise_18",  // Username
    "Cybertech_18",    // Password
    "u952592082_cybertech_ex18"      // Database
);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Insert operation
    $species = $_POST['species'] ?? "";
    $class = $_POST['class'] ?? "";
    $name = $_POST['name'] ?? "";
    $age = $_POST['age'] ?? "";
    $habitat = $_POST['habitat'] ?? "";

    // Validate and sanitize input if needed

    $sql = "INSERT INTO animals (species, class, name, age, habitat) 
            VALUES ('$species', '$class', '$name', '$age', '$habitat')";

    if (mysqli_query($conn, $sql)) {
        $response = array("status" => "success", "message" => 
            "New record created successfully");
    } else {
        $response = array("status" => "error", "message" => "Error: " . $sql . 
            "<br>" . mysqli_error($conn));
    }

    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete operation
    parse_str(file_get_contents('php://input'), $_DELETE);
    $id = $_DELETE["id"] ?? "";
    $sql = "DELETE FROM animals WHERE id=${id}";

    if (!mysqli_query($conn, $sql)) {
        $response = array("status" => "error", "message" => 
            "Error: " . $sql . "<br>" . mysqli_error($conn));
    } else {
        $response = array("status" => "success", "message" => 
            "Deleted successfully!");
    }

    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    // Update operation
    parse_str(file_get_contents('php://input'), $_PATCH);
    $dataUserId = $_PATCH["id"] ?? "";
    $dataSpecies = $_PATCH["species"] ?? "";
    $dataClass = $_PATCH["class"] ?? "";
    $dataName = $_PATCH["name"] ?? "";
    $dataAge = $_PATCH["age"] ?? "";
    $dataHabitat = $_PATCH["habitat"] ?? "";

    $dataUserId = mysqli_real_escape_string($conn, $dataUserId);
    $dataSpecies = mysqli_real_escape_string($conn, $dataSpecies);
    $dataClass = mysqli_real_escape_string($conn, $dataClass);
    $dataName = mysqli_real_escape_string($conn, $dataName);
    $dataAge = mysqli_real_escape_string($conn, $dataAge);
    $dataHabitat = mysqli_real_escape_string($conn, $dataHabitat);

    $sql = "UPDATE animals
            SET species='${dataSpecies}', class='${dataClass}', 
                name='${dataName}', age='${dataAge}', habitat='${dataHabitat}'
            WHERE id=${dataUserId}";

    if (!mysqli_query($conn, $sql)) {
        $response = array("status" => 
            "error", "message" => 
            "Error: " . $sql . "<br>" . mysqli_error($conn));
    } else {
        $response = array("status" => "success", "message" => 
            "Updated successfully");
    }

    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Select operation
    $sql = "SELECT id, species, class, name, age, habitat FROM animals";
    $result = mysqli_query($conn, $sql);
    $response = [];

    while ($row = mysqli_fetch_assoc($result)) {
        array_push($response, array(
            'id' => $row["id"],
            'species' => $row["species"],
            'class' => $row["class"],
            'name' => $row["name"],
            'age' => $row["age"],
            'habitat' => $row["habitat"]
        ));
    }

    echo json_encode($response);
} else {
    $response = array("status" => "error", "message" => 
        "Invalid request method");
    echo json_encode($response);
}

mysqli_close($conn);
?>
