// whatsapp-reply.js

// 1) Twilio will call this function when a new message arrives
//      "exports.hander" tells Twilio: "this is the entry point"
exports.handler = function (context, event, callback) {
    // 2) load the Twilio helper library provided in the Functions runtime
    const twilio = require("twilio");

    // 3) create a TwiML response object for WhatsApp/SMS replies.
    //      we'll add our reply message to this object.
    const twiml = new twilio.twiml.MessagingResponse();

    // 4) read the text that the user sent
    //      'event.Body' is from Twilio's webhook payload.
    //      || "" means: if it's missing/undefined, use empty string instead.
    function normalize(text) {
        return (text ?? "")
            .trim()
            .toLowerCase(); 
    } 
    const body = normalize(event.Body);




    // 5) other useful fields that Twilio sends us.
    const from = event.From || ""; // sender (WhatsApp number)
    const to = event.To || ""; // receiver (out WhatsApp number)
    const profileName = event.ProfileName || ""; // whatsapp display name
    const numMedia = event.NumMedia || "0"; // how many media files attached?


    const lines = [];
    const MAX_RESULTS = 8;

    // function to normalize text
    function norm(s) {
        return (s ?? "")
            .toLowerCase()
            .split('/').pop()        // drop any path and leading '/'
            .replace(/\.pdf$/i, '')  // drop extension
            .replace(/[^a-z0-9]/g, ''); // remove spaces, underscores, punctuation
    }


    if (body.includes("shit") || body.includes("fuck") || body.includes("WTF") || body.includes("suck")) {
        lines.push("Heyyyyyy - let's be professional shall we? 🫣😆🫠");
        lines.push("");
        lines.push("But here are the results - ");
        lines.push("");
    }
    
    if (body.includes("show") && body.includes("list")) {
        lines.push("Here is the doc that contains a list of SOP for you to look up");
        lines.push("");
        lines.push("You just need to enter keywords on the document name");
        lines.push("");
        lines.push("------------------------");
        lines.push("Name: Monette Farms Master File List");
        lines.push("Link: https://sop-docs-7521.twil.io/Monette_Farms_Master_File_List.pdf");
        lines.push("------------------------");
        lines.push("");
        lines.push("A friendly reminder: The format for requesting the document is");
        lines.push("");
        lines.push("------------------------");
        lines.push("get-keyword");
        lines.push("------------------------");
        lines.push("");

    } else if (body.startsWith("get")&&body.includes("-")) {

        // extract key words
        const keywords = body.split("-")[1]
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

        if (keywords[0] == "") {
            lines.push(`👋 Hi ${profileName}, Please enter at least one keyworde`);
            lines.push("");

        } else {
            // load assets 
            const assets = Runtime.getAssets();
            const metaAsset = assets['/assets_meta.js'];
            const fs = require('fs');
            const manifestRaw = fs.readFileSync(metaAsset.path, 'utf8');
            const manifest = JSON.parse(manifestRaw);
            const intersections = [];
            const unions = [];
            const seen = new Set();       // to keep union items distinct
            let keep_unions = true;

            // iterate through each document to determine the closeness of the each title compared to keywrods
            for (let i = 0; i < manifest.length; i++) {
                const file_name = manifest[i].path;     // e.g., /Monette_Farms_SOP_Seed_Treatment_Inoculant.pdf
                const file_name_match = norm(file_name);
                const display_name = file_name.split('/').pop().replace('Monette_Farms_SOP_', '').replace('.pdf', '').replace(/_/g,' ');  // curate and append only if intersect or union
                const file_url = manifest[i].url;
                let score = 0;

                // iterate through each keyword and determine number of keywords that matched with the title
                for (let j = 0; j < keywords.length; j++) {
                    const kw = norm(keywords[j])
                    if (file_name_match.includes(kw)) {
                        score++; 
                    }  
                }


                if (score === keywords.length) {
                    // if intersect, turn off union for further title searching, push current file to intersect
                    keep_unions = false;
                    intersections.push({
                        name: display_name,
                        url: file_url
                    });

                } else if (score > 0) {
                    // if union, and if there wasn't an intersection before, push current file to union - if there were intersection, no point in computing union
                    if (keep_unions) {
                        const key = file_url;
                        if (seen.has(key)) continue;
                        seen.add(key)
                        unions.push({
                            name: display_name,
                            url: file_url,
                            score: score
                        });

                    }
                }

            }

            // return documents according to intersection or union arrays
            if (keep_unions === false) {
                // this is exact intersection set
                lines.push("We found exact matches to your keywords! ");
                lines.push("");
                lines.push("Here are the results: ");
                lines.push("");
                lines.push("------------------------");
                for (let i = 0; i < intersections.length; i++) {
                    lines.push("");
                    lines.push(`Name: ${intersections[i].name}`);
                    lines.push(`Link: ${intersections[i].url}`);

                }
                lines.push("");
                lines.push("------------------------");

            } else if (unions.length > 0) {
                // this is partial matches
                const unions2 = unions.sort((a, b) => b.score - a.score); // a should come first if a has larger value -> compare function must be negative -> b - a works
                const unions3 = unions2.slice(0, MAX_RESULTS);  // truncate results to avoid unable to respond
                lines.push("We could only find partial matches to your keywords");
                lines.push("");
                lines.push(`We found ${unions.length} matches. Showing ${unions3.length}.`);
                lines.push("");
                lines.push("Here are the docs containing matching keywords, sorting by descending relevancy: ");
                lines.push("");
                lines.push("------------------------");
                for (let i = 0; i < unions3.length; i++) {
                    lines.push("");
                    lines.push(`Name: ${unions3[i].name}`);
                    lines.push(`Link: ${unions3[i].url}`);

                }
                lines.push("");
                lines.push("------------------------");

            } else {
                lines.push("Sorry we couldn't find any SOP documents matching your keywords, please recheck your keywords or ask farm manager for help");
                lines.push("");

            }

        } 


    } else if (body.includes("thank")) {
    
        lines.push(`😊😊 You are very welcome ${profileName}, have a wonderful day!`);
    
    } else {


        lines.push(`👋👋  Hi ${profileName}, Please enter the information in the below format`);
        lines.push("");
        lines.push("To show the full SOP doc list: please send ");
        lines.push("");
        lines.push("------------------------");
        lines.push("show list");
        lines.push("------------------------");
        lines.push("");
        lines.push("To extract docs based on keywords: please send ");
        lines.push("");
        lines.push("------------------------");
        lines.push("get-keyword");
        lines.push("------------------------");
        lines.push("");

    }


    lines.push("");
    lines.push("Consult your manager if search results are insufficient");
    lines.push("");
    lines.push("Safety First, Happy Farming🤝🏆");
    
    // 10) combine all lines into a single string separated by "\n"
    const message = lines.join("\n");

    // 11) add our message to the TwiML response object
    //      twiml.message(...) creates a <Message> in the response
    twiml.message(message);

    // 12) tell Twilio we're done and send the TwiML back.
    //      callback(error, result) - we pass null for error, and 'twiml' as result
    callback(null, twiml);

}; 
