async function openSlackChannel(data){

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");    
    console.log(data);

    var raw = JSON.stringify({"slackchannelinfo":data});//JSON.stringify({"account":"persualia","userId":"56063398","botId":"725126","node":"Nkf80ivkn"});

    var requestOptions = {    
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("https://us-central1-landbot-persualia.cloudfunctions.net/createSlackChannelFromLandbot", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}