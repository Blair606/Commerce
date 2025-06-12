<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../../config/database.php';

try {
    $db = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']}",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    // Get query parameters
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 12;

    // Build query
    $query = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if ($category) {
        $query .= " AND category = :category";
        $params[':category'] = $category;
    }

    if ($search) {
        $query .= " AND (name LIKE :search OR description LIKE :search)";
        $params[':search'] = "%$search%";
    }

    // Add sorting
    switch ($sort) {
        case 'price_asc':
            $query .= " ORDER BY price ASC";
            break;
        case 'price_desc':
            $query .= " ORDER BY price DESC";
            break;
        case 'newest':
        default:
            $query .= " ORDER BY created_at DESC";
            break;
    }

    // Get total count for pagination
    $countQuery = str_replace("SELECT *", "SELECT COUNT(*)", $query);
    $stmt = $db->prepare($countQuery);
    $stmt->execute($params);
    $total = $stmt->fetchColumn();
    $totalPages = ceil($total / $perPage);

    // Add pagination
    $query .= " LIMIT :offset, :limit";
    $params[':offset'] = ($page - 1) * $perPage;
    $params[':limit'] = $perPage;

    // Execute query
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $products = $stmt->fetchAll();

    // Return response
    echo json_encode([
        'products' => $products,
        'pagination' => [
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'totalItems' => $total,
            'perPage' => $perPage,
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?> 