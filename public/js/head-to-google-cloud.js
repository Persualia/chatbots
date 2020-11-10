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
function sendToGoogleSheet(data) {
    try {
        var myHeaders = new Headers();        
        var raw = JSON.stringify(data);
        var requestOptions = {                          
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        var request = new Request("https://europe-west1-landbot-persualia.cloudfunctions.net/sendToGoogleSheet", requestOptions);
        fetch(request).then(response => {                                   
            response.json().then(data => {                
                console.log(data);
                return data;
            })            
        });                
    } catch (error) {
        console.log('error', error);
    }
}
