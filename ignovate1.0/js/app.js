var app = angular.module('myApp', []);
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})
		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'AdminController'
		})
		.when('/actionItems', {
			templateUrl: 'views/actionItems.html',
			controller: 'pmrCtrl'
		})
		.when('/deliverables', {
			templateUrl: 'views/deliverables.html',
			controller: ''
		})
		.otherwise({
			redirectTo: '/'
		});
});

app.controller('LoginController', function($scope, $http, $location){
	$scope.userName = "";
	$scope.password = "";
	
	$scope.validateUser = function() {
		alert("clicked");
		alert($scope.userName);
		var userName = $scope.userName;
	    var password = $scope.password;
		var isValid = false;
		$http.get("https://api.mlab.com/api/1/databases/ignovate/collections/ignovate/58f3dae7734d1d3b89bacccb?apiKey=kfyfdb2b9TdKzrhoilhM6VkdAznffFlA")
		.then(function(response) {
     	console.log(response.data);
		var users = response.data.users;
		console.log(users);
		console.log($scope.userName);
		for (var k in users){
			console.log("username is"+userName);
			if(users[k].user==userName && users[k].password==password){
				isValid = true;
			}
		}
		console.log(isValid)
		if(isValid && userName == "admin") {
			console.log($location.path());
			$location.path("/admin");
		}else if(isValid && userName !== "admin") {
			$location.path("/actionItems");
		}
		});
	}
});

app.controller('AdminController', function($scope, $http){
	$scope.generatePPT = function() {
	var responseData="";
	$http.get("https://api.mlab.com/api/1/databases/ignovate/collections/ignovate/58f3dae7734d1d3b89bacccb?apiKey=kfyfdb2b9TdKzrhoilhM6VkdAznffFlA")
		.then(function(response) {
			responseData = response.data;
			console.log(responseData.users);
			var pptx = new PptxGenJS();
	var slide1 = pptx.addNewSlide();
	slide1.addImage({ path:'./images/layout1.PNG',w:10, h:5.62 });
	
	var slide2 = pptx.addNewSlide();
	var opts = {x:0.4,y:0.4,font_face:'Arial (Headings)',font_size:25,color:'089de3'}
	slide2.addText("Agenda", opts);
	slide2.addText(
    'Action Items from last PMR \nProject Highlights \nSprint and Defect Metrics \nCode Quality Report \nRisks & Dependencies',
    { x:0.4,y:2,color:'025774', font_size:20, bullet:true });
	slide2.addImage({path:'./images/footer2.PNG',y:5.12,w:10,h:0.5});
	slide2.addImage({ path:'./images/line.PNG',w:9.5,x:0.4,y:0.2,h:0.1});
	
	var slide3 = pptx.addNewSlide();
	slide3.addText("Action items from the previous PMR meet", opts);
	slide3.addImage({path:'./images/footer3.PNG',y:5.12,w:10,h:0.5});
	slide3.addImage({ path:'./images/line.PNG',w:9.5,x:0.4,y:0.2,h:0.1});
	var actionRow = [
    [{ text: 'Action Item', opts: {font_size:18,valign:'m', align:'c', bold : true, color:'ffffff', font_face:'Arial', fill:'10a8db'}},
	 { text: 'Status', opts: { font_size:18, valign:'m', align:'c', bold : true, color:'ffffff', font_face:'Arial', fill:'10a8db'}},
	 { text: 'Remarks', opts: {font_size:18, valign:'m', align:'c', bold : true, color:'ffffff', font_face:'Arial', fill:'10a8db'}}]
	 ];
	var actionTabOpts1 = { x:0.5, y:0.8,w:9};
	var actionCelOpts1 = {
    font_size:12, rowH:0.4,colW:[5,2,2],fill:'87CEFA',color:'000000',
	valign:'t', align:'l', border:{ pt:'1',color:'ffffff' }};
	slide3.addTable( actionRow, actionTabOpts1, actionCelOpts1 );
	
	var actionRowsDataArray = [];
	var actionRowsData = responseData.actionRowsData;
	for(var k in actionRowsData ){
		var actionRow =[
			{ text:  actionRowsData[k].item},
			{ text: actionRowsData[k].status},
			{ text: actionRowsData[k].remarks}
		];
		actionRowsDataArray.push(actionRow);
		console.log("from response");
		console.log(responseData.actionRowsData);
	}
	var optsOdd = 'cce5f4';
	var actionTabOptsArray = {x:0.5, y:1.2,w:9};
	var actionCelOpts2 ={font_size:10, rowH:0.4,colW:[5,2,2],color:'000000',font_face:'Arial',fill:optsOdd,
	valign:'t', align:'l', border:{ pt:'1',color:'ffffff' }};
	slide3.addTable(actionRowsDataArray,actionTabOptsArray, actionCelOpts2);
	
	var Highlights = {"scopusHighlights":
						["New Display rules for citation Benchmarking in Altmetrics page.",
						 "New CiteScore widget popup added.",
						 "Xabsmetadata SOAP to REST migration."
						],
					  "sciencedirectHighlights":["sciencedirectHighlight1","sciencedirectHighlight2"],
					  "enrichedContentHighlights":["EnrichedContentHighlight1","EnrichedContentHighlight2"],
					  "spfaeHighlights":["spf a&e highlight1"],
					  "spfcontentHighlights":["spfcontentHighlight1","spfcontentHighlight2"],
					  "engineeringvillageHighlights":["evhighlight1","evhighlight2"]
					 };
	
	var slide4 = pptx.addNewSlide();
	slide4.addImage({ path:'./images/line.PNG',w:9.5,x:0.4,y:0.2,h:0.1});
	slide4.addText("Project Highlights - RP", {x:0.4,y:0.4,font_face:'Arial (Headings)',font_size:20,color:'089de3'});
	slide4.addImage({path:'./images/footer4.PNG',y:5.12,w:10,h:0.5});
	slide4.addText('Scopus',   { x:0.4, y:0.6, w:'20%', h:0.38,font_face:'Verdana', font_size:8 ,bold:true, color:'000000', bullet:{code:'2605'} });
	var y1Value = 0.85;
	for(var k in Highlights.scopusHighlights){
		slide4.addText(Highlights.scopusHighlights[k],{x:0.8, y:y1Value,w:'40%',font_face:'Verdana', font_size:8,bullet:true});
		y1Value = y1Value + 0.25;
	}
	slide4.addText('ScienceDirect',   { x:0.4, y:2.5, w:'20%', h:0.38,font_face:'Verdana', font_size:8 ,bold:true, color:'000000', bullet:{code:'2605'} });
	var y2Value = 2.75;
	for(var k in Highlights.sciencedirectHighlights){
		slide4.addText(Highlights.sciencedirectHighlights[k],{x:0.8, y:y2Value,w:'40%',font_face:'Verdana', font_size:8,bullet:true});
		y2Value = y2Value + 0.25;
	}
	slide4.addText('Enriched Content',   { x:0.4, y:3.5, w:'20%', h:0.38,font_face:'Verdana', font_size:8 ,bold:true, color:'000000', bullet:{code:'2605'} });
	var y3Value = 3.75;
	for(var k in Highlights.enrichedContentHighlights){
		slide4.addText(Highlights.enrichedContentHighlights[k],{x:0.8, y:y3Value,w:'40%',font_face:'Verdana', font_size:8,bullet:true});
		y3Value = y3Value + 0.25;
	}
	slide4.addText('SPF A&E',   { x:0.4, y:4.5, w:'20%', h:0.38,font_face:'Verdana', font_size:8 ,bold:true, color:'000000', bullet:{code:'2605'} });
	var y4Value = 4.75;
	for(var k in Highlights.spfaeHighlights){
		slide4.addText(Highlights.spfaeHighlights[k],{x:0.8, y:y4Value,w:'40%',font_face:'Verdana', font_size:8,bullet:true});
		y4Value = y4Value + 0.25;
	}
	slide4.addText('SPF Content',   { x:5.5, y:0.6, w:'20%', h:0.38,font_face:'Verdana', font_size:8 ,bold:true, color:'000000', bullet:{code:'2605'} });
	var y5Value = 0.85;
	for(var k in Highlights.spfcontentHighlights){
		slide4.addText(Highlights.spfcontentHighlights[k],{x:5.9, y:y5Value,w:'40%',font_face:'Verdana', font_size:8,bullet:true});
		y5Value = y5Value + 0.25;
	}
	slide4.addText('Engineering Village',   { x:5.5, y:1.8, w:'20%', h:0.38,font_face:'Verdana', font_size:8 ,bold:true, color:'000000', bullet:{code:'2605'} });
	var y6Value = 2.05;
	for(var k in Highlights.engineeringvillageHighlights){
		slide4.addText(Highlights.engineeringvillageHighlights[k],{x:5.9, y:y6Value,w:'40%',font_face:'Verdana', font_size:8,bullet:true});
		y6Value = y6Value + 0.25;
	}
	slide4.addText("Milestones and Targets", {x:5.5,y:2.8,font_face:'Arial (Headings)',font_size:12,color:'089de3', bold:true, valign : 'm', align :'c', w:'45%',fill:'070719' });
	var milestoneHeadRow =[
	{text : 'Milestone', opts: {font_size:8,valign:'m',rowH:0.1, align:'c', bold : true, color:'000000', font_face:'Arial'}},
	{text : 'Target Date', opts: {font_size:8,valign:'m',rowH:0.1, align:'c', bold : true, color:'000000', font_face:'Arial'}},
	{text : 'Status', opts: {font_size:8,valign:'m',rowH:0.1, align:'c', bold : true, color:'000000', font_face:'Arial'}}
	];
	var milestonesTab = {x:5.5,y:3.1,w:4.5};
	var milestonesCel = {fill:'cce5f4',border:{ pt:'1',color:'000000' }};
	slide4.addTable(milestoneHeadRow, milestonesTab, milestonesCel );
	var milestonesDataArray = [];
	/*var milestonesData = {"milestone1":{"milestone":"action1", "targetDate":"status1","status":"remarks1"},"milestone2":{"milestone":"action2", "targetDate":"status2","status":"remarks2"}};*/
	var milestonesData = responseData.milestonesData;
	for(var k in milestonesData ){
		var milestoneRow =[
			{ text:  milestonesData[k].milestone},
			{ text: milestonesData[k].targetDate},
			{ text: milestonesData[k].status}
		];
		milestonesDataArray.push(milestoneRow);
		console.log(actionRowsDataArray)
	}
	var milestoneOptsArray = {x:5.5, y:3.219,w:4.5};
	var milestoneCelOpts ={font_size:8, rowH:0.1,color:'000000',font_face:'Arial',
	valign:'t', align:'l', border:{ pt:'1',color:'000000' }};
	slide4.addTable(milestonesDataArray,milestoneOptsArray, milestoneCelOpts);
	
	
	
	var slide5 = pptx.addNewSlide();
	slide5.addImage({ path:'./images/line.PNG',w:9.5,x:0.4,y:0.2,h:0.1});
	slide5.addImage({path:'./images/footer5.PNG',y:5.12,w:10,h:0.5});
	slide5.addText("Sprint Details", {x:0.4,y:0.4,font_face:'Arial (Headings)',font_size:20,color:'089de3'});
	var sprintDetailsHeadRow =[
	{text : 'Scrum Team Current sprint'},
	{text : 'Offshore POC'},
	{text : 'Onsite POC'},
	{text : 'n-2',opts:{valign:'b'}},
	{text : 'n-1',opts:{valign:'b'}},
	{text : 'n',opts:{valign:'b'}},
	{text : 'Velocity Improvement % in last 2 sprints'},
	{text : 'n-2',opts:{valign:'b'}},
	{text : 'n-1',opts:{valign:'b'}},
	{text : 'n',opts:{valign:'b'}},
	{text :'Remarks'}
	];
	var sprintTab = {x:0.4,y:0.8,w:9.5};
	var sprintCel = {fill:'10a8db',colW:[1.25,1.35,1.1,0.5,0.5,0.5,0.75,0.5,0.5,0.5,2.05],valign:'m',align:'c',color:'ffffff',font_size:10, font_face:'Calibri', bold : true, border:{ pt:'1',color:'000000' }};
	slide5.addTable(sprintDetailsHeadRow, sprintTab, sprintCel );
	var sprintVelocity = [
	{	text : 'Sprint Velocity'}
	];
	var velocityTab = {x:4.1,y:0.8,w:1.5};
	var velocitycell = {rowH:0.4,fill:'10a8db', valign:'m',align:'c', color:'ffffff',font_size:10, font_face:'Calibri', bold : true, border:{ pt:'1',color:'000000' }};
	slide5.addTable(sprintVelocity, velocityTab, velocitycell );
	var sprintVelocityPercent = [
	{	text : 'Commited vs Delivered %'}
	];
	var velocityPercentTab = {x:6.35,y:0.8,w:1.5};
	var velocitycell = {rowH:0.4,fill:'10a8db', valign:'m',align:'c', color:'ffffff',font_size:10, font_face:'Calibri', bold : true, border:{ pt:'1',color:'000000' }};
	slide5.addTable(sprintVelocityPercent, velocityPercentTab, velocitycell );
	var sprintDetailsDataArray = [];
	/*var sprintDetailsData = {"Scopus":{"team":"Scopus","currentSprint":"66", "offshorePOC":"Senthil","onsitePOC":"Saravanan","velocityN":"50","velocityN1":"51","velocityN2":"52","velocityImprovement":"50","cvsdN":"50","cvsdN1":"51","cvsdN2":"52","remarks":"remarksScopus"},
		"ScienceDirect":{"team":"ScienceDirect","currentSprint":"66", "offshorePOC":"Senthil","onsitePOC":"Saravanan","velocityN":"50","velocityN1":"51","velocityN2":"52","velocityImprovement":"50","cvsdN":"50","cvsdN1":"51","cvsdN2":"52","remarks":"sciencedirectRemarks"}
	}*/
	var sprintDetailsData = responseData.sprintDetailsData;
	for(var k in sprintDetailsData ){
		var sprintDetailsRow =[
			{ text:  sprintDetailsData[k].team +" - "+ sprintDetailsData[k].currentSprint},
			{ text: sprintDetailsData[k].offshorePOC},
			{ text: sprintDetailsData[k].onsitePOC},
			{ text: sprintDetailsData[k].velocityN2},
			{ text: sprintDetailsData[k].velocityN1},
			{ text: sprintDetailsData[k].velocityN},
			{ text: sprintDetailsData[k].velocityImprovement},
			{ text: sprintDetailsData[k].cvsdN2},
			{ text: sprintDetailsData[k].cvsdN1},
			{ text: sprintDetailsData[k].cvsdN},
			{ text: sprintDetailsData[k].remarks}
		];
		sprintDetailsDataArray.push(sprintDetailsRow);
		console.log(sprintDetailsDataArray)
	}
	var sprintDetailsOptsArray = {x:0.4, y:1.485};
	var sprintdetialsCelOpts ={font_size:10,rowH:0.5,color:'000000',font_face:'Arial',colW:[1.25,1.35,1.1,0.5,0.5,0.5,0.75,0.5,0.5,0.5,2.05],
	valign:'m', align:'c', border:{ pt:'1',color:'000000' }};
	slide5.addTable(sprintDetailsDataArray,sprintDetailsOptsArray, sprintdetialsCelOpts);
	
	
	
	
	var risk1 = 'Elsevier RP - Context: For SDFE CI migration work the team needs to work on microservices development with latest and greatest technologies (Spring Boot, AWS Lambda, Hystrix, Apache Camel, ReactJS, NodeJS). The team does not have enough knowledge on the technologies. Condition: If the team does not gain knowledge, the risk will surely occur. Consequence: Project failure and revenue loss'; 
	var slide6 = pptx.addNewSlide();
	slide6.addImage({ path:'./images/line.PNG',w:9.5,x:0.4,y:0.2,h:0.1});
	slide6.addImage({path:'./images/footer6.PNG',y:5.12,w:10,h:0.5});
	slide6.addText("Risks & Dependencies", opts);
	var riskRow = [
    [{ text: 'Risk', opts: {font_size:14,valign:'m',rowH:0.2, align:'c', bold : true, color:'ffffff', font_face:'Arial'}},
	 { text: 'MitigationPlan', opts: { font_size:14, rowH:0.2, valign:'m', align:'c', bold : true, color:'ffffff', font_face:'Arial'}},
	 { text: 'Status', opts: {font_size:14, valign:'m', rowH:0.2, align:'c', bold : true, color:'ffffff', font_face:'Arial'}}],
	 ];
	var riskTabOpts1 = { x:0.5, y:0.8,w:9};
	var riskCelOpts1 = {
    font_size:10, rowH:0.4,colW:[5,2,2],fill:'10a8db',color:'000000',
	valign:'t', align:'l', border:{ pt:'1',color:'ffffff' }};
	slide6.addTable( riskRow, riskTabOpts1, riskCelOpts1 );
	var riskRows = [];
	var riskRows1 =[
		{ text:  'risk1', opts: {font_size:10,valign:'t', align:'l', bold : true,font_face:'Arial'}},
		 { text: 'mitigation1', opts: { font_size:10, valign:'t', align:'l', bold : true, font_face:'Arial'}},
		 { text: 'status1', opts: {font_size:10, valign:'m', align:'c', bold : true, font_face:'Arial'}}
	 ];
	 var riskRows2 =[
		{ text:  'risk2', opts: { valign:'t', align:'l', bold : true, font_face:'Arial'}},
		 { text: 'mitigation2', opts: { valign:'t', align:'l', bold : true, font_face:'Arial'}},
		 { text: 'status2', opts: { valign:'m', align:'c', bold : true, font_face:'Arial'}}
	 ];
	 riskRows.push(riskRows1,riskRows2);
	 var riskTabOpts2 = { x:0.5, y:1.2,w:9};
	 var riskCelOpts2 = {
    font_size:10, rowH:0.4,colW:[5,2,2],fill:'87CEFA',color:'000000',
	valign:'t', align:'l', border:{ pt:'1',color:'ffffff' }};
	slide6.addTable( riskRows, riskTabOpts2, riskCelOpts2 );
	
	var slide7 = pptx.addNewSlide();
	slide7.addImage({ path:'./images/lastslide.PNG',w:10, h:5.62 });
	alert("1");
	
	var imageData ="iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAgAElEQVR4Xu2dCZxPVf/Hv7Mww5gxZgoZZCukhIZRGIpmJDw8aaOaZKlQaCEeCikpipQlqRTaZkw9qWwRskyGJGuyzTCGGsb2mDGL557LjxnzW85dzvn97tzPfb3+r3r+zjnfe97f692553fv/fpdUA7CIZzA6dOnKTg4mMqUKSM8liNAYWEhsbgVK1aUFpMFysnJUeOx+co8Tp48SaGhoeTv7y8tbF5enjpfFheHeAJ+EJZ4yCwChCWeM4QlnrG3I0BYkjIAYYkHDWGJZ+ztCBCWpAxAWOJBQ1jiGXs7AoQlKQMQlnjQEJZ4xt6OAGFJygCEJR40hCWesbcjQFiSMgBhiQcNYYln7O0IEJakDEBY4kFDWOIZezsChCUpAxCWeNAQlnjG3o4AYUnKAIQlHjSEJZ6xtyNAWJIyAGGJBw1hiWfs7QgQlqQMQFjiQXtDWJsPZFH2mf/RTTWvpaphcl9FEk/U9yJAWJJyAmGJBy1TWIezz1GfTzbSrszTlyc2pMONNKTDDeInauMIEJak5ENY4kHLFNbL326jT9cfLDGpDSPbY6UlMNUQlkC4RYeGsMSDlimshz7YQBv2ZZWY1Bf9W1LLOpHiJ2vTCBCWpMRDWOJByxRWv09TadmOoyUm9d9Bralxdbmf8xFP1nciQFiScgFhiQctU1hfbkyn4Ulbi02qQdVQWjwkVvxEbRwBwpKUfAhLPGiZwmKzcdwWRoUHU/uGVejJtnUpKryc+InaOAKEJSn5EJZ40LKF1fL1nyjzVA4l9m1G0fWuEz9BRCAIS9JFAGGJBy1TWH8ePU1x76ymKqFBtPzZGHwiWXx61QgQliTQEJZ40DKFNXPVXnrjx130YHR1GhVfB8ISn14ISxJjNQyEJZ62TGE9MGs9/br/OM3o2YRa1w6DsMSnF8KSxBjCkgRalrBO5+RTk3FL1Vn9Nuou8ivIg7Ak5Ri3hJJAY4UlHrQsYS3aeoQGLdhMbW64hj56rBnKfIlP7eUIthdWbm4uzZs3jyIiIqh79+7F0CcnJ9P06dOL/f86d+5MgwcP1pwiCEszMs0dZAnr+a9+p6TNh+jlzjfRozHVISzNmdLfwdbCSk1NpREjRqj0BgwY4FRYaWlpugR1dUogLP0XKW9PGcJiZYdvG7+Mjp89TytfaEfVK5aFsHgTZEI7WwvLwY+tpNjhbIXlSVi8hbPPnDlDQUFB0is/s7hhYWEmXCr8Q3ir8vOpU6eoQoUKQis//56eTd2mr6OaEeVp1YvtiFV+Zqt0Fpfn8PPz42mGNi4IQFgKGHfCctwShoSEUNeuXalXr16qeBxHdnY218XFxOaNi9VbcbmgmNxIxlxnrEmjWWvTqWd0NRrWobY6Ay1xw8PDTZ61vYaDsNwIq+ilkJGRQePGjaP4+PgSKzGeSwa3hDyUjLWRcUvYZdov9Mfhk/RZnxh1052tsNiKMjQ01NjJozcXAQiLU1iMJluJebpFdEUdwuK6Hg01Ei0stm/V7NVlVK5MAG0dE0dlAvwhLEMZ094ZwtIgrKSkJDp06JCuTXgIS/vFqbWHaGF9nZpOLyZupbtvqkKzH4tWTw8rLK1ZMtYewnIhLLbMX7hwIcXGxlJUVJS6spo4cSIlJCRQTEyMZuoQlmZkmjuIFtbT8zbRj9syacK/b6GHW9SEsDRnyHgHWwur6GMNDpQTJkyg6OhoKigoUG8BExMTKSsriyIjI6l3794UFxena/McwjJ+sXoaQaSwCgov0M2vLKFzeQVU9DPIWGF5yoq5f25rYZmL0v1oEJZ42iKFtX5vFj08ewM1vC6Mfhzc5vJkICzxeS0aAcKSxBvCEg9apLBe+34nzV6zjwbcWY+GxdeHsMSn02kECEsSeAhLPGiRwmo/eRXt/fsMJT59B0VfXwnCEp9OCMtLjNWwEJZ4+qKExb4qyr4uGhocSFtfiVf2MK/MBbeE4vOKW0K5jCEsSbxFCWvuugP0yn+3U9dbq9G7DzctNhsIS1JyL4XBLaEk3lhhiQctSlgJH/1Kq/78m6Y82IS6NY2CsMSn0mUECEsSfAhLPGgRwsorKKSbXl5C+co/t46JV28Lix5YYYnPK24J5TLGLaEk3iKE9dPOY9Rn7kZqVrMSLRxwR4mZQFiSkotbQrmgscISz1uEsP6TvI3mpxykF+Lq06C76kFY4tPoNgJuCSUlAMISD1qEsBy1B79/tg01qlbyu2JYYYnPK24J5TLGLaEk3mYLa3fmaYqfspoiQsrS5tF3O50FhCUpubgllAsaKyzxvM0W1gyl9uBEpfbgQ81r0Bv3NYawxKfQYwTcEnpEZE4DCMscju5GMVtYjtqDsx69jeIbVYWwxKfQYwQIyyMicxpAWOZwlCWsorUHt42NVz/a5+zALaH4vGIPSy5j7GFJ4m3mCmvR1gyl9uBv1KreNTS/r+vvn0FYkpKLPSy5oLHCEs/bTGE999UWWrj5MI1Wag/2aX2x2ARWWOJz6CkCbgk9ETLpzyEsk0C6GcYsYV1de7D2NSEQlvj0cUWAsLgwGW8EYRln6GkEs4S1hdUefH+tWntw9bA73YbFLaGnrJj75xCWuTxdjgZhiQdtlrDeXvYnvfvTHurdqha90qURhCU+ddwRICxuVMYaQljG+PH0NktYnZXag9uU2oOfPtGCYm+8FsLigS+pDYQlCTSEJR60GcJyVnvQ3ZnjllB8XotGgLAk8YawxIM2Q1hfKbUHhym1BzsotQc/vFR7EMISnzveCBAWLymD7SAsgwA5upshrKeU2oOLldqDr3e/hXrGXKw9CGF5oiDvzyEsSawhLPGgjQrLVe1BCEt87ngjQFi8pAy2g7AMAuToblRY65Tagz2V2oMNqobS4iGxHBFRqp4LkomNICwTYbobCsISD9qosMZ/v4M+XLOfnm5Xl4Z3bMB1wth058JkWiMIyzSU7geCsMSDNiqsuyb/TPv+PktfP3U7Na8VwXXCEBYXJtMaQVimoYSwHARycnLUfw0ODpZE92IYI8JKO/4/in1zpdPag+4mAWFJTTFBWJJ4Y4UlHrQRYX2i1B4co9Qe7KLUHpx2Ve1BCEt87ngjQFi8pAy2g7AMAuTobkRYjym1B1crtQffUWoPdr+q9iCExQFfUhMISxJoCEs8aL3COpdXQI3HLHVZexDCEp873ggQFi8pg+0gLIMAObrrFdbynUep79xUaloznJIHtOKIdKUJ9rA04TLcGMIyjJBvAAiLj5ORVnqFNTL5D1qQkkbP3X0jPdv+Bk2nAGFpwmW4MYRlGCHfABAWHycjrfQKy1F7cNEzrenmqIqaTgHC0oTLcGMIyzBCvgEgLD5ORlrpEdauI6eo49Q1bmsPYg/LSFbM7QthmcvT5WgQlnjQeoQ142el9uDiXfRAdA16s4fz2oMQlvjc8UaAsHhJGWwHYRkEyNFdj7Dun7meNh44TjMfuY063uy89iCExQFfUhMISxJoCEs8aK3CYrUHG49ZQv7+fuSu9iCEJT53vBEgLF5SBttBWAYBcnTXKqzvfs+gZz7/je6oG0kL+rXkiFCyCTbddWHT3QnC0o1OW0cISxsvPa21Cmvol1so+bfDNOrehtS3TR09IQnC0oVNdycISzc6bR0hLG289LTWIixWe7Dx2CXEbgt/er4t1b22gp6QEJYuavo7QVj62WnqCWFpwqWrsRZhbU47Qf+evo6qhgXThpHtdcVjnbDC0o1OV0cISxc27Z0gLO3MtPbQIqzJS3fTtBV/0eN31KIxXd3XHnR3HhCW1iwZaw9hGePH3RvC4kalu6EWYd377hrannGK5iq1B9t6qD0IYelOiekdISzTkTofEMISD5pXWI7ag2UC/GnHuHhi/9R7YIWll5y+fhCWPm6ae0FYmpFp7sArrC82ptNLSVupfYPKNOfx5prjFO0AYRnCp7kzhKUZmb4OEJY+blp68Qrryc820ZLtmfRat5upV8vrtYQo0RbCMoRPc2cISzMyfR0gLH3ctPTiEZae2oPYw9KSBbFtISyxfC+PDmGJB80jrF/++oce+TCF6lcJpSVD+WoPQljic8cbAcLiJWWwHYRlECBHdx5hvbpoB835ZT891bYuvXQPX+1BCIsDvqQmEJYk0BCWeNA8wrpz0s+0/5+z9NWTt1OL2ny1ByEs8bnjjQBh8ZIy2A7CMgiQo7snYRWtPbjl5TgKUL7SYPTAprtRgtr6Q1jaeOluDWHpRsfd0ZOwPlq7n8Z9t4M6N65G7/Vsyj0uVlimoDJlEAjLFIyeB4GwPDMy2sKTsB6d8yut2fM3TX7gVrqvWXWj4dT+WGGZgpF7EAiLG5WxhhCWMX48vd0Jq2jtwU2j71a/4W7GAWGZQZF/DNsLKzc3l+bNm0cRERHUvXv3YuSys7Np9uzZtGLFCipfvjwlJCRQp06dKDAwkJ/wpZYQlmZkmju4E9ayHUep36ep1KRGOH0zUFvtQdwSak6FsA62FlZqaiqNGDFChTtgwIBiwiooKKCZM2eqf9avXz86ceIEjR8/nvr06UNNmjTRnBAISzMyzR3cCWvkQqX24K9pNFSpPThYY+1BCEtzKoR1sLWwHFSTk5PVfy26wmIX/9ixY2nQoEFUp87Fr1EmJSWp4urbt+/lhJw7d44rOefPn1dXZv7++l+05QpUpNEF5St1LG5QUJDWroba5+fnq/31rESNBGar5bJly5KfX8lf/9q9vZaOns6lxP7NqdF1oUbCFOtbWFhIbL4sLs9Rrlw5nmZo44IAhKWAcSasffv20dSpU2nMmDFUqVIlFV9KSgotWrSIRo0adVkCOTk5XBcX+8vE/gIHBARwtTejERMWixscHGzGcMXGcCYFRwNvCYvlgsn56nPblXma/jUjhSqVL0Mbhrc1lQVbibP58v5HgbedqSdZigaDsDQIi91CMrmNHj1aswRwSyj+b42rW8L3V/5Fby3ZTfcrtQff0lF70N2ZY9NdfF6LRoCwNAjL2QqLN10QFi8p/e1cCavHjHWUevAEzVBqD96jo/YghKU/J2b3hLBcCMvVHlZmZiYNHDhQcx4gLM3INHdwJiwzag9CWJpTIawDhOVCWGxvgu1hsT0H/Eqo7fpz7OuJ2DtzdybOhPXtlgwa/MVvdLtSe/BznbUHISxt+RfZ2tbCKvpYgwPyhAkTKDo6Wv2f7DmsadOm0bp16/Acloar0JeENUSpPfiNUntwZKeG1D9WX+1BCEtD8gU3tbWwBLMtNjxuCcXTvnqFVbT24PLn2lK9yvpqD0JY4nPHGwHC4iVlsB2EZRAgR/erhbVJ2Wi/T9lwN1p7EMLigC+pCYQlCTSEJR701cJijzKwRxoeu/16Gvevm4WcAB5rEILV5aAQliTeEJZ40FcLq5NSe3CHUnvwk97NqV39ykJOAMISghXCkou1ZDQIS3wGigrLzNqDuCUUnzveCFhh8ZIy2A7CMgiQo3tRYX2uvOg8Qnnh+S6l9uBHBmsPQlgc8CU1gbAkgYawxIMuKqz+Su3BpUrtwfFK7cFHDNYehLDE5443AoTFS8pgOwjLIECO7g5hFVwgajxmKbGP9m0Y2V79lVDUgT0sUWSdjwthSeINYYkH7RDW2r3H6dE5KXSjUntwqQm1B7HCEp873ggQFi8pg+0gLIMAObo7hPXq97voY6XghFm1ByEsDviSmkBYkkBDWOJBO4TVbtIqYiW9vuzfkmLqRAoNjFtCoXhLDA5hSeINYYkHzYT1T64/tX97NYUGB5JZtQexwhKfO94IEBYvKYPtICyDADm6M2Elbs2iV7/fSffech2936sZRy9jTbDCMsZPa28ISysxne0hLJ3gNHRjwhrw1U5auzeLJt+v1B68zZzag1hhaUiC4KYQlmDAjuEhLPGgj2adoDsmr6fCwgtkZu1BCEt87ngjQFi8pAy2g7AMAuTo/s3GfTQkaSfdWj2cvh1kXu1BCIsDvqQmEJYk0BCWONBHTubQgpQ05UN9hyj9xDnqoRSbmGRysQlXZ489LHF5dTYyhCWJN4QlBnSBcvvX4e1VtP+fs8UCfP3U7dS8VoSYoEVGhbCEIy4WAMKSxBvCEgPaUYL+6tH7tK5NozvfJCYohCWcq6sAEJYk9BCWGNCJmw7RC1//XmJw9gsh+6VQ9IEVlmjCxceHsCTxhrDEgE7Zl0UPfrChxODP3X0jPdv+BjFBscISzhUrLK8hvhgYwhKTAFZo4pYxS+hMbv7lAPWrhqolvSJCyooJCmEJ5wpheQ0xhCUS/bwNB2nUN9sorFwZeqF9Lap5bbiwzyE7mwduCUVmt+TYuCWUxBsrLPNBnzyXR7FvriT2z7cfaELt61ag0NBQ8vf3Nz+YixEhLGmo1UAQliTeEJb5oF/573aau+4A3VpDeVB0YCtyVvnZ/KjFR4SwRBMuPj6EJYk3hGUu6D3HzlDHKavV13B+GNyGGl4XBmGZi9gnR4OwJKUFwjIX9AOz1tOv+4/Tg81r0MT7GquDY4VlLmNfHA3CkpQVCMs80EuU4hJPKkUmQoICac2wOy//GghhmcfYV0eCsCRlBsIyB/T5/EJqN+lnysg+pz7Jzp5odxwQljmMfXkUCEtSdiAsc0C/t+IvmrR0N10fWZ5WPN+OAvz9ICxz0FpiFAhLUpogLOOgj53OpbbKYwysfNe8vjHUut41xQbFCss4Y18fAcKSlCEIyzjoIV9uUT4hc5g63FSFPnwsusSAEJZxxr4+AoQlKUMQljHQW9Kzqdv7aykwwI9Wv3gnVQsvB2EZQ2rJ3hCWpLRBWPpBs/cF7522hnZknKIBd9ajYfH1nQ6GFZZ+xlbpCWFJyhSEpR/0lxvTaXjSVqocGkSrlMcYypUJgLD047R0TwhLUvogLH2gzypfYWijbLQfP3uepjzYhLo1jXI5EFZY+hhbqReEJSlbEJY+0K8pNQZnr9l3+X1Bd6NAWPoYW6kXhCUpWxCWdtAHss6q32svKLjyviCEpZ1jaeoBYUnKJoSlHfSjc1JozZ5/6CHlfcE3Lr0vCGFp51iaekBYkrIJYWkDvWLXMXrik40l3heEsLRxLG2tISxJGYWw+EHnFxQqt4Krid0Svqy8L/hEkfcFISx+jqWxJYQlKasQFj/oD1bvo9d/2En1KlegJUNii70vCGHxcyyNLSEsSVmFsPhAs8cX2GMM7HEGrcVQ8SshH2Mrt4KwJGUPwuID/WLiVvo6NZ3iGlWlDx69ja/TpVYQliZclmwMYUlKG4TlGTR79abTu2uobKA//fxCO6fvC+KW0DPH0twCwpKUXQjLM2j2cjN7yXnQXfXohTjn7wtCWJ45luYWEJak7EJY7kEnK5+NGap8PsbT+4IQlqQL1kfDQFiSEgNhuQbNPsjHPszHPtD37sNNqeut1XRlBXtYurBZqhOEJSldEJZr0G8u2U3TV/7F9b4gVliSLlgfDQNhSUoMhOUcNCsmEfvWSu73BSEsSResj4aBsCQlBsJyDrq/Uq5rqVK2q2eLmvT6v28xlA3cEhrCZ4nOEJakNEFYJUGzQqisICqrL7jupbuoYrkyhrIBYRnCZ4nOEJakNEFYxUEXKCXmWal5VnL+lS6NqHerWoYzAWEZRujzA0BYklIEYRUH/fHaAzT2u+2a3xfEHpakC9ZHw0BYbhKTnJxM06dPL9aic+fONHjwYM3phLCuIDt5Lo/ueGOFrvcFISzNl16p6gBheRBWWlqaLkFdPSyEdYXIf5K30fyUg9Tx5qo08xFt7wtCWKXKP5onA2EZFNYFVoOK4zhz5gwFBQVRmTLGNpY5Ql1uUlhYSCxuWFiYlm6G2+bk5KhjBAcHlxiL7VnFv7OayijvC658vq3m9wXdndypU6eoQoUK5O/vb3gOvAPk5eVRbm6uGpfn8PPz42mGNi4IQFgehOW4JQwJCaGuXbtSr169VPE4juzsbK6Li4nNGxert+K6gvLE/D9oc/op6t+qBg1oU5OLHW8jb81VS9zw8HDe6aCdEwIQFudlkZGRQePGjaP4+Hjq3r07Z68rzXBLSLRo6xEatGCzofcF3YHHr4SaL0vLdYCwNKSMbcLr3dOyu7DO5xdS64kr1PcF3+vZlDo31ve+IISl4YIthU0hLA1JTUpKokOHDunahLe7sKYs30NTlv9JzWtFqF8SFXFghSWCqm+NCWG5yAfbOF64cCHFxsZSVFSUurKaOHEiJSQkUExMjOYs2llYbFXFVld5yipr2XNt1WevRBwQlgiqvjUmhOUiHwUFBcRuARMTEykrK4siIyOpd+/eFBcXp2vz3M7CYvtWbP+qV8z19Fr3m4X9DYCwhKH1mYEhLEmpsKuwHO8LsvcEVw+70/D7gtjDknTB+mgYCEtSYuworKCgYIp7Z5X6vuDYro0o4Y5aQmljhSUUr08MDmFJSoMdhbXw92M0MvkPU98XxApL0gXro2EgLEmJsZuwWF3Bu6asI/beoNb6gnpTghWWXnLW6QdhScqVHYTFvs3+2vc7acPef+ifM7mUfS6f4pX3BWeZ+L4gVliSLlgfDQNhSUqMHYT1zOe/0Xe/ZxQj2qFhFfowIVoKZaywpGD2ahAISxJ+Owir/qgfKVd51qroERQYQLvHd5RCGcKSgtmrQSAsSfhLu7DYF0TrjvzBKc29r3eiAH/xXymAsCRdzF4MA2FJgl/ahZV2/H/U4e1VxN4ZLHo0qRFO3wxsJYUyhCUFs1eDQFiS8JdmYW08cJz6zk1VfxEsVyaA2OY7O2pFhtAb991CLetESqEMYUnB7NUgEJYk/KVVWGyTfehXWyi/4AI9rJTqYq/e/HXk4jfCbqxWSRLdi2EgLKm4vRIMwpKEvTQKa9LS3fTeir/IX/mK5qjODemJVrVVmu6+OCoSN4Qlkq5vjA1hScpDaRJWXkEhsUcYFm/LVG8B3+vZjNo3rHyZJIQl6aKyYRgIS1LSS4uwjp89T098spG2pGfTNRWCaF6fFtTguuLfjIewJF1UNgwDYUlKemkQFnuJOeGjXykj+xzdoHzT6rO+MVQ1rGShCQhL0kVlwzAQlqSkW11Y6/dmqb8Enj2fT7fXjVSfXg8pG+iUHoQl6aKyYRgIS1LSrSysz39No1HfbCP2cOh9zarTmz0au30QFMKSdFHZMAyEJSnpVhQWK7n4+g87afaafcSeUx/WsQE93a6uR2IQlkdEaKCTAISlE5zWblYTFnv4c9D8zfTTrmNUJsCfpj3cVK3UzHNAWDyU0EYPAQhLDzUdfawkLPZpmEc+TKFdmafVTxrPfaIFsVdseA8Ii5cU2mklAGFpJaazvVWEtevIKXr8442UeSqHal8TosqqZkR5TbOGsDThQmMNBCAsDbCMNLWCsFb/+Tc9+dkm9V1AVj/wo8ebU2iw818C3bGAsIxcKejrjgCEJen68HVhfbR2P41ftJMKlZ32LrdWo3ceuJUClb0rPQeEpYca+vAQgLB4KJnQxleFxQT1n+RtxB5dYMeQDjco/3ejoRlDWIbwobMbAhCWpMvDF4XFHgJ9et5mYreCgQF+yqqqibq6MnpAWEYJor8rAhCWpGvD14TFNtUfVX4JZK/bsH0qtl/F9q3MOCAsMyhiDGcEICxJ14UvCeuPwyept/JLIHt8oVp4OZqvvBPIfhE064CwzCKJca4mAGFJuiZ8RVjskzCDv/hNLRZxS1RF9bGFiJCyplKAsEzFicGKEICwJF0OviCsGT/vpTcX7yLljRv1qfWpDzWloEB9vwS6wwZhSbqobBgGwpKUdNnCYt9XX7o9k46eOEO1qoTTSuUVm6TNh9TZPtW2Lr10TwNhM4ewhKG1/cAQlqRLQKaw0pUKNj1mrqejysb6lcNP+cICqV9aYF9cEHlAWCLp2ntsCEtS/mUK651lf9LUn/aUmNnwjvWVry3UEz5jCEs4YtsGgLAkpV6msPp9uomW7cgsMbO3lNXV/dE1hM8YwhKO2LYBICxJqZchrKRNh+izDQfV7607O9izVnc1uFIsQtTUISxRZDEuhCXpGhAlLLZPNU+R1ALl1ZqsM+fV2YQpn4Q5m5uvfiHUcbBHGL57prWU2UJYUjDbMgiEJSntZgsrZV8WzV1/UP0lMP+SmBpUDaXeSm3Abk2j6PCJc/TjtiPqr4R1q4bTQ0qRUxGPMDjDB2FJuqhsGAbCkpR0M4SVo3z2ZeHmwzR33QHaffS0euYB/n4Ud1MVVVQtahd/taawsJBY3IoVK0qa5cUwEJZU3LYKBmFJSrcRYaUpjyl8vPYAJW5Kp9M5+eoZVypfVlk11aDH76hFVZyU2mJtICzxyc3Ly1MFHRoaKj4YIhCEJeki0CosVgBihfKw59z1B2iN8jUFx25UQ6Voae9Wtahbkygq6+EpdQhLfHIhLPGMi0aAsCTx5hXWKeUJ9S82pqsb6Wxl5bjti29UVV1NXX3b5+70ISzxyYWwxDOGsOQyVqN5EhYr+PCx8tXPb7dkENurctz2PRxTkxJuv97lbR+EdYXAyZMn1Vszf3/z3490xRnCkvuXCSssSbydCSu/oFD5JS9T3URPPXji8pncVC1MXU3x3PZBWBCWpEvYJ8JAWILTcDj7HM1atZd2ZpxUn4+Ka3Sd+vDm/BTl2amUNDp2Olc9g0Dl1z5225eg8bYPwoKwBF/CPjU8hCU4HR2nrFbr+xU9/BU5FV56dop9i4o9I6X3tg/CgrAEX8I+NTyEJTAdWw+dpK7v/eI0Qv0qodS3TW2h7/Zh011gci8NjT0s8YyLRoCwBPLeoDyN/tAHG0pEaKTsUX3/bBuBkS8ODWEJR0wQlnjGEJYkxqzQQ8vXfyoR7THlV79x/7pZ+FlAWMIRQ1jiEReLgBWWYOBTlu+hKcv/vByFve83R/lqQpRS/EH0AWGJJkwQlnjEEJZkxsRWWjvS/qbwCuWpWa1IaeEhLPGocUsonjFuCeUyVqN5enBUxClBWCKoFh8TwhLPGIEevNoAAAeJSURBVMKSyxjCksQbT7pLAu3FMNjDkgQfKyzxoCEs8Yy9HQHCkpQBCEs8aAhLPGNvR4CwJGUAwhIPGsISz9jbESAsSRmAsMSDhrDEM/Z2BAjLTQays7Np9uzZtGLFCipfvjwlJCRQp06dKDAwUHPeICzNyDR3gLA0I7NcBwjLRcoKCgpo5syZ6p/269ePTpw4QePHj6c+ffpQkyZNNCcawtKMTHMHCEszMst1gLBcpIxd/GPHjqVBgwZRnTp11FZJSUmquPr27Xu516xZs7iSfv78eXVlJvPjcheU7yyzuEFBQVznaFaj/PyL353XsxI1cg65ublUtmxZ8vPzMzKMpr7sWTc2XxaX53jyySd5mqGNCwIQlgsw+/bto6lTp9KYMWOoUqVKaquUlBRatGgRjRo16rIEEhMTuS4u9peJ/QUOCAjgam9GIyYsFjc4ONiM4bjH8JawWDEIJmeZwmIrcTZf3v8o9OjRg5sjGpYkAGFpEFZqaiolJyfT6NGjNUsAt4Ti//rhllA8Y29HgLA0CMvZCsvbCUR8ELATAQjLRbZd7WFlZmbSwIED7XSNYK4g4DMEICwXqWB7E2wPi+1NmPEroc9kHCcCAhYmAGG5SR57DmvatGm0bt06w89hWfgawamDgM8QgLB8JhU4ERAAAU8EICxPhEz4c/Zowbx58ygiIoK6d+9uwoiuh2CPMuzcuZPmzJlD27ZtUx/JYE/ox8fHC30GjN1CL1++nBYsWEAZGRkUFhZm6M0APZDY4wUffPABHT58WNcvuVpisl+Lp0+fXqxL586dafDgwVqGQVuNBCAsjcC0NmePQowYMULtNmDAAOHCYs8ivfHGG9S8eXO65557aM+ePfTaa6/R8OHDqVGjRlpPn7s9i8uk3KFDB6pZsyYdO3aMxo0bR/3799f1ZgB34EsNmazmz5+vvkZVvXp1KcJKS0uDoLQmymB7CMsgQN7u7L/I7BC9wmLi2L59OzVr1kx9gJL971dffZVatmxJXbp04T1dw+3YSm/KlClUq1Yt4XNmsb799ltiv+Cy16a+++47CMtwBn1zAAhLUl5kCevq6bDHM9iDrux1osaNG0uZLRPI7t271ZXd888/L3SFxWIxQbGV5NNPP007duzQ/XCvFjhFbwlDQkKoa9eu1KtXL+4n3rXEQtsrBCAsSVeDN4Tl2NM5e/YsDR06VMq7fexdSyap9PR09S8xe3eO9z07PanYuHEjLV68WI3Jvqhh5G0EPfFZH7Znx25/2T6h6BW03nMsLf0gLEmZlC0s9lIuu03avHmzun9VoUIFSTO9GIat7CZNmkRt2rShuLg4YbGdbX6zYDVq1KDJkydffg9U2AlcGpidB/a0RFMmgrDEM1YjyBSWYwP64MGD9Nxzz0mXlQOpN/4Se2OFxebLvuRx6NAhbMIL/vsEYQkGXPQvL/t30bcM7HMyM2bMILa3w/Z0eL8iYBQDW1Gxv7T33nsvVa5cmY4cOaJ+P6xbt25CV1hXn7cMYbEfMhYuXEixsbEUFRWlrqwmTpyoPsYRExNjFCX6uyEAYQm+PIo+1uAINWHCBIqOjhYSuegeUtEALVq0EPrLGRPl119/rW6AZ2VlUWRkJPXs2VP3F1r1wpEhLPbMGVs9sk8LOebau3dvVcwyP22jl5GV+0FYVs4ezh0EbEYAwrJZwjFdELAyAQjLytnDuYOAzQhAWDZLOKYLAlYmAGFZOXs4dxCwGQEIy2YJx3RBwMoEICwrZw/nDgI2IwBh2SzhmC4IWJkAhGXl7OHcQcBmBCAsmyUc0wUBKxOAsKycPZw7CNiMAIRls4RjuiBgZQIQlpWzh3MHAZsRgLBslnBMFwSsTADCsnL2cO4gYDMCEJbNEo7pgoCVCUBYVs4ezh0EbEYAwrJZwjFdELAyAQjLytnDuYOAzQhAWDZLOKYLAlYmAGFZOXs4dxCwGQEIy2YJx3RBwMoEICwrZw/nDgI2IwBh2SzhmC4IWJkAhGXl7OHcQcBmBCAsmyUc0wUBKxOAsKycPZw7CNiMAIRls4RjuiBgZQIQlpWzh3MHAZsRgLBslnBMFwSsTADCsnL2cO4gYDMCEJbNEo7pgoCVCUBYVs4ezh0EbEYAwrJZwjFdELAyAQjLytnDuYOAzQhAWDZLOKYLAlYmAGFZOXs4dxCwGQEIy2YJx3RBwMoEICwrZw/nDgI2IwBh2SzhmC4IWJkAhGXl7OHcQcBmBCAsmyUc0wUBKxOAsKycPZw7CNiMAIRls4RjuiBgZQIQlpWzh3MHAZsRgLBslnBMFwSsTADCsnL2cO4gYDMCEJbNEo7pgoCVCUBYVs4ezh0EbEYAwrJZwjFdELAyAQjLytnDuYOAzQhAWDZLOKYLAlYmAGFZOXs4dxCwGQEIy2YJx3RBwMoEICwrZw/nDgI2IwBh2SzhmC4IWJkAhGXl7OHcQcBmBCAsmyUc0wUBKxOAsKycPZw7CNiMAIRls4RjuiBgZQIQlpWzh3MHAZsRgLBslnBMFwSsTADCsnL2cO4gYDMCEJbNEo7pgoCVCUBYVs4ezh0EbEYAwrJZwjFdELAygf8DEZudP20ci5EAAAAASUVORK5CYII=";
	var slide8 = pptx.addNewSlide();
	slide8.addImage({path:"data:image/png;base64," + imageData,w:10,h:5.62});
	pptx.save();
		});
	
}	
});

/*Code for actionItems*/
app.controller('pmrCtrl', function($scope,actionService) {

 $scope.actions=[];
 $scope.risks=[];
 $scope.risk={item:'',status:'',remarks:''};
 $scope.action={title:'',mitigation:'',status:''};
 $scope.divCount=[{}];
  
  $scope.addAction=function(action)
  {
	  $scope.action.item='';
      $scope.action.status='';
      $scope.action.remarks='';
    }
    
 $scope.onSubmit=function(action)
    {
        $scope.data=actionService.postData($scope.actions);
    }

$scope.onSave=function(action)
    {
             $scope.actions.push(angular.copy(action));
    }


$scope.addRisk=function(risk)
  {
      $scope.risk.title='';
      $scope.risk.mitigation='';
      $scope.risk.status='';
    }
    
 $scope.onSubmitRisk=function(risk)
    {
        $scope.data=actionService.postData($scope.risks);
    }

$scope.onSaveRisk=function(risk)
    {
             $scope.risks.push(angular.copy(risk)); 
    }
});

app.service("actionService",function(){
    this.postData=function(action){
        return action;
    }
app.service("actionService",function(){
    this.postRisk=function(risk){
        return risk;
    }

})
})


