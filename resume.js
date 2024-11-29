document.addEventListener('DOMContentLoaded', function () {
    // Generate Resume
    document.getElementById('generateResume').addEventListener('click', function () {
        const name = document.getElementById('name').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const number = document.getElementById('number').value.trim();
        const education = document.getElementById('education').value.trim();
        const experience = document.getElementById('experience').value.trim();
        const skills = document.getElementById('skills').value.trim();
        const profilePicInput = document.getElementById('profilePic');
        const resumeOutput = document.getElementById('generatedResume');

        // Check if all fields are filled
        if (!name || !username || !email || !number || !education || !experience || !skills) {
            alert('Please fill out all fields!');
            return;
        }

        // Create FileReader to handle profile picture
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgSrc = event.target.result;

            // Dynamically create the resume content
            resumeOutput.innerHTML = `
                <h2>Resume of ${name}</h2>
                <img src="${imgSrc}" alt="Profile Picture" style="width: 90px; height: 100px; border-radius: 50%; margin-bottom: 15px;">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Number:</strong> ${number}</p>
                <h3>Education</h3>
                <p>${education}</p>
                <h3>Experience</h3>
                <p>${experience}</p>
                <h3>Skills</h3>
                <p>${skills}</p>
            `;
        };

        // Load profile picture or show alert
        if (profilePicInput.files && profilePicInput.files[0]) {
            reader.readAsDataURL(profilePicInput.files[0]);
        } else {
            alert('Please upload a profile picture.');
        }
    });

    
    document.getElementById('downloadResume').addEventListener('click', function () {
        const resumeOutput = document.getElementById('generatedResume');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
    
        // Use html2canvas to ensure full rendering of content
        html2canvas(resumeOutput, {
            scale: 2, // Increase rendering scale for higher resolution
            scrollX: 0, // Prevent clipping in mobile
            scrollY: 0, // Prevent clipping in mobile
            useCORS: true, // Allow cross-origin images if needed
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190; // Set width of image in PDF
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate proportional height
            let heightLeft = imgHeight;
    
            let position = 10; // Initial position
    
            // Add first page
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            // Add additional pages if content overflows
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // Adjust position
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save('resume.pdf');
        }).catch(err => {
            console.error('Error generating PDF:', err);
            alert('Something went wrong while generating the PDF.');
        });
    });
});    
