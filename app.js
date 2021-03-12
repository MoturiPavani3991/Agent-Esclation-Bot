//Require Node Modules
var express = require('express');
var app = express();
var parser = require('body-parser');
var moment = require('moment');
var Cloudant = require('cloudant');
var unirest = require('unirest');
var path = require('path');
var request = require('request');
var server = require('http');
var server = app.listen(8888, function () {
	console.log("--------------------------------------------------------");
	console.log(moment().format('MMMM Do YYYY, hh:mm:ss a') + " | Agent web Server has been started!");
	console.log("--------------------------------------------------------");
});
var io = require('socket.io').listen(server);
var Cloudant = require('cloudant');
var username = '1794b9c7-6d71-4b2b-b1e4-01428cec273d-bluemix';
var password = '7f86125e603ce3229fb6fbfa417210db085a0096bab4df6ff9a088f8216f56f9';
var cloudant = Cloudant({
	account: username,
	password: password
});
var database = cloudant.db.use('agent_details');
var database1 = cloudant.db.use('helpsesk_db')
var fbId;
var resData;
var userData;
var token='EAAIITuagV40BADM9HRCDFwX42i3ZC8JcuJEgLKo2unbmOTTxtVZAwX9L9p8vMGFdQBBD4ipK43ukRM77QCQZBStRAwx278BLlNEZBP6dLcoKPjQiq0wdswQHhcsHQkigUbzZCRIZBerhxw6w3Oj58IcQEtIn8YvLR7wEBHhyVjlgZDZD';
//Initialize the modules




//Initialize Body Parser
app.use(parser.json());
app.use(parser.urlencoded({
	extended: true
}));

//Cloudant Credentials
var username = "1794b9c7-6d71-4b2b-b1e4-01428cec273d-bluemix";
var password = "7f86125e603ce3229fb6fbfa417210db085a0096bab4df6ff9a088f8216f56f9";


//Create Cloudant Connection Instance
var cloudant = Cloudant({
	account: username,
	password: password
});
var users_socket = [];
//Set DB and User ID based on param inputs

var botData=[];
var userdata=[];
var agentName="";

//app.set('views', (__dirname + '/../views'));

//Files 
//app.use(require('express').static(require('path').join('public')));
//accessing public folder
app.use('/', express.static('public'))

//routing agent page
app.get('/', function (req, res) {
	//res.send("agent api");
	res.sendFile(path.join(__dirname + '/public/index.html'));
});


//Handle Button Click Events

	io.on('connection', function (socket) {
		console.log("id",socket.id)
		socket.on('chat message',function(msg1){
	console.log(msg1)//send msg to fb
	loginSend(msg1.fbId, msg1.msg);
	console.log("after Fbuser",msg1.fbId);
})
app.get('/data',function(req,res){
console.log("data fbid",req.query.msg.fbId);
	//console.log("data user",req.query.msg.user);
	console.log("Inside data",req.query.msg);
	//fbId =req.query.msg.fbId
	resData=req.query.msg;
	
	socket.emit('agentMsg',{"userData":resData,"fbId":fbId});
	console.log("After the socket");
	
	
	
	
})
app.get('/service', function (request, response) {
	console.log("Inside service");
	fbId = request.query.id;
	console.log("Connection established",socket.id);
		storeConv(fbId).then((result) => {
			
			getConv(fbId, function (response) {
				console.log("response",JSON.stringify(response.docs[0].conversation));
			socket.join(fbId)
			console.log("rooms",socket.rooms);
				io.sockets.emit("dataSent",{data:response.docs[0].conversation,fbId:fbId,count:1});
						/* var query = {
											"selector": {
												"agentDetails.assignToagent[0].user": {
													"$eq": fbId
												}
											},
											"fields": [
												
											]
										}
							database.find(query,function(err,data){
								if(err){
									console.log(err);
								}	
								else{
									
									console.log(body);
									
								}
								
														
							});	 */		
										
				
				});
		}).catch((error) => {
			console.log(error)
		});

	socket.on('disconnect', () => {

			for (let i = 0; i < users_socket.length; i++) {

				if (users_socket[i].id === socket.id) {
					users_socket.splice(i, 1);
				}
			}
			io.emit('exit', users_socket);
		});

	

});
});

function loginSend(id, text) {
  
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: id
            },
            message: {
                'text': text
            }
        }
    };
    requestFun(dataPost)
}
function requestFun(dataPost) {

    request(dataPost, (error, response, body) => {
        if (error) {
            console.log('Error when we try to sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });

}
function storeConv(query) {

	return new Promise((resolve, reject) => {
		//console.log("=======================  	=================")
		database.list({ include_docs: true }, function (err, data) {
			//console.log(data);
			if (err) {
				reject({
					'status': false,
					'data': err
				});

			}
			else {
				var min,rev,id1,agentName;
				 var userData;
				var agentData = [];
				var minArray = [];
				var index;
				var l1 = data.rows[0].doc.agentDetails.assignToagent.length;
				var l2 = data.rows[1].doc.agentDetails.assignToagent.length;
				var l3 = data.rows[2].doc.agentDetails.assignToagent.length;
				minArray.push(l1);
				minArray.push(l2);
				minArray.push(l3);
				for (i = 0; i < minArray.length; i++) {
					if (min == minArray[i]);
					index = i;

				}
				if(l1==l2 & l1==l3){
                   index=0;
				}
			// 	for(var z=0;z<data.rows.length;z++){
			// 	for (var k = 0; k <= data.rows[i].doc.agentDetails.assignToagent[k].length; k++) {
			// 		agentData[k] = data.rows[i].doc.agentDetails.assignToagent[k];
			// 	}
			// }
				switch (index) {

					case 0:
						rev = data.rows[index].doc._rev;
						id1 = data.rows[index].doc._id;
						agentName = data.rows[index].doc.agentDetails.agentName;
						agentData.push({ "user": query });
					//console.log(agentData);
						userData = {
							"_id": id1,
							"_rev": rev,
							"agentDetails": {
								"agentName": agentName,
								"assignToagent": agentData
							}

						}
						//console.log("userData is " + JSON.stringify(userData.agentDetails.agentName));
						storeData(userData).then((result) => {

							//	console.log("Inside store data  ");
							//console.log("Result in store data" + JSON.stringify(result));
                            resolve({
								'status': true,
								'data': "success"
							});

						});
						break;
					case 1:
						rev = data.rows[index].doc._rev;
						id1 = data.rows[index].doc._id;
						agentName = data.rows[index].doc.agentDetails.agentName;
						agentData.push({ "user": query });
					//	console.log(agentData);
						userData = {
							"_id": id1,
							"_rev": rev,
							"agentDetails": {
								"agentName": agentName,
								"assignToagent": agentData
							}

						}
					//	console.log("userData is " + JSON.stringify(userData.agentDetails.agentName));
						storeData(userData).then((result) => {

							//	console.log("Inside store data  ");
						//	console.log("Result in store data" + JSON.stringify(result));
							resolve({
								'status': true,
								'data': "success"
							});

						});
						break;
					case 2:
						rev = data.rows[index].doc._rev;
						id1 = data.rows[index].doc._id;
						agentName = data.rows[index].doc.agentDetails.agentName;
						agentData.push({ "user": query });
						console.log(agentData);
						userData = {
							"_id": id1,
							"_rev": rev,
							"agentDetails": {
								"agentName": agentName,
								"assignToagent": agentData
							}

						}
						//console.log("userData is " + JSON.stringify(userData.agentDetails.agentName));
						storeData(userData).then((result) => {

							//	console.log("Inside store data  ");
						//	console.log("Result in store data" + JSON.stringify(result));
							resolve({
								'status': true,
								'data': "success"
							});


						});
						break;
				}



			}

		});
	});

}

function storeData(data) {
	return new Promise(function (resolve, reject) {
		database.insert(data, function (err, body) {
			if (err) {
				reject({
					'status': false,
					'data': err
				});
			}
			else {
				resolve({
					'status': true,
					'data': body
				});
			}
		});


	});
}


function getConv(fbid, callback) {
	
	var query = {
		"selector": {
			"fbId": {
				"$eq": fbid
			}
		},
		"fields": [
			"conversation"
		]
	}
	database1.find(query, function (err, result) {
		if (err) {
			callback(err)
		}
		else {
			callback(result)
		}

	})



}




