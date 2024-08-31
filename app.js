// Function to count how many times a user's name appears and print the associated times
function countUserAppearancesWithTimes(userName) {
    // Select all span elements with id starting with 'author-'
    const authorElements = document.querySelectorAll("span[id^='author-']");
    let count = 0;
    const times = [];

    // Loop through each element and check if its text matches the user's name
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

    // Print the count
    console.log(`${userName} appears ${count} times on this page.`);

    // Print the associated times
    if (times.length > 0) {
        console.log(`Times associated with ${userName}:`);
        times.forEach(function(time, index) {
            console.log(`${index + 1}: ${time}`);
        });
    } else {
        console.log(`No times found associated with ${userName}.`);
    }
}

userName = 'Jeremy Barton';
countUserAppearancesWithTimes(userName);
