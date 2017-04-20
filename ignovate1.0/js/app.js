var app = angular.module('myApp', []);
app.config(function ($routeProvider) {
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
		.when('/scopus', {
			templateUrl: 'views/admin.html',
			controller: ''
		})
.when('/science', {
			templateUrl: 'views/science.html',
			controller: ''
		})
.when('/ae', {
			templateUrl: 'views/ae.html',
			controller: ''
		})
.when('/content', {
			templateUrl: 'views/content.html',
			controller: ''
		})
.when('/enriched', {
			templateUrl: 'views/enriched.html',
			controller: ''
		})
.when('/ev', {
			templateUrl: 'views/ev.html',
			controller: ''
		})
		.otherwise({
			redirectTo: '/'
		});
});

app.controller('LoginController', function ($scope, $http, $location) {
	$scope.userName = "";
	$scope.password = "";

	$scope.validateUser = function () {
		alert("clicked");
		alert($scope.userName);
		var userName = $scope.userName;
		var password = $scope.password;
		var isValid = false;
		$http.get("https://api.mlab.com/api/1/databases/ignovate/collections/ignovate/58f3dae7734d1d3b89bacccb?apiKey=kfyfdb2b9TdKzrhoilhM6VkdAznffFlA")
			.then(function (response) {
				console.log(response.data);
				var users = response.data.users;
				console.log(users);
				console.log($scope.userName);
				for (var k in users) {
					console.log("username is" + userName);
					if (users[k].user == userName && users[k].password == password) {
						isValid = true;
					}
				}
				console.log(isValid)
				if (isValid && userName == "admin") {
					console.log($location.path());
					$location.path("/admin");
				} else if (isValid && userName !== "admin") {
					$location.path("/actionItems");
				}
			});
	}
});

app.controller('AdminController', function ($scope, $http, graphService) {

	$scope.generatePPT = function () {
		var responseData = "";
		$http.get("https://api.mlab.com/api/1/databases/ignovate/collections/ignovate/58f3dae7734d1d3b89bacccb?apiKey=kfyfdb2b9TdKzrhoilhM6VkdAznffFlA")
			.then(function (response) {
				responseData = response.data;
				console.log(responseData.users);
				var pptx = new PptxGenJS();

				var slide1 = pptx.addNewSlide();
				slide1.addImage({ path: './images/layout1.PNG', w: 10, h: 5.62 });

				var slide2 = pptx.addNewSlide();
				var opts = { x: 0.4, y: 0.4, font_face: 'Arial (Headings)', font_size: 25, color: '089de3' }
				slide2.addText("Agenda", opts);
				slide2.addText(
					'Action Items from last PMR \nProject Highlights \nSprint and Defect Metrics \nCode Quality Report \nRisks & Dependencies',
					{ x: 0.4, y: 2, color: '025774', font_size: 20, bullet: true });
				slide2.addImage({ path: './images/footer2.PNG', y: 5.12, w: 10, h: 0.5 });
				slide2.addImage({ path: './images/line.PNG', w: 9.5, x: 0.4, y: 0.2, h: 0.1 });

				var slide3 = pptx.addNewSlide();
				slide3.addText("Action items from the previous PMR meet", opts);
				slide3.addImage({ path: './images/footer3.PNG', y: 5.12, w: 10, h: 0.5 });
				slide3.addImage({ path: './images/line.PNG', w: 9.5, x: 0.4, y: 0.2, h: 0.1 });
				var actionRow = [
					[{ text: 'Action Item', opts: { font_size: 18, valign: 'm', align: 'c', bold: true, color: 'ffffff', font_face: 'Arial', fill: '10a8db' } },
					{ text: 'Status', opts: { font_size: 18, valign: 'm', align: 'c', bold: true, color: 'ffffff', font_face: 'Arial', fill: '10a8db' } },
					{ text: 'Remarks', opts: { font_size: 18, valign: 'm', align: 'c', bold: true, color: 'ffffff', font_face: 'Arial', fill: '10a8db' } }]
				];
				var actionTabOpts1 = { x: 0.5, y: 0.8, w: 9 };
				var actionCelOpts1 = {
					font_size: 12, rowH: 0.4, colW: [5, 2, 2], fill: '87CEFA', color: '000000',
					valign: 't', align: 'l', border: { pt: '1', color: 'ffffff' }
				};
				slide3.addTable(actionRow, actionTabOpts1, actionCelOpts1);

				var actionRowsDataArray = [];
				var actionRowsData = responseData.actionRowsData;
				for (var k in actionRowsData) {
					var actionRow = [
						{ text: actionRowsData[k].item },
						{ text: actionRowsData[k].status },
						{ text: actionRowsData[k].remarks }
					];
					actionRowsDataArray.push(actionRow);
					console.log("from response");
					console.log(responseData.actionRowsData);
				}
				var optsOdd = 'cce5f4';
				var actionTabOptsArray = { x: 0.5, y: 1.2, w: 9 };
				var actionCelOpts2 = {
					font_size: 10, rowH: 0.4, colW: [5, 2, 2], color: '000000', font_face: 'Arial', fill: optsOdd,
					valign: 't', align: 'l', border: { pt: '1', color: 'ffffff' }
				};
				slide3.addTable(actionRowsDataArray, actionTabOptsArray, actionCelOpts2);

				var Highlights = {
					"scopusHighlights":
					["New Display rules for citation Benchmarking in Altmetrics page.",
						"New CiteScore widget popup added.",
						"Xabsmetadata SOAP to REST migration."
					],
					"sciencedirectHighlights": ["sciencedirectHighlight1", "sciencedirectHighlight2"],
					"enrichedContentHighlights": ["EnrichedContentHighlight1", "EnrichedContentHighlight2"],
					"spfaeHighlights": ["spf a&e highlight1"],
					"spfcontentHighlights": ["spfcontentHighlight1", "spfcontentHighlight2"],
					"engineeringvillageHighlights": ["evhighlight1", "evhighlight2"]
				};

				var slide4 = pptx.addNewSlide();
				slide4.addImage({ path: './images/line.PNG', w: 9.5, x: 0.4, y: 0.2, h: 0.1 });
				slide4.addText("Project Highlights - RP", { x: 0.4, y: 0.4, font_face: 'Arial (Headings)', font_size: 20, color: '089de3' });
				slide4.addImage({ path: './images/footer4.PNG', y: 5.12, w: 10, h: 0.5 });
				slide4.addText('Scopus', { x: 0.4, y: 0.6, w: '20%', h: 0.38, font_face: 'Verdana', font_size: 8, bold: true, color: '000000', bullet: { code: '2605' } });
				var y1Value = 0.85;
				for (var k in Highlights.scopusHighlights) {
					slide4.addText(Highlights.scopusHighlights[k], { x: 0.8, y: y1Value, w: '40%', font_face: 'Verdana', font_size: 8, bullet: true });
					y1Value = y1Value + 0.25;
				}
				slide4.addText('ScienceDirect', { x: 0.4, y: 2.5, w: '20%', h: 0.38, font_face: 'Verdana', font_size: 8, bold: true, color: '000000', bullet: { code: '2605' } });
				var y2Value = 2.75;
				for (var k in Highlights.sciencedirectHighlights) {
					slide4.addText(Highlights.sciencedirectHighlights[k], { x: 0.8, y: y2Value, w: '40%', font_face: 'Verdana', font_size: 8, bullet: true });
					y2Value = y2Value + 0.25;
				}
				slide4.addText('Enriched Content', { x: 0.4, y: 3.5, w: '20%', h: 0.38, font_face: 'Verdana', font_size: 8, bold: true, color: '000000', bullet: { code: '2605' } });
				var y3Value = 3.75;
				for (var k in Highlights.enrichedContentHighlights) {
					slide4.addText(Highlights.enrichedContentHighlights[k], { x: 0.8, y: y3Value, w: '40%', font_face: 'Verdana', font_size: 8, bullet: true });
					y3Value = y3Value + 0.25;
				}
				slide4.addText('SPF A&E', { x: 0.4, y: 4.5, w: '20%', h: 0.38, font_face: 'Verdana', font_size: 8, bold: true, color: '000000', bullet: { code: '2605' } });
				var y4Value = 4.75;
				for (var k in Highlights.spfaeHighlights) {
					slide4.addText(Highlights.spfaeHighlights[k], { x: 0.8, y: y4Value, w: '40%', font_face: 'Verdana', font_size: 8, bullet: true });
					y4Value = y4Value + 0.25;
				}
				slide4.addText('SPF Content', { x: 5.5, y: 0.6, w: '20%', h: 0.38, font_face: 'Verdana', font_size: 8, bold: true, color: '000000', bullet: { code: '2605' } });
				var y5Value = 0.85;
				for (var k in Highlights.spfcontentHighlights) {
					slide4.addText(Highlights.spfcontentHighlights[k], { x: 5.9, y: y5Value, w: '40%', font_face: 'Verdana', font_size: 8, bullet: true });
					y5Value = y5Value + 0.25;
				}
				slide4.addText('Engineering Village', { x: 5.5, y: 1.8, w: '20%', h: 0.38, font_face: 'Verdana', font_size: 8, bold: true, color: '000000', bullet: { code: '2605' } });
				var y6Value = 2.05;
				for (var k in Highlights.engineeringvillageHighlights) {
					slide4.addText(Highlights.engineeringvillageHighlights[k], { x: 5.9, y: y6Value, w: '40%', font_face: 'Verdana', font_size: 8, bullet: true });
					y6Value = y6Value + 0.25;
				}
				slide4.addText("Milestones and Targets", { x: 5.5, y: 2.8, font_face: 'Arial (Headings)', font_size: 12, color: '089de3', bold: true, valign: 'm', align: 'c', w: '45%', fill: '070719' });
				var milestoneHeadRow = [
					{ text: 'Milestone', opts: { font_size: 8, valign: 'm', rowH: 0.1, align: 'c', bold: true, color: '000000', font_face: 'Arial' } },
					{ text: 'Target Date', opts: { font_size: 8, valign: 'm', rowH: 0.1, align: 'c', bold: true, color: '000000', font_face: 'Arial' } },
					{ text: 'Status', opts: { font_size: 8, valign: 'm', rowH: 0.1, align: 'c', bold: true, color: '000000', font_face: 'Arial' } }
				];
				var milestonesTab = { x: 5.5, y: 3.1, w: 4.5 };
				var milestonesCel = { fill: 'cce5f4', border: { pt: '1', color: '000000' } };
				slide4.addTable(milestoneHeadRow, milestonesTab, milestonesCel);
				var milestonesDataArray = [];
				/*var milestonesData = {"milestone1":{"milestone":"action1", "targetDate":"status1","status":"remarks1"},"milestone2":{"milestone":"action2", "targetDate":"status2","status":"remarks2"}};*/
				var milestonesData = responseData.milestonesData;
				for (var k in milestonesData) {
					var milestoneRow = [
						{ text: milestonesData[k].milestone },
						{ text: milestonesData[k].targetDate },
						{ text: milestonesData[k].status }
					];
					milestonesDataArray.push(milestoneRow);
					console.log(actionRowsDataArray)
				}
				var milestoneOptsArray = { x: 5.5, y: 3.219, w: 4.5 };
				var milestoneCelOpts = {
					font_size: 8, rowH: 0.1, color: '000000', font_face: 'Arial',
					valign: 't', align: 'l', border: { pt: '1', color: '000000' }
				};
				slide4.addTable(milestonesDataArray, milestoneOptsArray, milestoneCelOpts);



				var slide5 = pptx.addNewSlide();
				slide5.addImage({ path: './images/line.PNG', w: 9.5, x: 0.4, y: 0.2, h: 0.1 });
				slide5.addImage({ path: './images/footer5.PNG', y: 5.12, w: 10, h: 0.5 });
				slide5.addText("Sprint Details", { x: 0.4, y: 0.4, font_face: 'Arial (Headings)', font_size: 20, color: '089de3' });
				var sprintDetailsHeadRow = [
					{ text: 'Scrum Team Current sprint' },
					{ text: 'Offshore POC' },
					{ text: 'Onsite POC' },
					{ text: 'n-2', opts: { valign: 'b' } },
					{ text: 'n-1', opts: { valign: 'b' } },
					{ text: 'n', opts: { valign: 'b' } },
					{ text: 'Velocity Improvement % in last 2 sprints' },
					{ text: 'n-2', opts: { valign: 'b' } },
					{ text: 'n-1', opts: { valign: 'b' } },
					{ text: 'n', opts: { valign: 'b' } },
					{ text: 'Remarks' }
				];
				var sprintTab = { x: 0.4, y: 0.8, w: 9.5 };
				var sprintCel = { fill: '10a8db', colW: [1.25, 1.35, 1.1, 0.5, 0.5, 0.5, 0.75, 0.5, 0.5, 0.5, 2.05], valign: 'm', align: 'c', color: 'ffffff', font_size: 10, font_face: 'Calibri', bold: true, border: { pt: '1', color: '000000' } };
				slide5.addTable(sprintDetailsHeadRow, sprintTab, sprintCel);
				var sprintVelocity = [
					{ text: 'Sprint Velocity' }
				];
				var velocityTab = { x: 4.1, y: 0.8, w: 1.5 };
				var velocitycell = { rowH: 0.4, fill: '10a8db', valign: 'm', align: 'c', color: 'ffffff', font_size: 10, font_face: 'Calibri', bold: true, border: { pt: '1', color: '000000' } };
				slide5.addTable(sprintVelocity, velocityTab, velocitycell);
				var sprintVelocityPercent = [
					{ text: 'Commited vs Delivered %' }
				];
				var velocityPercentTab = { x: 6.35, y: 0.8, w: 1.5 };
				var velocitycell = { rowH: 0.4, fill: '10a8db', valign: 'm', align: 'c', color: 'ffffff', font_size: 10, font_face: 'Calibri', bold: true, border: { pt: '1', color: '000000' } };
				slide5.addTable(sprintVelocityPercent, velocityPercentTab, velocitycell);
				var sprintDetailsDataArray = [];
				/*var sprintDetailsData = {"Scopus":{"team":"Scopus","currentSprint":"66", "offshorePOC":"Senthil","onsitePOC":"Saravanan","velocityN":"50","velocityN1":"51","velocityN2":"52","velocityImprovement":"50","cvsdN":"50","cvsdN1":"51","cvsdN2":"52","remarks":"remarksScopus"},
					"ScienceDirect":{"team":"ScienceDirect","currentSprint":"66", "offshorePOC":"Senthil","onsitePOC":"Saravanan","velocityN":"50","velocityN1":"51","velocityN2":"52","velocityImprovement":"50","cvsdN":"50","cvsdN1":"51","cvsdN2":"52","remarks":"sciencedirectRemarks"}
				}*/
				var sprintDetailsData = responseData.sprintDetailsData;
				for (var k in sprintDetailsData) {
					var sprintDetailsRow = [
						{ text: sprintDetailsData[k].team + " - " + sprintDetailsData[k].currentSprint },
						{ text: sprintDetailsData[k].offshorePOC },
						{ text: sprintDetailsData[k].onsitePOC },
						{ text: sprintDetailsData[k].velocityN2 },
						{ text: sprintDetailsData[k].velocityN1 },
						{ text: sprintDetailsData[k].velocityN },
						{ text: sprintDetailsData[k].velocityImprovement },
						{ text: sprintDetailsData[k].cvsdN2 },
						{ text: sprintDetailsData[k].cvsdN1 },
						{ text: sprintDetailsData[k].cvsdN },
						{ text: sprintDetailsData[k].remarks }
					];
					sprintDetailsDataArray.push(sprintDetailsRow);
					console.log(sprintDetailsDataArray)
				}
				var sprintDetailsOptsArray = { x: 0.4, y: 1.485 };
				var sprintdetialsCelOpts = {
					font_size: 10, rowH: 0.5, color: '000000', font_face: 'Arial', colW: [1.25, 1.35, 1.1, 0.5, 0.5, 0.5, 0.75, 0.5, 0.5, 0.5, 2.05],
					valign: 'm', align: 'c', border: { pt: '1', color: '000000' }
				};
				slide5.addTable(sprintDetailsDataArray, sprintDetailsOptsArray, sprintdetialsCelOpts);




				var risk1 = 'Elsevier RP - Context: For SDFE CI migration work the team needs to work on microservices development with latest and greatest technologies (Spring Boot, AWS Lambda, Hystrix, Apache Camel, ReactJS, NodeJS). The team does not have enough knowledge on the technologies. Condition: If the team does not gain knowledge, the risk will surely occur. Consequence: Project failure and revenue loss';
				var slide6 = pptx.addNewSlide();
				slide6.addImage({ path: './images/line.PNG', w: 9.5, x: 0.4, y: 0.2, h: 0.1 });
				slide6.addImage({ path: './images/footer6.PNG', y: 5.12, w: 10, h: 0.5 });
				slide6.addText("Risks & Dependencies", opts);
				var riskRow = [
					[{ text: 'Risk', opts: { font_size: 14, valign: 'm', rowH: 0.2, align: 'c', bold: true, color: 'ffffff', font_face: 'Arial' } },
					{ text: 'MitigationPlan', opts: { font_size: 14, rowH: 0.2, valign: 'm', align: 'c', bold: true, color: 'ffffff', font_face: 'Arial' } },
					{ text: 'Status', opts: { font_size: 14, valign: 'm', rowH: 0.2, align: 'c', bold: true, color: 'ffffff', font_face: 'Arial' } }],
				];
				var riskTabOpts1 = { x: 0.5, y: 0.8, w: 9 };
				var riskCelOpts1 = {
					font_size: 10, rowH: 0.4, colW: [5, 2, 2], fill: '10a8db', color: '000000',
					valign: 't', align: 'l', border: { pt: '1', color: 'ffffff' }
				};
				slide6.addTable(riskRow, riskTabOpts1, riskCelOpts1);
				var riskRows = [];
				var riskRows1 = [
					{ text: 'risk1', opts: { font_size: 10, valign: 't', align: 'l', bold: true, font_face: 'Arial' } },
					{ text: 'mitigation1', opts: { font_size: 10, valign: 't', align: 'l', bold: true, font_face: 'Arial' } },
					{ text: 'status1', opts: { font_size: 10, valign: 'm', align: 'c', bold: true, font_face: 'Arial' } }
				];
				var riskRows2 = [
					{ text: 'risk2', opts: { valign: 't', align: 'l', bold: true, font_face: 'Arial' } },
					{ text: 'mitigation2', opts: { valign: 't', align: 'l', bold: true, font_face: 'Arial' } },
					{ text: 'status2', opts: { valign: 'm', align: 'c', bold: true, font_face: 'Arial' } }
				];
				riskRows.push(riskRows1, riskRows2);
				var riskTabOpts2 = { x: 0.5, y: 1.2, w: 9 };
				var riskCelOpts2 = {
					font_size: 10, rowH: 0.4, colW: [5, 2, 2], fill: '87CEFA', color: '000000',
					valign: 't', align: 'l', border: { pt: '1', color: 'ffffff' }
				};
				slide6.addTable(riskRows, riskTabOpts2, riskCelOpts2);

				var slide7 = pptx.addNewSlide();
				slide7.addImage({ path: './images/lastslide.PNG', w: 10, h: 5.62 });
				alert("1");

				

				var imageContent=graphService.generateGraph();

				alert('imageContent ==' + imageContent);

				console.log("imageContent ====" + imageContent);

				var slide8 = pptx.addNewSlide();
				slide8.addImage({ path: imageContent, w: 10, h: 5.62 });
				pptx.save();


			});

	}
});

app.controller("DeliverablesController", function ($scope, $http) {
	$scope.plotGraph = function () {
		var d3 = Plotly.d3;
		var img_jpg = d3.select('#jpg-export');
		TESTER = document.getElementById('tester');
		Plotly.plot(TESTER, [{
			x: [1, 2, 3, 4, 5],
			y: [1, 2, 4, 8, 16],
		}], {
				margin: { t: 0 }
			}).then(
			function (gd) {
				Plotly.toImage(gd, { height: 300, width: 300 })
					.then(
					function (url) {
						img_jpg.attr("src", url);
						return Plotly.toImage(gd, { format: 'jpeg', height: 400, width: 400 });
					}
					)
			});
		/* Current Plotly.js version */
		console.log(Plotly.BUILD);
	}
});

/*Code for actionItems*/
app.controller('actionCtrl', function ($scope, actionService) {

	$scope.actions = [];
	$scope.action = { item: '', status: '', remarks: '' };
	
	$scope.addAction = function (action) {
		$scope.action.item = '';
		$scope.action.status = '';
		$scope.action.remarks = '';
	}

	$scope.onSubmit = function (action) {
		$scope.data = actionService.postData($scope.actions);
	}

	$scope.onSave = function (action) {
		$scope.actions.push(angular.copy(action));
	}
});


app.controller('riskCtrl', function ($scope, riskService) {

	
	$scope.risks = [];
	$scope.risk = { title: '', mitigation: '', status: '' };
	

	$scope.addRisk = function (risk) {
		$scope.risk.title = '';
		$scope.risk.mitigation = '';
		$scope.risk.status = '';
	}

	$scope.onSubmitRisk = function (risk) {
		$scope.data = actionService.postData($scope.risks);
	}

	$scope.onSaveRisk = function (risk) {
		$scope.risks.push(angular.copy(risk));
	}
});


app.service("actionService", function () {
	this.postData = function (action) {
		return action;
	}
	});
	app.service("actionService", function () {
		this.postRisk = function (risk) {
			return risk;
		}
	});

app.service("graphService", function () {
			this.generateGraph = function () {
alert("U rIn graphService");
				var d3 = Plotly.d3;
				var img_jpg = d3.select('#jpg-export');
				TESTER = document.getElementById('tester');

				var trace1 = {
					x: ['giraffes', 'orangutans', 'monkeys'],
					y: [20, 14, 23],
					name: 'SF Zoo',
					type: 'bar'
				};
alert("U rIn graphService");
				var trace2 = {
					x: ['giraffes', 'orangutans', 'monkeys'],
					y: [12, 18, 29],
					name: 'LA Zoo',
					type: 'bar'
				};
alert("U rIn graphService");
				var data = [trace1, trace2];

				var layout = { barmode: 'group' };

				Plotly.newPlot(TESTER, data, layout).then(
					function (gd) {
						alert("U rIn graphService");
						Plotly.toImage(gd, { height: 300, width: 300 })
							.then(
							function (url) {
								alert("U rIn graphService");
								alert('In Admin controller url' + url);
								return url;
							})
					});









			}

		});
	


