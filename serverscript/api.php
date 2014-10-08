<?php
    include_once("Rest.inc.php");
    include_once("Util.inc.php");

	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "localhost";
		const DB_USER = "ange";
		const DB_PASSWORD = "";
		const DB = "ange";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct() {
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect() {
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
            Util::_c("FUNC[dbConnect]");

            if (mysqli_connect_errno()) {
                Util::_c("FUNC[dbConnect] : 디비연결 실패");
                printf("Connect failed: %s\n", mysqli_connect_error());
                exit();
            }
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi() {
            Util::_c("FUNC[processApi]----------->>>>>>>>>");
//            $func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
/*
            Util::_c("FUNC[processApi] REQUEST : ".print_r($_REQUEST,true));
            $func = $_REQUEST['func'];


			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
*/
            $category = [];

            if (isset($_REQUEST['_category'])) {
                $category = explode("/", $_REQUEST['_category']);

                Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
                Util::_c("FUNC[processApi] category.cnt : ".count($category));
            }

            if (isset($_REQUEST['id']))
            Util::_c("FUNC[processApi] _________ID : ".$_REQUEST['id']);
            Util::_c("FUNC[processApi] REQUEST_METHOD : ".$_SERVER['REQUEST_METHOD']);

            switch ($_REQUEST['_method']) {
                case "GET":
                    if (isset($_REQUEST['id'])){
                        Util::_c("FUNC[processApi] 1 : ");
                        $this->$category[1]();
                    }
                    else {
                        Util::_c("FUNC[processApi] 2 : ".$category[1]);
                        $func = $category[1]."s";
                        $this->$func();
                    }

                    break;

                case "POST":
                    $func = $category[1]."Create";
                    $this->$func();
                    break;

                case "PUT":
                    $func = $category[1]."Update";
                    $this->$func();
                    break;

                case "DELETE":
//                    $id = explode("book/", $_SERVER['REQUEST_URI']);
                    if (isset($_REQUEST['_id'])){
                        Util::_c("FUNC[processApi] 2 ::::::::::S ".$_REQUEST['_id']);
                        $func = $category[1]."Delete";
                        $this->$func();
                    }
                    break;
            }
        }

		private function login() {
			if($this->get_request_method() != "POST") {
				$this->response('',406);
			}
			$email = $this->_request['email'];		
			$password = $this->_request['pwd'];
			if(!empty($email) and !empty($password)) {
				if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
					$query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
			$this->response($this->json($error), 400);
		}

        private function signin() {
            if($this->get_request_method() != "GET") {
                $this->response('',406);
            }

            $id = (int)$_REQUEST['id'];
            if($id > 0) {
                $query="SELECT NO AS id, '' AS userRole, '111' AS token FROM ange.content where no=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }

        private function webboards() {
            Util::_c("FUNC[processApi] 2 ::::::::::S ");

            if($this->get_request_method() != "GET") {
                $this->response('',406);
            }
            Util::_c("FUNC[processApi] 2 ::::::::::S ");
            $query="SELECT * FROM ange.content";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            Util::_c("FUNC[processApi] 2 ::::::::::S ");
            if($r->num_rows > 0) {
                $result = array();
                while($row = $r->fetch_assoc()) {
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);	// If no records "No Content" status
        }

        private function contents() {
            Util::_c("FUNC[processApi] 2 ::::::::::S ");

            if($this->get_request_method() != "GET") {
                $this->response('',406);
            }
            Util::_c("FUNC[processApi] 2 ::::::::::S ");
            $query="SELECT * FROM ange.content";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            Util::_c("FUNC[processApi] 2 ::::::::::S ");
            if($r->num_rows > 0) {
                $result = array();
                while($row = $r->fetch_assoc()) {
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);	// If no records "No Content" status
        }

        private function content() {
            if($this->get_request_method() != "GET") {
                $this->response('',406);
            }

            $id = (int)$_REQUEST['id'];
            if($id > 0) {
                $query="SELECT * FROM ange.content where no=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }

        private function contentCreate() {
            if($this->get_request_method() != "POST") {
                $this->response('',406);
            }

            $content = json_decode(file_get_contents("php://input"),true);
            $column_names = array('SUBJECT', 'BODY', 'REG_UID', 'REG_NM', 'REG_DT');
            $keys = array_keys($content);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key) { // Check the customer received. If blank insert blank into the array.
                if(!in_array($desired_key, $keys)) {
                    $$desired_key = '';
                }else{
                    $$desired_key = $content[$desired_key];
                }
                $columns = $columns.$desired_key.',';

                if(strpos($desired_key, 'REG_DT') !== false) {
                    $values = $values."SYSDATE(),";
                } else {
                    $values = $values."'".$$desired_key."',";
                }
            }
            $query = "INSERT INTO ange.content(".trim($columns,',').") VALUES(".trim($values,',').")";
            if(!empty($content)) {
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Customer Created Successfully.", "data" => $content);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	//"No Content" status
        }

        private function contentUpdate() {
            if($this->get_request_method() != "POST") {
                $this->response('',406);
            }
            $content = json_decode(file_get_contents("php://input"),true);
            $id = (int)$content['NO'];
            $column_names = array('SUBJECT', 'BODY', 'REG_UID', 'REG_NM');
            $keys = array_keys($content);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key) { // Check the customer received. If key does not exist, insert blank into the array.
                if(!in_array($desired_key, $keys)) {
                    $$desired_key = '';
                }else{
                    $$desired_key = $content[$desired_key];
                }
                $columns = $columns.$desired_key."='".$$desired_key."',";
            }
            $query = "UPDATE ange.content SET ".trim($columns,',')." WHERE no = $id";
            if(!empty($content)) {
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Customer ".$id." Updated Successfully.", "data" => $content);
                $this->response($this->json($success),200);
            } else
                $this->response('',204);	// "No Content" status
        }

        private function contentDelete() {
//            if($this->get_request_method() != "DELETE") {
            if($this->get_request_method() != "GET") {
                $this->response('',406);
            }
            $id = (int)$_REQUEST['_id'];
            if($id > 0) {
                $query = "DELETE FROM ange.content WHERE no = $id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Successfully deleted one record.");
                $this->response($this->json($success),200);
            } else
                $this->response('',204);	// If no records "No Content" status
        }

		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	$api = new API;
	$api->processApi();
?>
