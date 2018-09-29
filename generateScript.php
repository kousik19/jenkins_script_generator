<?php 

$gitUrl = $_POST["giturl"];
$branch = $_POST["branch"];
$email = $_POST["email"];
$emailSubject = $_POST["emailSubject"];
$emailBody = $_POST["emailBody"];

$res = "";

$res .= "/**
          Project Name : 
		  Release Number: 
		  Project Manager : 
**/<br>";

$res .= "node (){<br>
  stage('sanity check'){<br>
      
  }<br>";
  
$res .= "stage ('checkout other repository'){<br>
    try{<br>
        <br>
        checkout([\$class: 'GitSCM', branches: [[name: '*/$branch']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '2d5e31ac-103b-4e05-8f69-6feaa548b35c', url: '$gitUrl']]])<br>
        <br>
    }catch(Exception e){<br>
        <br>
        println \"ERROR!!!!\"<br>
        emailext body: '$emailBody', subject: '$emailSubject', to: '$email'<br>
    }<br>
  }<br>
  <br>
  stage('log results'){<br>
      <br>
  }<br>
  <br>
 }";
 
 
echo $res;