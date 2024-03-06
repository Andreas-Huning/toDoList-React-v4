<?php
                declare(strict_types=1);
                header("Access-Control-Allow-Origin: *");
                header("Access-Control-Allow-Methods: POST, OPTIONS"); // Erlaubt POST- und OPTIONS-Anfragen
                header("Access-Control-Allow-Headers: Content-Type"); // Erlaubt Content-Type Header
                

                #********** DATABASE CONFIGURATION **********#
				define('DB_SYSTEM',							'mysql');
				define('DB_HOST',							'localhost');
				define('DB_NAME',							'todo');
				define('DB_USER',							'root');
				define('DB_PWD',							'');


#*******************************************************************************************************#

                function dbConnect($dbname=DB_NAME) {
					// echo "Connecting to database";
					
					try {
						$PDO = new PDO(DB_SYSTEM . ":host=" . DB_HOST . "; dbname=$dbname; charset=utf8mb4", DB_USER, DB_PWD);				
					} catch(PDOException $error) {
                        // echo "dbConnect Fehler";
					}
					return $PDO;
				}


#*******************************************************************************************************#

                function sanitizeString( $value ){

					if($value !== Null){
						$value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, double_encode:false);
						$value = trim($value);	
						if( $value ==='' ){
							$value = NULL;
						}
					}
					return $value;				
				}


#*******************************************************************************************************#


                $post = file_get_contents('php://input');
                // echo "Received POST data: "; // Ausgabe der empfangenen POST-Daten
                // var_dump($post); // Ausgabe des POST-Inhalts mit var_dump()

                if ($post) {
                    $requestData = json_decode($post, true);
                
                    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
                        header("Content-Type: application/json");
                    }

                    // LOGIN
                    if ($requestData['action'] === 'LOGIN') {
                        $user = $requestData['user'];
                        // var_dump($user['user']);

                        $userEmail      = sanitizeString($user['user']['userEmail']);
                        $userPassword   = sanitizeString($user['user']['userPassword']);



                        $PDO = dbConnect();
                        $sql	=	"SELECT userId, userPassword FROM users 
									WHERE userEmail = :userEmail";                                            
                        $params 	= array('userEmail' => $userEmail); 
                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);

                            $userData = $PDOStatement -> fetch(PDO::FETCH_ASSOC);
                            // var_dump($userData);
                            if($userData === false) 
                            {
                                echo json_encode(array("message" => "Diese Logindaten sind ungültig"));
                            } else 
                            {
                                // passwort prüfen
                                if( password_verify( $userPassword, $userData['userPassword'] ) === false ){
                                    echo json_encode(array("message" => "Diese Logindaten (Passwort) sind ungültig"));
                                }else{

                                    $currentTimeStamp = time();
                                    $userId = $userData['userId'];
                                    $dataToHash = $currentTimeStamp . $userId;
                                    $userToken = hash('sha256', $dataToHash);

                                    $sql = "UPDATE users 
                                    SET userToken = :userToken
                                    WHERE userId = :userId";
                            
                                    $params = array(
                                        ':userToken' => $userToken,
                                        ':userId' => (int)$userId
                                    );
                                    try {
                                        $PDOStatement = $PDO->prepare($sql);
                                        $PDOStatement->execute($params);
                                        $rowCount = $PDOStatement->rowCount();
            
                                        if($rowCount !== 1) 
                                        {
                                            echo json_encode(array("message" => "Es wurden keine Daten geändert."));
                                        } else 
                                        {
                                            echo json_encode(array("userToken" => $userToken, "message" => "Diese Logindaten sind gültig, Token in DB gespeichert", "userEmail"=>$userEmail));
                                        }
                                    } catch(PDOException $error) 
                                    {
                                        echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                                    }
            
                                    unset($PDO, $PDOStatement); 

                                }
                            }
                        } catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }

                        unset($PDO, $PDOStatement);

                    }// LOGIN END

                    // Hinzufügen eines Datensatzes
                    if ($requestData['action'] === 'ADD') 
                    {                        

                        $toDo = $requestData['toDo'];
                        $userToken = $toDo['userToken'];
                        $toDoListName = sanitizeString($toDo['toDo']['toDoListName']);
                        $toDoListStatus = $toDo['toDo']['toDoListStatus'];
                        $toDoListDate = sanitizeString($toDo['toDo']['toDoListDate']);
                        $catId = (int)$toDo['toDo']['toDoListCat'];;
                        $sqlDateTime = null;

                        $PDO = dbConnect();
                        $sql	=	"SELECT userId FROM users 
									WHERE userToken = :userToken";                                            
                        $params 	= array('userToken' => $userToken); 
                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);

                            $userData = $PDOStatement -> fetch(PDO::FETCH_ASSOC);
                            
                            if($userData === false) 
                            {
                                echo json_encode(array("message" => "Es ist ein fehler beim Auslesen des Benutzers aufgetreten"));
                            } else 
                            {
                                $userId = $userData['userId'];
                                if($toDoListDate) 
                                {
                                    $dateString = $toDoListDate;
                                    $timestamp = strtotime($dateString);
                                    $sqlDateTime = date('Y-m-d H:i:s', $timestamp);
                                }
                                $sql = "INSERT INTO toDoList 
                                (toDoListName, toDoListStatus, toDoListDate,userId, toDoCatId) 
                                VALUES (:toDoListName, :toDoListStatus, :toDoListDate,:userId, :toDoCatId)";
                                $params = array(
                                    ':toDoListName'     => $toDoListName,
                                    ':toDoListStatus'   => $toDoListStatus,
                                    ':toDoListDate'     => $sqlDateTime,
                                    ':userId'           => $userId,
                                    ':toDoCatId'            => $catId
                                );
                                try {
                                    $PDOStatement = $PDO->prepare($sql);
                                    $PDOStatement->execute($params);
                                    $rowCount = $PDOStatement->rowCount();
        
                                    if($rowCount !== 1) 
                                    {
                                        echo json_encode(array("message" => "Es wurden keine Daten gespeichert."));
                                    } else 
                                    {
                                        $newToDoID = $PDO->lastInsertId();
                                        echo json_encode(array("message" => "ToDo erfolgreich unter ID: $newToDoID gespeichert."));
                                    }
                                } catch(PDOException $error) 
                                {
                                    echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                                }

                            } 
                        }catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }
                        unset($PDO, $PDOStatement);               

                    }// Hinzufügen eines Datensatzes END

                    // Datensätze nach Usereingabe laden und zählen
                    if($requestData['action'] === 'LOADCUSTOM')
                    {            

                        $toDo = $requestData['toDo'];
                        $limit = (int)$toDo['toDo']['limit'];
                        $offset = (int)$toDo['toDo']['offset'];
                        $categorie = (int)$toDo['toDo']['cat'];
                        $userToken = $toDo['userToken'];

                        $PDO = dbConnect();
                        $sql	=	"SELECT userId FROM users 
                                    WHERE userToken = :userToken";                                            
                        $params 	= array('userToken' => $userToken); 
                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);

                            $userData = $PDOStatement->fetch(PDO::FETCH_ASSOC);
                            if($userData === false) 
                            {
                                echo json_encode(array("message" => "Es ist ein Fehler beim Auslesen des Benutzers aufgetreten"));
                            } 
                            else 
                            {
                                $userId = $userData['userId'];
                                $countSql = "SELECT COUNT(*) AS total FROM toDoList WHERE userId = :userId AND toDoCatId = $categorie";
                                $countStatement = $PDO->prepare($countSql);
                                $countStatement->execute(array('userId'=>$userId));
                                $totalCount = $countStatement->fetch(PDO::FETCH_ASSOC)['total'];

                                $sql = "SELECT * FROM toDoList 
                                WHERE userId = :userId 
                                AND toDoCatId = $categorie 
                                ORDER BY 
                                CASE 
                                    WHEN toDoListDate IS NULL THEN 1 
                                    WHEN toDoListDate < CURDATE() THEN 2 
                                    ELSE 0 
                                END,
                                toDoListDate ASC, 
                                toDoListStatus DESC 
                                LIMIT $limit 
                                OFFSET $offset";
                                $params = array('userId'=>$userId);

                                try {
                                    $PDOStatement = $PDO->prepare($sql);
                                    $PDOStatement->execute($params);
                                    $toDoArray = $PDOStatement->fetchAll(PDO::FETCH_ASSOC);

                                    echo json_encode(array("data" => $toDoArray, "total" => $totalCount));
                                } catch(PDOException $error) 
                                {
                                    echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                                }
                            }
                        } 
                        catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }
                        unset($PDO, $PDOStatement); 
                    }// Datensätze nach Usereingabe laden und zählen END
                    
                    // Löschen eines Datensatzes
                    if($requestData['action'] === 'DEL')
                    {                       
                        $toDo = $requestData['toDo'];
                        // var_dump($toDo['toDo']['toDo']) ;
                        $id = (int)$toDo['toDo']['toDo'];

                        $PDO = dbConnect();
                        $sql = "DELETE FROM toDoList WHERE toDoListId = :id";
                        $params = array(':id' => $id);

                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);
                            $rowCount = $PDOStatement->rowCount();

                            if($rowCount !== 1 ) {
                                echo json_encode(array("message" => "Es wurden keine Daten gespeichert."));
                            } else {
                                echo json_encode(array("message" => "ToDo ID: $id gelöscht."));
                            }
                        } catch(PDOException $error) {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }
                        unset($PDO, $PDOStatement);

                    } // Löschen eines Datensatzes END

                    // Update eines Datensatzes
                    if ($requestData['action'] === 'EDIT') 
                    {                        

                        $toDo = $requestData['toDo'];
                        // var_dump($toDo['toDo']) ;
                        $toDoListId     = $toDo['toDo']['toDoListId'];
                        $toDoListName   = sanitizeString($toDo['toDo']['toDoListName']);
                        $toDoListStatus = $toDo['toDo']['toDoListStatus'];
                        $toDoListDate   = sanitizeString($toDo['toDo']['toDoListDate']);
                        $toDoCatId      = (int)$toDo['toDo']['toDoListCat'];;
                        $sqlDateTime    = null;

                        if($toDoListDate) 
                        {
                            $dateString = $toDoListDate;
                            $timestamp = strtotime($dateString);
                            $sqlDateTime = date('Y-m-d H:i:s', $timestamp);
                        }

                        $PDO = dbConnect();
                        $sql = "UPDATE toDoList 
                        SET toDoListName    = :toDoListName, 
                            toDoListStatus  = :toDoListStatus, 
                            toDoListDate    = :toDoListDate,
                            toDoCatId       = :toDoCatId 
                        WHERE toDoListId    = :toDoListId";
                
                        $params = array(
                            ':toDoListName'     => $toDoListName,
                            ':toDoListStatus'   => $toDoListStatus,
                            ':toDoListDate'     => $sqlDateTime,
                            ':toDoCatId'       => $toDoCatId,
                            ':toDoListId'       => (int)$toDoListId
                        );
                

                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);
                            $rowCount = $PDOStatement->rowCount();

                            if($rowCount !== 1) 
                            {
                                echo json_encode(array("message" => "Es wurden keine Daten geändert."));
                            } else 
                            {
                                echo json_encode(array("message" => "ToDo ID: $toDoListId erfolgreich geändert."));
                            }
                        } catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }

                        unset($PDO, $PDOStatement);     

                    }// Hinzufügen eines Datensatzes END

                    //LOGOUT
                    if($requestData['action'] === 'LOGOUT'){
                        $userData = $requestData['user'];
                        // var_dump($userData['userToken']) ;
                        $userToken = $userData['userToken'];
                        
                        $PDO = dbConnect();
                        $sql	=	"SELECT userId FROM users 
									WHERE userToken = :userToken";                                            
                        $params 	= array('userToken' => $userToken); 
                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);

                            $userData = $PDOStatement -> fetch(PDO::FETCH_ASSOC);
                            // var_dump($userData) ;
                            if($userData === false) 
                            {
                                echo json_encode(array("message" => "Es ist ein fehler beim Auslesen des Benutzers aufgetreten"));
                            } else 
                            {
                                $userId = $userData['userId'];

                                $sql = "UPDATE users 
                                SET userToken = :userToken
                                WHERE userId = :userId";
                
                                $params = array(
                                    ':userToken' => null,
                                    ':userId' => (int)$userId
                                );
                                try {
                                    $PDOStatement = $PDO->prepare($sql);
                                    $PDOStatement->execute($params);
                                    $rowCount = $PDOStatement->rowCount();

                                    if($rowCount !== 1) 
                                    {
                                        echo json_encode(array("message" => "Es wurden keine Daten im LOGOUT geändert."));
                                    } else 
                                    {
                                        echo json_encode(array("message" => "LOGOUT erfolgreich durchgeführt"));
                                    }
                                } catch(PDOException $error) 
                                {
                                    echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                                }
                            }
                        } catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }

                        unset($PDO, $PDOStatement);

                    }//LOGOUT END

                    
                    // Laden der Kategorien
                    if ($requestData['action'] === 'LOADCAT') {
    
                        $PDO = dbConnect();
                        $sql	=	"SELECT * from toDoCat";                                            
                        $params 	= array();
        
                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);						
                            
                        } catch(PDOException $error) {
                            // echo "Datenbanktabellen Fehler";
                        }
                        $toDoArray = $PDOStatement -> fetchAll(\PDO::FETCH_ASSOC);
                        unset($PDO,$PDOStatement);
                        echo json_encode($toDoArray);

                    }//Laden der Kategorien END

                }//POST END
            

#*******************************************************************************************************#