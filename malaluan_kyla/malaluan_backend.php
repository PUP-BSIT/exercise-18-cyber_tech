<?php
header("Access-Control-Allow-Origin: https://cybertech-exercise18.netlify.app/");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$servername = "127.0.0.1:3306";
$username = "u952592082_exercise_18";
$password = "Cybertech_18";
$db = " u952592082_cybertech_ex18";

$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method === 'GET') {
    $sql = "SELECT * FROM idols_list";
    $result = $conn->query($sql);

    if ($result) {
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        echo json_encode($rows);
    } else {
        echo json_encode(["error" => "Failed to fetch data"]);
    }
} elseif ($request_method === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $name = $data['name'];
    $group_name = $data['group_name'];
    $birthdate = $data['birthdate'];
    $position = $data['position'];

    $sql = "UPDATE idols_list SET name='$name', group_name='$group_name',
            birthdate='$birthdate', position='$position' WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "KPOP Idol updated successfully"]);
    } else {
        echo json_encode(["error" =>
            "Error updating record: " . $conn->error]);
    }
} elseif ($request_method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $sql = "DELETE FROM idols_list WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "KPOP Idol deleted successfully"]);
    } else {
        echo json_encode(["error" =>
            "Error deleting record: " . $conn->error]);
    }
} elseif ($request_method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'];
    $group_name = $data['group_name'];
    $birthdate = $data['birthdate'];
    $position = $data['position'];

    $sql = "INSERT INTO idols_list (name, group_name, birthdate, position) 
            VALUES ('$name', '$group_name', '$birthdate', '$position')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "KPOP Idol added successfully"]);
    } else {
        echo json_encode(["error" => "Error adding idol: " . $conn->error]);
    }
}

$conn->close();
?>