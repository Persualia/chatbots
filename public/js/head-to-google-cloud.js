async function openSlackChannel(data) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "slackchannelinfo": data });
    var requestOptions = {
        mode: 'no-cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://europe-west1-landbot-persualia.cloudfunctions.net/createSlackChannelFromLandbot", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}
/*
async function sendToGoogleSheet(data) {    
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");    
      var raw = JSON.stringify(data);
      var requestOptions = {
        mode: 'no-cors',
        method: 'POST',
        headers: myHeaders,
        body: raw      
      };
  
      fetch("https://europe-west1-landbot-persualia.cloudfunctions.net/sendToGoogleSheet", requestOptions)
      .then(response => response.text())
      .then(result => {
          console.log(result);
          return result;
        })
      .catch(error => console.log('error', error));    
}*/
async function sendToGoogleSheet(data) {
    try {
        var myHeaders = new Headers();
        //myHeaders.append("Content-Type", "application/json");        
        var raw = JSON.stringify(data);
        var requestOptions = {    
            //mode: 'no-cors',              
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        await fetch("https://europe-west1-landbot-persualia.cloudfunctions.net/sendToGoogleSheet", requestOptions).then(response => {
            console.log(JSON.stringify(response));
            return response;
        });        
    } catch (error) {
        console.log('error', error);
    }
}
