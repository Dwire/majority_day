
function calculateMajorityDate() {
    // Get values from form
    const dob = new Date(document.getElementById('dob').value);
    const dateMet = new Date(document.getElementById('dateMet').value);
    const friendsName = document.getElementById('friendsName').value.trim();

    // Validate input
    if (!(dob && dateMet && dob < dateMet)) {
        document.getElementById('result').innerText = "Please make sure the birth date is before the date you met and both dates are valid.";
        return;
    }
    if (!friendsName) {
        document.getElementById('result').innerText = "Please enter your friend's name.";
        return;
    }

    // Time from birth to when you met your friend
    const timeToMeeting = dateMet - dob;

    // Time when you will have known your friend for more than half your life
    const majorityTime = timeToMeeting * 2;

    // Calculate the majority date
    const majorityDate = new Date(dob.getTime() + majorityTime);

    // Calculate age at majority date and time already been friends
    const ageAtMajority = calculateAge(dob, majorityDate);
    const timeBeenFriends = calculateFriendshipDuration(dateMet, new Date());

    // Display the result
    const resultDateStr = majorityDate.toDateString();
    document.getElementById('result').innerHTML = `
      You will have known ${friendsName} for the majority of your life on: ${resultDateStr}
      <br>
      <br>
      <br>
      Other Milestones:
      <br>
      You will be ${ageAtMajority} years old on this day.<br>
      You have already been friends for ${timeBeenFriends} years.
    `;



    // Enable the "Add to Calendar" button and pass the majority date
    const addToCalendarButton = document.getElementById('addToCalendar');
    addToCalendarButton.disabled = false;
    addToCalendarButton.onclick = function() {
        addToCalendar(majorityDate, resultDateStr, friendsName);
    };
    // Enable the "Share to Social" button and pass the majority date
    const shareToSocialButton = document.getElementById('shareToSocial');
    shareToSocialButton.disabled = false;
    shareToSocialButton.onclick = function() {
        share();
    };

    function calculateAge(dob, date) {
        let age = date.getFullYear() - dob.getFullYear();
        const m = date.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && date.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    function calculateFriendshipDuration(dateMet, currentDate) {
        let duration = currentDate.getFullYear() - dateMet.getFullYear();
        const m = currentDate.getMonth() - dateMet.getMonth();
        if (m < 0 || (m === 0 && currentDate.getDate() < dateMet.getDate())) {
            duration--;
        }
        return duration;
    }

}

function addToCalendar(majorityDate, resultDateStr, friendsName) {
    const event = createCalendarEvent(majorityDate, resultDateStr, friendsName);
    const fileName = 'MajorityFriendshipDate.ics';
    downloadICS(event, fileName);
}

function createCalendarEvent(majorityDate, resultDateStr, friendsName) {
    const startDate = formatDate(majorityDate);
    const endDate = formatDate(new Date(majorityDate.getTime() + (60*60*24*1000))); // +1 day for all-day event

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        'UID:' + (new Date().getTime()) + '@example.com',
        'DTSTAMP:' + formatDate(new Date()),
        'DTSTART;VALUE=DATE:' + startDate,
        'DTEND;VALUE=DATE:' + endDate,
        'SUMMARY:Known ' + friendsName + ' for majority of my life',
        'DESCRIPTION:On this day, I have known ' + friendsName + ' for the majority of my life since ' + resultDateStr,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');
}

function formatDate(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0,8);
}

function downloadICS(contents, fileName) {
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(contents);
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName;
    hiddenElement.click();
}




function share() {
    if (navigator.share) {
        navigator.share({
            title: 'Majority Friendship Date',
            text: document.getElementById('result').innerText,
            url: window.location.href  // You can also share a URL.
        }).then(() => {
            console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
        // Fallback for devices that don't support the Web Share API
        alert('Web Share is not supported on this device. Please copy the text manually.');
    }
}
