// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./' + 'background.js')
        .then(function (registration) {
            console.log('Service worker registered:', registration);
        })
        .catch(function (error) {
            console.log('Service worker registration failed:', error);
        });
}

// Listen for new tab creation
chrome.tabs.onCreated.addListener((tab) => {
    fetchBlockedWebsites(); // Fetch blocked websites from backend
});

// Function to fetch blocked websites from the backend and update Chrome storage
function fetchBlockedWebsites() {
    // Retrieve the token from Chrome storage
    chrome.storage.sync.get('token', (data) => {
        const token = data.token;

        if (!token) {
            console.error('Token not found in Chrome storage');
            return;
        }

        fetch('http://127.0.0.1:3000/blocked_hosts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                const hostnames = data.map(item => item.hostname);
                chrome.storage.local.set({ blockedHostnames: hostnames });
            })
            .catch(error => {
                console.error('Error fetching blocked websites:', error);
            });
    });
}

// Listen for navigation events
chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (details.frameId === 0) {
        const tabId = details.tabId;
        const url = details.url;

        chrome.storage.local.get({
            blockedHostnames: []
        }, (data) => {
            const blockedHostnames = data.blockedHostnames || [];
            const isBlocked = blockedHostnames.some(blockedHostname => {
                const urlObj = new URL(url);
                return urlObj.hostname.toLowerCase() === blockedHostname.toLowerCase(); // Compare only the hostname
            });

            if (isBlocked) {
                chrome.scripting.executeScript({
                    target: {
                        tabId: tabId
                    },
                    files: ['content.js']
                });
            }

            else {
                const startTime = new Date().getTime();
                const timeTrackingId = chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                    if (changeInfo.status === 'complete' && tab.id === tabId) {
                        const endTime = new Date().getTime();
                        const timeSpent = endTime - startTime;
                        // Send the time spent to your server or store it in your database
                        const urlObj = new URL(url);
                        chrome.storage.sync.get('token', (data) => {
                            const token = data.token;
                            if (!token) {
                                console.error('Token not found in Chrome storage');
                                return;
                            }

                            const userData = {
                                "host": urlObj.hostname,
                                "time": timeSpent
                            };

                            fetch('http://127.0.0.1:3000/browsing_times', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}` // Use template literals for better readability
                                },
                                body: JSON.stringify(userData)
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    // console.log(`Time spent on ${hostname} sent to backend: ${timeSpent} ms`);
                                })
                                .catch(error => {
                                    console.error(`Error sending time spent on ${urlObj.hostname} to backend: ${error}`);
                                });

                            chrome.tabs.onUpdated.removeListener(timeTrackingId);
                        });
                    }
                });
            }
        });
    }
}, {
    url: [{
        schemes: ['http', 'https']
    }]
});

// Function to check if a URL is blocked
// This function is not used anymore since we're using the Array.prototype.some method instead
async function isUrlBlocked(tabUrl) {
    const storedBlockedWebsites = await new Promise((resolve) => {
        chrome.storage.local.get('blockedWebsites', (data) => {
            resolve(data.blockedWebsites || []);
        });
    });

    for (const blockedWebsite of storedBlockedWebsites) {
        let blockedUrl = new URL(blockedWebsite);

        // If the URL doesn't have a protocol, prepend "http://"
        if (!blockedUrl.protocol) {
            blockedUrl = new URL(`https://${blockedUrl}`);
        }

        if (tabUrl.startsWith(blockedUrl.toString())) {
            return true;
        }
    }
    return false;
}

// ... other code for tracking browsing time