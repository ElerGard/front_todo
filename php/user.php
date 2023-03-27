<?php

$mysqli = new mysqli("127.0.0.1", "root", "admin", "TodoList");
if($mysqli->connect_error) {
    exit('Could not connect');
}

if ($_GET != null) {
    echo login($_GET, $mysqli);
}

if ($_POST != null) {
    echo createUser($_POST, $mysqli);
}

//TODO - change error messages(success => "error messages")

function createUser($data, $mysql)
{
    $user = "";

    if ($data == null) {
        return json_encode(array('success' => 0));

    }
    if (!isset($data['username'])) {
        return json_encode(array('success' => 0));

    }
    if (!isset($data['password'])) {
        return json_encode(array('success' => 0));

    }

    if ($data['username'] == null) {
        return json_encode(array('success' => 0));

    }
    if ($data['password'] == null) {
        return json_encode(array('success' => 0));

    }

    //TODO - change prepare statements
    $sql = "SELECT login from User WHERE login = '" . $data['username'] . "'";

    $stmt = $mysql->prepare($sql);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user);
    $stmt->fetch();
    $stmt->close();

    if ($user != null) {
        return json_encode(array('success' => 0));
        
    }

    //TODO - change prepare statements
    $sql = "INSERT Into User(login, password) VALUE ('" . $data['username'] . "','" . $data['password'] . "');";

    if ($mysql->query($sql) === TRUE) {
        return json_encode(array('success' => 1, 'user' => $data));
    } else {
        return json_encode(array('success' => 0));
    }
}

//TODO - change error messages(success => "error messages")

function login($data, $mysql)
{
    $user = [];

    if ($data == null) {
        return json_encode(array('success' => 0));
    }
    if (!isset($data['username'])) {
        return json_encode(array('success' => 0));
    }
    if (!isset($data['password'])) {
        return json_encode(array('success' => 0));
    }

    if ($data['username'] == null) {
        return json_encode(array('success' => 0));
    }
    if ($data['password'] == null) {
        return json_encode(array('success' => 0));
    }

    //TODO - change prepare statements
    $sql = "SELECT * from User WHERE login = '" . $data['username'] . "'AND password = '" . $data['password'] . "'";

    $stmt = $mysql->prepare($sql);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user['username'], $user['password']);
    $stmt->fetch();
    $stmt->close();

    if (($user['username'] == null) || ($user['password'] == null)) return json_encode(array('success' => 0));

    return json_encode(array('success' => 1, 'user' => $user));
}
?>