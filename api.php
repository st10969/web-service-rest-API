<?php

// Indica al client che la risposta è in formato JSON
header('Content-Type: application/json');

// CORS (Cross-Origin Resource Sharing):
// permette al browser di accettare risposte da un dominio
// diverso da quello da cui è stata caricata la pagina.
// '*' significa "accetta richieste da qualsiasi origine".
header('Access-Control-Allow-Origin: *');

// Elenca i metodi HTTP che questa API accetta
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Permette al client di inviare l'header Content-Type
// (necessario quando il corpo della richiesta è JSON)
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // 204 = successo senza corpo di risposta
    exit;
}


//LETTURA DEL METODO HTTP

$method = $_SERVER['REQUEST_METHOD'];

$videogiochi = [
    ["id" => 1, "titolo" => "Marvel's Spiderman 2",               "piattaforma" => "PS5"],
    ["id" => 2, "titolo" => "The Last of Us Part II",              "piattaforma" => "PS4"],
    ["id" => 3, "titolo" => "Uncharted 4 - La fine di un ladro",  "piattaforma" => "PS4"],
    ["id" => 4, "titolo" => "NBA 2K26",                            "piattaforma" => "PS5"],
    ["id" => 5, "titolo" => "Call Of Duty Black Ops 7",            "piattaforma" => "PS5"]
];

if ($method === 'GET') {
    echo json_encode($videogiochi);
} elseif ($method === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    if (!empty($input['titolo']) && !empty($input['piattaforma'])) {
        $nuovoGioco = [
            "id"          => count($videogiochi) + 1,
            "titolo"      => htmlspecialchars($input['titolo'],      ENT_QUOTES, 'UTF-8'),
            "piattaforma" => htmlspecialchars($input['piattaforma'], ENT_QUOTES, 'UTF-8')
        ];

        echo json_encode(["status" => "success", "item" => $nuovoGioco]);

    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Dati incompleti"]);
    }

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metodo non consentito"]);
}
?>