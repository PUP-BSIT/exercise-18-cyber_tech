<?php

header("Access-Control-Allow-Origin: https://cybertech-exercise18.netlify.app/");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$servername = "127.0.0.1:3306";
$username = "u952592082_exercise_18";
$password = "Cybertech_18";
$db = " u952592082_cybertech_ex18";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    $error_message = "Connection failed: " . $conn->connect_error;
    http_response_code(500);
    echo json_encode(array("error" => $error_message));
    exit();
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        $result = $conn->
            query("SELECT id, title, artist, release_year, genre FROM songs");

        if ($result === false) {
            $error_message = "Error: " . $conn->error;
            http_response_code(500);
            echo json_encode(array("error" => $error_message));
            exit();
        }

        $songs = array();

        while ($row = $result->fetch_assoc()) {
            $songs[] = $row;
        }

        echo json_encode($songs);
        break;

    case 'POST':
        $title = $_POST['title'];
        $artist = $_POST['artist'];
        $releaseYear = $_POST['release_year'];
        $genre = $_POST['genre'];

        $sql = "INSERT INTO songs (title, artist, release_year, genre) 
            VALUES ('$title', '$artist', '$releaseYear', '$genre')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Song added successfully"));
        } else {
            $error_message = "Error: " . $conn->error;
            http_response_code(500);
            echo json_encode(array("error" => $error_message));
        }
        break;

    case 'PATCH':
        parse_str(file_get_contents("php://input"), $patchVars);

        $id = $patchVars['id'];
        $title = $patchVars['title'];
        $artist = $patchVars['artist'];
        $releaseYear = $patchVars['release_year'];
        $genre = $patchVars['genre'];

        // Check if the ID is provided
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(array("error" => 
                "ID is required for updating a song"));
            exit();
        }

        // Check if the song with the given ID exists
        $checkExistenceQuery = "SELECT * FROM songs WHERE id = $id";
        $existenceResult = $conn->query($checkExistenceQuery);

        if ($existenceResult->num_rows == 0) {
            http_response_code(404);
            echo json_encode(array("error" => "Song with ID $id not found"));
            exit();
        }

        $updateQuery = 
        "UPDATE songs 
        SET title='$title', 
            artist='$artist', 
            release_year='$releaseYear', 
            genre='$genre' 
        WHERE id=$id";

        if ($conn->query($updateQuery) === TRUE) {
            echo json_encode(array("message" => "Song updated successfully"));
        } else {
            $error_message = "Error: " . $conn->error;
            http_response_code(500);
            echo json_encode(array("error" => $error_message));
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $deleteVars);

        $id = $deleteVars['id'];

        $sql = "DELETE FROM songs WHERE id=$id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Song deleted successfully"));
        } else {
            $error_message = "Error: " . $conn->error;
            http_response_code(500);
            echo json_encode(array("error" => $error_message));
        }
        break;

    default:
        // Invalid request method
        http_response_code(405);
        echo json_encode(array("error" => "Method Not Allowed"));
        break;
}

$conn->close();
?>
