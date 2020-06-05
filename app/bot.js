const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: "<user>",
    password: "oauth:<token>"
  },
  channels: [
    "<channel>"
  ]
};

let marblesMap = new Map()


// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();
  const user = context["display-name"];
  const isMod = context["mod"];
  const isSubscriber = context["subscriber"];
  const entry = msg.substring("!entry".length).trim()

  console.log("msg:" + msg);

  if (commandName.startsWith("!entry ")) {
    if(!marblesMap.has(user)) {
      marblesMap.set(user, [])
    }

    let entryList = marblesMap.get(user);
    let numEntriesLeft = 0;
    let entryAdded = true;
    if(isSubscriber && entryList.length < 8) {
      entryList.push(entry);
      numEntriesLeft = 8 - entryList.length;
    } else if (entryList.length < 4) {
      entryList.push(entry);
      numEntriesLeft = 4 - entryList.length;
    } else {
      entryAdded = false;
    }

    if (entryAdded) {
      client.say(target, "Enrty from: " + user + "! Number of entries left:" + numEntriesLeft)
    } else {
      client.say(target, "Sorry " + user + ", you have run out of entries!")
    }
  }
}



// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}