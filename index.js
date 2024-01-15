var http = require('http');
const Parser = require('rss-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up your email credentials
const emailSender = process.env.EMAIL_SENDER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailReceiver = process.env.EMAIL_RECIVER;

// Create an RSS parser instance
const parser = new Parser();

// URL of the Upwork RSS feed
const upworkRssUrl = process.env.UPWORK_RSS;

// Keep track of the latest job ID
let latestJobId = null;

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host :'smtp.gmail.com',
  secure:false,
  auth: {
    user: emailSender,
    pass: emailPassword,
  },
});

// Function to send an email
async function sendEmail(jobTitle, jobLink) {
    console.log("SEND EMAIL")
  const mailOptions = {
    from: emailSender,
    to: emailReceiver,
    subject: `New Upwork Job: ${jobTitle}`,
    text: `Check out the new job on Upwork:\n${jobTitle}\n${jobLink}`,
  };
console.log(mailOptions);
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }

}

// Function to check Upwork RSS feed
async function checkUpworkFeed() {
    console.log("I AM HERE")
  try {
    // Parse the Upwork RSS feed
    const feed = await parser.parseURL(upworkRssUrl);

    // Check if there are any entries in the feed
    if (feed.items.length > 0) {
      // Get the latest job ID
      console.log(feed.items[0]);
      const currentJobId = feed.items[0].id;

      // Check if a new job has been posted
      if (currentJobId !== latestJobId) {
        latestJobId = currentJobId;

        // Get job details
        const jobTitle = feed.items[0].title;
        const jobLink = feed.items[0].link;

        // Send email
        await sendEmail(jobTitle, jobLink);
      }
    }
  } catch (error) {
    console.error('Error parsing Upwork RSS feed:', error);
  }
}


http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)
    res.write(`Yo!!!!${process.env.PORT}`);
    checkUpworkFeed();
    res.end();
}).listen(process.env.PORT || 3000);


setInterval(checkUpworkFeed, 180000); // 1 hour in milliseconds