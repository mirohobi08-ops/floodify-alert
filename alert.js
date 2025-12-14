const fetch = require("node-fetch");

const WEBHOOK_URL = "https://discord.com/api/webhooks/1449571229567815801/uTbIpf9Sd0EIoqg7Z1ixnYPV9VZe7W-4cSGTldlsPi2Ik2SOBYMzXhr_1nTMHrvUpdg4";
const FLOODIFY_URL = "https://app.floodify.io/api/check-manual-availability";
const COOKIE = "_ga=GA1.1.1815069948.1765682489; _ga_919JHDJR1S=GS2.1.s1765682488$o1$g0$t1765682490$j58$l0$h0; __Host-next-auth.csrf-token=5e1bf0aedb39e68da42c21400b075917e809ae7fc78bf7da252ec40ec04c8d9f%7C9781a44add94355905065864cbdaeca40d1c9a4bc88037543e306d9abad740c1; _hjSessionUser_5309876=eyJpZCI6IjE0NmZmMzMwLTMyMzgtNWY5MS1iODc2LTE1ZGRmMWUyZTVjYiIsImNyZWF0ZWQiOjE3NjU2ODI0OTE3NDMsImV4aXN0aW5nIjpmYWxzZX0=; _hjSession_5309876=eyJpZCI6IjFhMTE0MzE4LTIwY2ItNDUwYS04MGE3LTNkZTM2NzJjMTRkMiIsImMiOjE3NjU2ODI0OTE3NDUsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; __Secure-next-auth.callback-url=https%3A%2F%2Fapp.floodify.io%2Fcreator%2Flogin; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..bAo7OoG-Q1-zKuP3.LVsm5X-a9tVPjpuvkx00RGlyOAJ6bJ29M5nI9_vVQL5UNmlhgiCTB2PFrYYXoKPD-p_ytOJspDRpD_Jyx9l8k2_VenxNw0WF4dl8HbeQJQCGLXEaMa1oScCfDjHUCG1ZCa9WS4GArMrCCz88l_WHREXzd8WZkl1VvA7P_5grHe6RPUkQtxZSFLkix0acZhBz8ip3KqQVJm59TKwwzkJN_VLZb9ezcoAdkAe2VXKKcKU-RZeIg9kvArPbvCA8tvNKoCiPy6-uXC1PMXDWLHolnA-enLbx0Tlkefbd4IPay-AFEbfIwnW_BuCiq0oFdXhwIDEyaDX3SzBvq31upKXRHsbw6VoIWXbpynR-m3hzUOPPn9tUZst8a097Pi8q4E3mitpa3kDmg19pRCmET-Aw5dT9d3T-xMsPObbu9vomDQZzyVU.vwC8VUz1zZKIA1a0eznmRQ";

let lastAvailable = 0;

async function checkFloodify() {
  try {
    const res = await fetch(FLOODIFY_URL, {
      headers: {
        cookie: COOKIE,
        "user-agent": "Mozilla/5.0"
      }
    });

    const data = await res.json();
    const available = data.available_manual_videos || 0;

    if (available > lastAvailable) {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "🚨 **Manual posts available!**",
          embeds: [{
            title: "Floodify Alert",
            fields: [
              { name: "Available Posts", value: String(available), inline: true }
            ],
            timestamp: new Date()
          }]
        })
      });
    }

    lastAvailable = available;
  } catch (err) {
    console.log("Error:", err.message);
  }
}

setInterval(checkFloodify, 15000);
