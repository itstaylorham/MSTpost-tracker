function countPosts(userName) {
    // Calculate Monday of the current week at 12:00 AM
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    // Select all span elements with id starting with 'author-'
    const authorElements = document.querySelectorAll("span[id^='author-']");
    let count = 0;
    const timestamps = [];
    // Check for tag within each div element
    authorElements.forEach(function(element) {
        if (element.textContent.trim() === userName) {
            // Find the <time> element within the same <div> as the author <span>
            const timeElement = element.closest('div').querySelector('time');
            
            if (timeElement) {
                const timeText = timeElement.textContent.trim();
                const postDate = parseRelativeTime(timeText, now);
                
                if (postDate && postDate >= monday) {
                    count++;
                    timestamps.push(postDate);
                }
            }
        }
    });
    console.log(`${count} posts found by ${userName} since Monday, ${monday.toLocaleDateString()} at 12:00 AM.`);
    // Print the timestamps
    if (timestamps.length > 0) {
        timestamps.sort((a, b) => b - a); // Sort in descending order
        timestamps.forEach(function(timestamp, index) {
            console.log(`${index + 1}: ${formatTimestamp(timestamp)}`);
        });
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

// New function for automatic execution
function autoRunCountPosts(userName) {
    console.log("Auto-run started. Press Ctrl+C to stop.");
    setInterval(() => {
        console.log("\n--- Auto Update ---");
        countPosts(userName);
    }, 3000);
}

const userName = 'Jeremy Barton'; // Your name here

// Uncomment the line below to run automatically every 3 seconds
autoRunCountPosts(userName);

// Comment out the line below if using auto-run
// countPosts(userName);

console.log(`Scroll and run again to find more posts.`);
// Reminder
