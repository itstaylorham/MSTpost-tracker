var userNames = ['Heather Moore', 'John Smith']; // Your names here, as they appear in Teams

var postsMemory = []; // Array to store posts with their replies
var omittedRepliesCount = 0; // Counter for omitted replies
var omittedRepliesTimestamps = new Set(); // Set to keep track of omitted reply timestamps
var allContentData = []; // Array to store content data for JSON export

function countPosts(userNames) {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    const authorElements = document.querySelectorAll("span[id^='author-']");
    let usersPostCounts = {}; // Track counts per user
    
    userNames.forEach(userName => {
        usersPostCounts[userName] = {
            posts: 0,
            replies: 0,
            omitted: 0
        };
    });
    
    authorElements.forEach(function(element) {
        const currentUserName = element.textContent.trim();
        
        if (userNames.includes(currentUserName)) {
            const authorId = element.getAttribute('id').replace('author-', '');
            const messageBodyElement = document.querySelector(`div[id="message-body-${authorId}"]`);
            
            if (messageBodyElement) {
                const replyText = messageBodyElement.textContent.trim();
                const wordCount = replyText.split(/\s+/).length;
                const timeElement = element.closest('div').querySelector('time');
                
                if (timeElement) {
                    const timeText = timeElement.textContent.trim();
                    const postDate = parseRelativeTime(timeText, now);
                    
                    if (postDate && postDate >= monday) {
                        if (wordCount >= 10) { // Only include replies with more than two words
                            let existingPost = postsMemory.find(post => post.authorId === authorId && post.timestamp.getTime() === postDate.getTime());
                            
                            if (!existingPost) {
                                postsMemory.push({ timestamp: postDate, authorId: authorId, replies: [] });
                                allContentData.push({ timestamp: postDate, authorId: authorId, content: replyText }); // Store content data
                                usersPostCounts[currentUserName].posts++;
                            } else {
                                let existingReply = existingPost.replies.find(reply => reply.timestamp.getTime() === postDate.getTime());
                                
                                if (!existingReply) {
                                    existingPost.replies.push({ timestamp: postDate, authorId: authorId });
                                    allContentData.push({ timestamp: postDate, authorId: authorId, content: replyText }); // Store content data
                                    usersPostCounts[currentUserName].replies++;
                                }
                            }
                        } else {
                            if (!omittedRepliesTimestamps.has(postDate.getTime())) {
                                usersPostCounts[currentUserName].omitted++;
                                omittedRepliesCount++;
                                omittedRepliesTimestamps.add(postDate.getTime()); // Add to omitted timestamps
                            }
                        }
                    }
                }
            }
        }
    });

    // Display results for each user
    userNames.forEach(userName => {
        const totalPosts = usersPostCounts[userName].posts;
        const totalReplies = usersPostCounts[userName].replies;
        const totalPostsAndReplies = totalPosts + totalReplies;

        console.log(`${totalPostsAndReplies} post(s) or reply(s) found by ${userName} since Monday, ${monday.toLocaleDateString()} at 12:00 AM.`);
        console.log(`Omitted short replies for ${userName}: ${usersPostCounts[userName].omitted}`);
    });

    // If there is new content, trigger the JSON download
    if (allContentData.length > 0) {
        downloadContentAsJson(allContentData);
    }

    if (postsMemory.length > 0) {
        const allTimestamps = [];
        postsMemory.forEach(post => {
            allTimestamps.push(post.timestamp);
            post.replies.forEach(reply => {
                allTimestamps.push(reply.timestamp);
            });
        });

        allTimestamps.sort((a, b) => b - a); // Sort in descending order

        allTimestamps.forEach(function(timestamp, index) {
            console.log(`${index + 1}: ${formatTimestamp(timestamp)}`);
        });

        console.log(`Scroll around to find more posts.`);
    } else {
        console.log(`(Nothing found yet)`);
        console.log(`Scroll around to find more posts.`);
    }
}

// Rest of the functions remain unchanged ...

// Auto run (default)
function autoRunCountPosts(userNames) {
    console.log("Auto-run started. Press Ctrl+C to stop.");
    setInterval(() => {
        console.log("\n--- Auto Update ---");
        countPosts(userNames);
    }, 3000);
}

// Uncomment the line below to run automatically every 3 seconds
autoRunCountPosts(userNames);

// Comment out the line below if using auto-run
// countPosts(userNames);
