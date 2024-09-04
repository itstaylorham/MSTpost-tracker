var userName = 'Jeremy Barton'; // Your name here, as it appears in Teams

var postsMemory = []; // Array to store posts with their replies
var omittedRepliesCount = 0; // Counter for omitted replies
var omittedRepliesTimestamps = new Set(); // Set to keep track of omitted reply timestamps

function countPosts(userName) {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    const authorElements = document.querySelectorAll("span[id^='author-']");
    let newPosts = 0;
    let newReplies = 0;

    authorElements.forEach(function(element) {
        if (element.textContent.trim() === userName) {
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
                            // Check if this post or reply has already been added
                            let existingPost = postsMemory.find(post => post.authorId === authorId && post.timestamp.getTime() === postDate.getTime());

                            if (!existingPost) {
                                postsMemory.push({ timestamp: postDate, authorId: authorId, replies: [] });
                                newPosts++;
                            } else {
                                // Check if this specific reply has already been added
                                let existingReply = existingPost.replies.find(reply => reply.timestamp.getTime() === postDate.getTime());
                                
                                if (!existingReply) {
                                    existingPost.replies.push({ timestamp: postDate, authorId: authorId });
                                    newReplies++;
                                }
                            }
                        } else {
                            // Check if this omitted reply has been counted before
                            if (!omittedRepliesTimestamps.has(postDate.getTime())) {
                                omittedRepliesCount++;
                                omittedRepliesTimestamps.add(postDate.getTime()); // Add to omitted timestamps
                            }
                        }
                    }
                }
            }
        }
    });

    // Calculate the total posts and replies
    const totalPosts = postsMemory.length;
    const totalReplies = postsMemory.reduce((acc, post) => acc + post.replies.length, 0);
    const totalPostsAndReplies = totalPosts + totalReplies;

    // Update output to show combined total
    console.log(`${totalPostsAndReplies} post(s) or reply(s) found by ${userName} since Monday, ${monday.toLocaleDateString()} at 12:00 AM.`);
    console.log(`Total posts and replies: ${totalPostsAndReplies}`);
    console.log(`Omitted short replies: ${omittedRepliesCount}`);

    if (totalPosts > 0) {
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

function parseRelativeTime(timeText, now) {
    const parts = timeText.split(' ');
    const date = new Date(now);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (timeText.includes('Yesterday')) {
        date.setDate(date.getDate() - 1);
    } else if (daysOfWeek.includes(parts[0])) {
        const dayIndex = daysOfWeek.indexOf(parts[0]);
        const currentDay = date.getDay();
        let daysToSubtract = currentDay - dayIndex;
        if (daysToSubtract <= 0) daysToSubtract += 7;
        date.setDate(date.getDate() - daysToSubtract);
    }

    const timePart = parts[parts.length - 2] + ' ' + parts[parts.length - 1];
    const [time, period] = timePart.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, parseInt(minutes), 0, 0);

    return date;
}

function formatTimestamp(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${dayName}, ${month}/${day}/${year} ${hours}:${minutes}`;
}

// Auto run (default)
function autoRunCountPosts(userName) {
    console.log("Auto-run started. Press Ctrl+C to stop.");
    setInterval(() => {
        console.log("\n--- Auto Update ---");
        countPosts(userName);
    }, 3000);
}

// Uncomment the line below to run automatically every 3 seconds
autoRunCountPosts(userName);

// Comment out the line below if using auto-run
// countPosts(userName); 