<?php

header("Content-Type: application/json"); 
header("Access-Control-Allow-Origin: *"); //  a CORS hiba ellen!!!?
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Adatbázis kapcsolat betöltése
require "db.php"; 

// A kérés típusának lekérdezése 
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Read
        try {
            $stmt = $pdo->query("SELECT * FROM MOZI"); // Mozi lekérés
            $readData = $stmt->fetchAll();
            echo json_encode(['status' => 'Sikeres lekérdezés!', "data" => $readData]); 
        } catch(PDOException $e) {
            echo json_encode(['status' => 'Hiba!', 'error' => $e->getMessage()]);
        }
        break;

    case 'POST': // Create
        try {
            $data = json_decode(file_get_contents("php://input"), true); // JSON adatok beolvasása 
            $stmt = $pdo->prepare("INSERT INTO MOZI (id, nev, varos, ferohely) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['id'], $data['nev'], $data['varos'], $data['ferohely']]); 
            echo json_encode(['status' => 'Mozi sikeresen hozzáadva!']); 
        } catch(PDOException $e) {
            echo json_encode(['status' => 'Hiba!', 'error' => $e->getMessage()]);
        }
        break;

    case 'PUT': // Update
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE MOZI SET nev=?, varos=?, ferohely=? WHERE id=?");
            $stmt->execute([$data['nev'], $data['varos'], $data['ferohely'], $data['id']]); 
            echo json_encode(['status' => 'Sikeres módosítás!']); 
        } catch(PDOException $e) {
            echo json_encode(['status' => 'Hiba!', 'error' => $e->getMessage()]);
        }
        break;

    case 'DELETE': //Delete
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("DELETE FROM MOZI WHERE id=?");
            $stmt->execute([$data['id']]); 
            echo json_encode(['status' => 'Mozi törölve!']); 
        } catch(PDOException $e) {
            echo json_encode(['status' => 'Hiba!', 'error' => $e->getMessage()]);
        }
        break;
}
?>