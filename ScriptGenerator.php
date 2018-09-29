<?php 

class ScriptGenerator
{
	public function generateScript()
	{
		$this->writeArtfactoryConfiguration();
		
		$this->writeDevDeployment();
		$this->writeDevTesting();
		
		$this->writeUatDeployment();
		$this->writeUatTesting();
		
		$this->writeProdDeployment();
		$this->writeProdTesting();
	}
	
	private function writeDevDeployment()
	{
	}
	
	private function writeDevTesting()
	{
		
	}
	
	private function writeUatDeployment()
	{
		
	}
	
	private function writeUatTesting()
	{
		
	}
	
	private function writeProdDeployment()
	{
		
	}
	
	private function writeProdTesting()
	{
		
	}
	
	private function writeCloneRepository()
	{
		
	}
	
	private function writeArtfactoryConfiguration()
	{
		
	}
	
	private function writeMavenBuild()
	{
		
	}
}