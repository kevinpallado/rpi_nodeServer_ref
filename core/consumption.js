const db = require('../connection');

function index(event,data)
{
    var account_id = data.account_id;
    var macAddress = data.macAddress;

    return new Promise((resolve, reject) => {
        switch(event)
        {
            
        }
    });
}