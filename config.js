var preDefinedStages = [
    { name : "Clone" ,  steps: ['git']},
    { name : "ArtifactoryConfigurationMaven" , steps: ['createserver','generateBuildInfo','mavenConfiguration']},
	{ name : "ArtifactoryConfigurationGradle" , steps: ['createserver','generateBuildInfo','gradleConfiguration']},
    { name : "MavenBuild" , steps : ['mavenRun']},
	{ name : "GradleBuild" , steps : ['gradlebuild']},
	{ name : "MSBuild" , steps : ['msbuild']},
	{ name : "AntBuild" , steps : ['antbuild']},
    { name : "Publish" , steps : ['publish']}
];

var steps = {

    select:{ "name" : " -- Select --", params: {"batchscript" : {"type" : "textarea"}},"category":"jenkins"},

    select:{ "name" : " -- Select --", params: {"batchscript" : {"type" : "textarea"}},"category":"ansible"},

    bat:{ "name" : "Windows Batch Script", params: {"batchscript" : {"type" : "text","name" : "batchscript"}},scripts:["bat [batchscript]"], globals : [],"category":"jenkins"},

    build:{ "name" : "Build a job", params: {"Project to Build" : {"type": "text", "name" : "project"}},scripts:["build '[project]'"], globals : [],"category":"jenkins"},

    checkout:{ "name" : "General SCM", params: {"SCM" : {"type":"select", "name": "scm","options" : ["Git","SVN"]},"URL" : {"type":"text","name":"url"},"CredentialId" : {"type":"text","name":"credentialid"},"Branch" : {"type":"text","name":"branch"}}, scripts : ["checkout([$class: '[scm]', branches: [[name: '*/[branch]']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '[credentialid]', url: '[url]']]])"], globals : [] ,"category":"jenkins"},

    deleteDir:{ "name" : "Recursively delete the current directory from the workspace", params: {},scripts : ["deleteDir()"], globals : [],"category":"jenkins"},

    dir:{ "name" : "Change current directory", params: {"Path" : {"type" : "text", "name": "path"}}, scripts: ["dir('[path]')"], globals : [],"category":"jenkins"},

    echo:{ "name" : "Print Message", params: {"Message":{"type" : "text", "name" : "message"}}, scripts: ["echo '[message]'"], globals : [],"category":"jenkins"},
    
    input:{ "name" : "Wait for interactive input", params: {"Text":{"type" : "text", "name" : "text"}}, scripts: ["input '[text]'"], globals : [],"category":"jenkins"},
    
    git:{ "name" : "Git", params: {"Git Url" : {"type" : "text", "name" : "giturl"},"Git Branch" : {"type" : "text", "name" : "gitbranch"}, "Credential Id":{"type" : "text", "name" : "gitcredid"}},scripts: ["git branch: '[gitbranch]', credentialsId: '[gitcredid]', url: '[giturl]'"], globals : [],"category":"jenkins"},
    
    
    msbuild : { "name" : "MsBuild", params: { "MSBuild Tool Name" : {"type" : "text","name":"toolname"},"Build File Name" : {"type" : "text","name":"buildfilename"}},scripts: ["bat \"\"${tool '[toolname]'}\" [buildfilename] /p:Configuration=Release /p:Platform=\"Any CPU\" /p:ProductVersion=1.0.0.${env.BUILD_NUMBER}"], globals : [],"category":"jenkins"},

    /*emailext:{ "name" : "Extended Email", params: {"Project to Build" : "text"}},

    emailextrecipients:{ "name" : "Extended Email Recipients", params: {"Project to Build" : "text"}},

    error:{ "name" : "Error signal", params: {"Project to Build" : "text"}},

    git:{ "name" : "Git", params: {"Project to Build" : "text"}},

    input:{ "name" : "Wait for interactive input", params: {"Project to Build" : "text"}},

    junit:{ "name" : "Archive JUnit-formatted test results", params: {"Project to Build" : "text"}},

    node:{ "name" : "Allocate node", params: {"Project to Build" : "text"}},

    pwd:{ "name" : "Determine current directory", params: {"Project to Build" : "text"}},

    readFile:{ "name" : "Read file from workspace", params: {"Project to Build" : "text"}},

    script:{ "name" : "Run arbitrary Pipeline script", params: {"Project to Build" : "text"}},

    sh:{ "name" : "Shell Script", params: {"Project to Build" : "text"}},

    sleep:{ "name" : "Sleep", params: {"Project to Build" : "text"}},

    step:{ "name" : "General Build Step", params: {"Project to Build" : "text"}},

    svn:{ "name" : "Subversion", params: {"Project to Build" : "text"}},

    timestamps:{ "name" : "Timestamps", params: {"Project to Build" : "text"}},

    writeFile:{ "name" : "Write file to workspace", params: {"Project to Build" : "text"}},*/
    
    createserver:{ "name" : "Define Artifactory Server", params:{"Server Url" : {"type" : "text", "name": "serverurl"},"Username":{"type" : "text", "name" : "username"},"Password" : {"type" : "text", "name" : "password"}}, scripts:[" server = Artifactory.newServer url: '[serverurl]', username: '[username]', password: '[password]'"], globals : ['server'],"category":"jenkins"},

    generateBuildInfo:{ "name" : "Generate Build Info", params : {},scripts : ["buildInfo = Artifactory.newBuildInfo()"], globals : ['buildInfo'],"category":"jenkins"},

    mavenConfiguration:{ "name" : "Moven Configuration", params:{"Maven Tool" : {"type" : "text", "name" : "maventool"},"Deployer Release Repository" : {"type" : "text", "name" : "deployerreleaserepo"},"Deployer Snapshot Repository" : {"type" : "text", "name" : "deployersnaprepo"},"Resolver Release Repository" : {"type" : "text", "name" : "resolverreleaserepo"},"Resolver Snapshot Repository" : {"type" : "text", "name" : "resolversnaprepo"}}, scripts : ["env.JAVA_HOME=\"${tool 'jdk8'}\"","rtMaven = Artifactory.newMavenBuild()","rtMaven.tool = '[maventool]'","rtMaven.deployer releaseRepo: '[deployerreleaserepo]', snapshotRepo: '[deployersnaprepo]', server: server","rtMaven.resolver releaseRepo: '[resolverreleaserepo]', snapshotRepo: '[resolversnaprepo]', server: server","rtMaven.deployer.deployArtifacts = false"], globals : ["rtMaven"],"category":"jenkins"},
	
	gradleConfiguration: {"name" : "Gradle Configuration", params:{"Gradle Tool" : {"type" : "text", "name" : "gradletool"},"Local Repository" : {"type" : "text", "name" : "localreleaserepo"},"Resolver Repository" : {"type" : "text", "name" : "resolverrepo"}},scripts:["rtGradle = Artifactory.newGradleBuild()","rtGradle.tool = \"[gradletool]\"","rtGradle.deployer repo:'[localreleaserepo]', server: server","rtGradle.resolver repo:'[resolverrepo]', server: server"],globals : ["rtGradle"],"category":"jenkins"},

    mavenRun:{ "name" : "Maven Run Configuration", params : {"Pom File Path" : {"type" : "text", "name" : "path"}}, scripts : ["rtMaven.run pom: '[path]', goals: 'install '"],"category":"jenkins"},
	
	gradlebuild:{ "name" : "Gradle Build", params : {"Build File Name" : {"type" : "text", "name" : "gradlebuildfilename"}}, scripts : ["buildInfo = rtGradle.run rootDir: \".\", buildFile: '[gradlebuildfilename]', tasks: 'clean artifactoryPublish'"],"category":"jenkins"},
	
	antbuild:{ "name" : "Gradle Build", params : {}, scripts : ["ant -d build"],"category":"jenkins"},

    publish: { "name" : "Publish To Server", params : {}, scripts:["server.publishBuildInfo buildInfo"],"category":"jenkins"},

    customCommand : {"name" : "Custom Command","params" : {"Hosts" : {"name" : "hosts", "type" : "text"},"Name" : {"name" : "stepname", "type" : "text"},"Command" : {"name" : "command", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: '[stepname]'","  &nbsp; raw: '[command]'"],"category":"ansible"},
	
	installTomcat : {"name" : "Install Tomcat","params" : {"Hosts" : {"name" : "hosts", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: 'Install Tomcat'","  &nbsp; raw: 'apt-get install tomcat'"],"category":"ansible"},
	
	installMysql : {"name" : "Install Mysql","params" : {"Hosts" : {"name" : "hosts", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: 'Install Mysql'","  &nbsp; raw: 'apt-get install mysql'"],"category":"ansible"},
	
	updateSystem : {"name" : "Update System","params" : {"Hosts" : {"name" : "hosts", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: 'System Update'","  &nbsp; raw: 'apt-get update'"],"category":"ansible"},
	
	installDocker : {"name" : "Install Docker","params" : {"Hosts" : {"name" : "hosts", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: 'Install Docker'","  &nbsp; raw: 'apt-get install docker'"],"category":"ansible"},
	
	upgradeSystem : {"name" : "Upgrade System","params" : {"Hosts" : {"name" : "hosts", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: 'System Upgrade'","  &nbsp; raw: 'apt-get upgrade'"],"category":"ansible"},
	
	createDirectory : {"name" : "Create Directory","params" : {"Hosts" : {"name" : "hosts", "type" : "text"},"Name" : {"name" : "stepname", "type" : "text"},"Command" : {"name" : "command", "type" : "text"}},"scripts" : ["- hosts: '[hosts]'","tasks:"," - name: '[stepname]'","  &nbsp; raw: '[command]'"],"category":"ansible"},

}