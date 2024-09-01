function countPosts(userName) {
    // Select all span elements with id starting with 'author-'
    const authorElements = document.querySelectorAll("span[id^='author-']");
    let count = 0;
    const times = [];

    // Check for tag within each div element
    authorElements.forEach(function(element) {
        if (element.textContent.trim() === userName) {
            count++;
            
            // Find the <time> element within the same <div> as the author <span>
            const timeElement = element.closest('div').querySelector('time');
            
            if (timeElement) {
                times.push(timeElement.textContent.trim());
            }
        }
    });

    console.log(`${userName} posted ${count} times on this page.`);

    // Print the times
    if (times.length > 0) {
        times.forEach(function(time, index) {
            console.log(`${index + 1}: ${time}`);
        });
    } else {
        console.log(`No times found associated with ${userName}.`);
    }
}

userName = 'Jeremy Barton'; // Your name here
countPosts(userName);

console.log(`Scroll up and run again to find more posts.`)
// Reminder
