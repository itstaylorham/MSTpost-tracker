function countPosts(userName) {
    // Calculate Monday of the current week at 12:00 AM
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    // Select all span elements with id starting with 'author-'
    const authorElements = document.querySelectorAll("span[id^='author-']");
    let count = 0;
    const times = [];
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
                    times.push(timeText);
                }
            }
        }
    });
    console.log(`${userName} has posted ${count} times since Monday, ${monday.toLocaleDateString()} at 12:00 AM.`);
    // Print the times
    if (times.length > 0) {
        times.forEach(function(time, index) {
            console.log(`${index + 1}: ${time}`);
        });
    } else {
        console.log(`No posts found for ${userName} since Monday.`);
    }
}

function parseRelativeTime(timeText, now) {
    const parts = timeText.split(' ');
    const date = new Date(now);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

 // Specify how to handle 'Yesterday'
    if (timeText.includes('Yesterday')) {
        date.setDate(date.getDate() - 1);
        const [hours, minutes] = parts[1].split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else if (daysOfWeek.includes(parts[0])) {
        const dayIndex = daysOfWeek.indexOf(parts[0]);
        const currentDay = date.getDay();
        let daysToSubtract = currentDay - dayIndex;
        if (daysToSubtract < 0) daysToSubtract += 7;  // Wrap around to previous week
        date.setDate(date.getDate() - daysToSubtract);
        const [time, period] = parts[1].split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, parseInt(minutes), 0, 0);
    } else if (parts.length === 2 && (parts[1] === 'AM' || parts[1] === 'PM')) {
        const [time, period] = parts;
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, parseInt(minutes), 0, 0);
    } else {
        // For other formats, you may need to add more parsing logic
        console.log(`Unrecognized time format: ${timeText}`);
        return null;
    }

    return date;
}

userName = 'Jeremy Barton'; // Your name here
countPosts(userName);
console.log(`Scroll and run again to find more posts.`);
// Reminder
