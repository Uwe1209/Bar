<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'bar');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

$email = $_POST['email'] ?? null;
if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email not provided']);
    exit;
}

if (isset($_FILES['img']) && $_FILES['img']['error'] === 0) {
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $imgName = time() . "_" . basename($_FILES['img']['name']);
    $uploadPath = $uploadDir . $imgName;

    if (move_uploaded_file($_FILES['img']['tmp_name'], $uploadPath)) {
        $stmt = $conn->prepare("UPDATE users SET img=? WHERE email=?");
        $stmt->bind_param("ss", $imgName, $email);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Image updated.', 'img' => $imgName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'DB update failed']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Upload failed']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No image uploaded']);
}

$conn->close();
