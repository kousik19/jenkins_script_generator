
	(function(){

        
		var scriptObj = {};
		var tempScriptObj = {};
        var selectedStage;
        var currentStages = Array();
        var currentSteps = Array();
		var globalVariables = Array();
		var trackOrder = 1;
		var scriptType = 'jenkins';
        
        var preDefinedStagesHtml = "";
        for(var k=0;k<preDefinedStages.length;k++)
        {
            preDefinedStagesHtml += "<input type=\"checkbox\" class=\"predefinedstage\" name=\""+preDefinedStages[k].name+"\"> "+preDefinedStages[k].name +" &nbsp; ";
        }
		$("#predefinedstages").html(preDefinedStagesHtml);
		
		$('input[type=radio][name=scripttype]').change(function() {

			scriptType = $(this).val();
			
			var selectHtml = "";
			for (var key in steps) {
				if (steps.hasOwnProperty(key)) {
					
					if(steps[key].category == scriptType)
						selectHtml += "<option value=\""+key+"\">"+steps[key].name+"</option>";
				}
			}
			$("#operations").html(selectHtml);

			swapper = $.extend(true,{},tempScriptObj);
			tempScriptObj = $.extend(true,{},scriptObj);
			scriptObj = $.extend(true,{},swapper);
			render();
			//console.log(scriptObj);
		})

        $(document).on("change",".predefinedstage",function() {
			
			$("#adcustomstagesection").css("display","none");

            var allsteps = Array();
            var allPredefinedStages = $(".predefinedstage");

            currentStages = Array();
			currentSteps = Array();

            for(var i=0;i<allPredefinedStages.length;i++){

                if($(allPredefinedStages[i]).is(":checked")) {
                    
                    var name = $(allPredefinedStages[i]).attr('name');
                    for(var t=0;t<preDefinedStages.length;t++)
                    {
                        if(preDefinedStages[t].name == name)break;
                    }
                    
                    var obj = {};
                    obj.stageName =  preDefinedStages[t].name;
                    obj.steps = Array();
					
                    for(var z=0;z<preDefinedStages[t].steps.length;z++){
						
                        obj.steps.push(preDefinedStages[t].steps[z]);
                        currentSteps.push(preDefinedStages[t].steps[z]);
						
                    }

                    allsteps.push(obj);

                    currentStages.push(preDefinedStages[t].name);
                }

            }
			//console.log("Length should be : "+currentSteps.length);

            addStage();

            $(".fromsection").html("");
            for(var p=0;p<allsteps.length;p++)
            {
                //console.log(steps[allsteps[p]]);
                var stps = allsteps[p].steps;

                for(var c=0;c<stps.length;c++){

                    params = steps[stps[c]].params;
                    renderInputForm(allsteps[p].stageName,params,"append");

                }
                
            }
        });

        //=====================================================================
		
		$("#operations").change(function(){
		
			var op = $(this).val();
			var params = steps[op].params;
			renderInputForm(currentStages[0],params,"replace");
		})
		
		$("#addstage").click(function(){
            
            currentStages = Array();
            currentStages.push($("#stagename").val());
			addStage();
		
		})
		
		$(document).on("click",".addStep",function(){
			
            
            for(var j=0;j<currentStages.length;j++){
                
				var isPredefined = 0;
				for(q=0;q<preDefinedStages.length;q++)
				{
					if(preDefinedStages[q].name == currentStages[j])
					{
						isPredefined = 1;
						break;
					}
				}
				
				currentStageSteps = Array();
				if(isPredefined == 1)
					currentStageSteps = preDefinedStages[q].steps;
				else 
					currentStageSteps.push($("#operations").val());
				
				//console.log(currentStageSteps);
				
                for(var k=0;k<currentStageSteps.length;k++){

                    var inputs = $("."+currentStages[j]+" .forminputelem");
                    var errorhandlers = $("."+currentStages[j]+" .errorhandler");
                    
                    //console.log(steps[currentStageSteps[k]]);
					
                    var modifiedScripts = $.extend([],steps[currentStageSteps[k]].scripts);
					var globals = steps[currentStageSteps[k]].globals;
                    //console.log(modifiedScripts);
                    var exceptionHander = "";
                    var modifiedScript = "";
					var paramValueMap = {};
					
					//console.log(modifiedScripts);
					
					if(scriptType == 'jenkins'){
						
						for(var l=0;l<modifiedScripts.length;l++){
							
							modifiedScripts[l] = modifiedScript + modifiedScripts[l];
							
							if(inputs.length > 0){
								for(var i=0;i<inputs.length;i++)
								{
									var name = $(inputs[i]).attr("name");
									var value = $("[name='"+name+"']").val();
									
									paramValueMap[name] = value;
									
									//console.log(name + "   " + value);
									
									modifiedScript = modifiedScripts[l].replace("["+name+"]",value);
									modifiedScripts[l] = modifiedScript;
								}
							}
							else{
								
								modifiedScript += modifiedScripts[l]
							}
							modifiedScript += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						}
					}
					else if(scriptType == 'ansible'){
						
						for(var l=0;l<modifiedScripts.length;l++){
							
							modifiedScripts[l] = modifiedScript + modifiedScripts[l];
							
							if(inputs.length > 0){
								for(var i=0;i<inputs.length;i++)
								{
									var name = $(inputs[i]).attr("name");
									var value = $("[name='"+name+"']").val();
									
									paramValueMap[name] = value;
									
									modifiedScript = modifiedScripts[l].replace("["+name+"]",value);
								
									modifiedScripts[l] = modifiedScript;
								}
							}
							else{
								
								modifiedScript += modifiedScripts[l]
							}
							modifiedScript += "<br/>";
						}
					}
					//console.log(modifiedScript);
                    
                    for(var i=0;i<errorhandlers.length;i++)
                    { 
                        if($(errorhandlers[i]).is(":checked"))
                        {
                            exceptionHander += $(errorhandlers[i]).val()+"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                        }
                    }
					
					if(globals != undefined){
						for(var i=0;i<globals.length;i++)
							globalVariables.push(globals[i]);
					}
                    
                    addStep(currentStages[j],currentStageSteps[k],modifiedScript,exceptionHander,paramValueMap);

                }
            }
		})
		
		$(document).on("click",".delstage",function(){
			
			var stage = $(this).attr("data-pick");
            delete scriptObj[stage];
            render();
			
		})
		
		$(document).on("click",".delstep",function(){
			
			var step = $(this).attr("data-pick");
			var stage = $(this).attr("data-parentpick");
            delete scriptObj[stage][step];
            render();
			
		})
		
		
		var render = function(){
			
				p = 0;
				html = "<ul>";
				for (var key in scriptObj) {
					if (scriptObj.hasOwnProperty(key)) {
						
						html += "<li class=\"stage\" data-pick=\""+key+"\">"+key+"<span class=\"delstage\" style=\"float:right\" data-pick=\""+key+"\">[x]</span>" ;
						
						html = html + "<ul>";
						var steps = scriptObj[key];
						
						for (var key1 in steps) {
							if (steps.hasOwnProperty(key1)) {
								//console.log(scriptObj);
								html += "<li class=\"step\" data-pick=\""+key1+"\" data-parentpick=\""+key+"\" style=\"padding-left:12px\">\t" + key1 + "<span style=\"float:right\" data-pick=\""+key1+"\" data-parentpick=\""+key+"\" class=\"delstep\">[x]</span><span style=\"float:right\" data-pick=\""+key1+"\" data-parentpick=\""+key+"\" class=\"editstep\" onclick=\"renderEditInputForm('"+key+"','"+key1+"')\">[..]</span></li>";
							
							}
						}
						html = html + "</ul>";
						html += "</li>";
					}
					p = 1;
				}
				html += "</ul>";
				
				//if(p==0)return;
				
				//console.log(html);
				$(".hierarchy").html(html);
				
				//==============================================================================================
				//console.log(scriptObj);
				
				html = "node(){<br/>"
				
				for(var gl=0;gl<globalVariables.length;gl++)
				{
					html += "&nbsp;&nbsp;def "+globalVariables[gl]+"<br />";
				}
				html += "<br />";
				
				for (var key in scriptObj) {
					
					if (scriptObj.hasOwnProperty(key)) {
						
						html += "&nbsp;&nbsp;stage('"+key+"') {<br/>" ;
						html += "&nbsp;&nbsp;&nbsp;&nbsp;try{<br/><br/>";
						
						var steps = scriptObj[key];
						
						for (var key1 in steps) {
							if (steps.hasOwnProperty(key1)) {
								//console.log(scriptObj);
								if(steps[key1].exceptionHander.length > 0)
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;try{<br/><br/>&nbsp;&nbsp;"
								html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + steps[key1].script + "<br/><br/>";
								
								if(steps[key1].exceptionHander.length > 0){
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}catch(Exception e){<br/><br/>";
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + steps[key1].exceptionHander + "<br/><br/>";
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>"
								}
							
							}
						}
						
						html += "&nbsp;&nbsp;&nbsp;&nbsp;}<br/>";
						html += "&nbsp;&nbsp;&nbsp;&nbsp;catch(Exception e){<br/>";
						html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; println(e.getMessage())<br/><br/>";
						html += "&nbsp;&nbsp;&nbsp;&nbsp;}<br/>";
						html += "&nbsp;&nbsp;}<br/>";
					}
					p = 1;
				}
				html += "}";
				
				console.log(scriptObj);
				if(scriptType == 'ansible')
				{
					html = "---<br />";
					for (var key in scriptObj) {
						
						var steps = scriptObj[key];
						
						for (var key1 in steps) {
							html += "" + steps[key1].script + "<br />";
						}
					}
				}
				
				//if(p==0)return;
				
				//$(".mostleftside").html(html);
				$("#code").html(html);
			
			
        }
        
        addStage  = function(){

            for(var i=0;i<currentStages.length;i++)
                scriptObj[currentStages[i]] = {};

            //selectedStage = stageName;
            
            render();
        }

        addStep = function(stageName,stepName,modifiedScript,exceptionHander,paramValueMap){

			delete scriptObj[stageName][stepName];
			
            scriptObj[stageName][stepName]={ "script" : modifiedScript, "exceptionHander" : exceptionHander, "paramValueMap" : paramValueMap};
            
            render();
        }

        renderInputForm = function(stageName,params,renderType)
        {
			if(stageName == undefined)
			{
				alert("Confirm stage name by pressing ok button first");
				return;
			}
			
            var formHtml = "";
            formHtml += " <fieldset style=\"border:1px solid black;padding:5px\">";
            formHtml += " <legend>"+stageName+"</legend>";

            formHtml += "<table style=\"width:80%;margin:auto;margin-top:10px;\" class=\""+stageName+"\">";
            
			for (var key in params) {
				if (params.hasOwnProperty(key)) {
					
					var paramName = key;
					var paramDesc = params[key];
					
					formHtml += "<tr>";
					formHtml += "<td>";
					
					formHtml += paramName+" : ";
					
					formHtml += "</td>";
                    formHtml += "<td>";
					
					if(paramDesc.type == "text" || paramDesc.type == "number")
						formHtml += "<input class=\"frminput forminputelem\" name=\""+paramDesc.name+"\" type=\""+paramDesc.type+"\">";
					else if(paramDesc.type == "select")
					{
						formHtml += "<select name=\""+paramDesc.name+"\" class=\"frminput forminputelem\">";
						for(i=0;i<paramDesc.options.length;i++)
							formHtml += "<option>"+paramDesc.options[i]+"</option>";
							
						formHtml += "</select>";
					}
					
					formHtml += "</td>";
					
					formHtml += "</tr>";
				}
            }
            
            formHtml += "<tr><td colspan=2><b> If Error : </b> <input type=\"Checkbox\" class=\"sendemail errorhandler\" value=\"emailext body: '${BUILD_LOG, maxLines=9999, escapeHtml=false}', subject: 'Build Error', to: 'asasa'\"> Send Email &nbsp; <input type=\"Checkbox\" class=\"showinlog errorhandler\" value=\"echo e.getMessage()\"> Show in log &nbsp;  <input type=\"Checkbox\" class=\"showinlog errorhandler\" value=\"System.exit()\"> Stop Execution";

            formHtml += "</fieldset>";

            if(renderType == "replace"){

                
                /*formHtml += "<tr><td colspan=2><center> <button class=\"btn addStep\"> Add </button> </center> </td></tr>";
                formHtml += "</table>";*/

                $(".fromsection").html(formHtml);
            }
            else if(renderType == "append"){$(".fromsection").append(formHtml);}
        }
		
		renderEditInputForm = function(stage,step){
			
			//console.log(scriptObj);
			
			currentStages = Array();
            currentStages.push(stage);
			
			renderInputForm(stage,steps[step].params,'replace');
			
			var inputMap = scriptObj[stage][step].paramValueMap;
			
			for (var key in inputMap) {
				if (inputMap.hasOwnProperty(key)) {
					$("[name="+key+"]").val(inputMap[key]);
				}
			}
			
		}
		
		$("#addcustomstage").click(function(){
			
			$(".addstagesection").css("display","");
		});

		$("#copybtn").click(function(){

			var text = document.getElementById('code').innerHTML;
			text = text.split('<br>').join('\n');
			text = text.split('&nbsp;').join(' ');
			//console.log(text);

			var aux = $('<textarea>').appendTo('body').val(text).select();

			// Copy the highlighted text
			document.execCommand("copy");

			// Remove it from the body
			aux.remove();
			alert("Copied into clipboard");
		})
		
	})()