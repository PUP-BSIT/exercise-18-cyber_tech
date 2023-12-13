<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

    $conn = mysqli_connect(
        "127.0.0.1:3306", 
        "u952592082_exercise_18", 
        "Cybertech_18", 
        "u952592082_cybertech_ex18"
    );
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $sql = "SELECT * FROM food_items";
        $result = mysqli_query($conn, $sql);

        $food_items = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $food_items[] = $row;
        }

        echo json_encode($food_items);
    } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
        $name = $_POST["name"];
        $category = $_POST["category"];
        $description = $_POST["description"];
        $price = $_POST["price"];
        $availability = $_POST["availability"];

        $sql = "INSERT INTO food_items (
            name, 
            category, 
            description, 
            price, 
            availability) 
                VALUES (
                    '$name', 
                    '$category', 
                    '$description', 
                    $price, 
                    '$availability'
        )";
        
        if (!mysqli_query($conn, $sql)) {
            echo json_encode([
                "error" => "Error adding food: " . mysqli_error($conn)
            ]);
            return;
        }
        echo json_encode(["message" => "Food added successfully"]);
        
    } elseif ($_SERVER["REQUEST_METHOD"] === "PATCH") {
        parse_str(file_get_contents("php://input"), $_PATCH);
        $id = $_PATCH["id"] ?? "";
        $name = $_PATCH["name"] ?? "";
        $category = $_PATCH["category"] ?? "";
        $description = $_PATCH["description"] ?? "";
        $price = $_PATCH["price"] ?? "";
        $availability = $_PATCH["availability"] ?? "";

        $sql = "UPDATE food_items SET
            name='$name',
            category='$category',
            description='$description',
            price=$price,
            availability='$availability'
            WHERE id=$id";

        if (!mysqli_query($conn, $sql)) {
            echo json_encode([
                "error" => "Error updating food: " . mysqli_error($conn)
            ]);
            return;
        }

        echo json_encode(["message" => "Food updated successfully"]);

    } elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE["id"] ?? "";

        $sql = "DELETE FROM food_items WHERE id=$id";
        if (mysqli_query($conn, $sql)) {
            echo json_encode(["message" => "Food deleted successfully"]);
        } else {
            echo json_encode([
                "error" => "Error deleting food: " . mysqli_error($conn)
            ]);
        }
    }

    mysqli_close($conn);
?>