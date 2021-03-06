| Milestone                         | Active Contributors |
| ---                               | --- |
| __Pre-Launch__                    | Lars Mennen (@larsmennen), Danny Friday (@nessup) |
| __V2__                            | Open to contributors |

Questions? Reach out on [Slack](https://join.slack.com/t/epi-collect/shared_invite/zt-d24uxjzl-7oT5ljZwRc74VMgozPwAqg)!

# Pre-Launch - In Progress
<details>
    <summary>
        Expected completion: March 29th, 2020
    </summary>
    
<br/>

- [x] Parse location data uploads from Google Takeout
- [x] Allow users to remove location data points using polygons
    - [ ] Fix event listeners on saved polygons give a React warning
- [x] Require recaptcha for submission
- [x] Buy domain name and set up
- [x] When trying to submit on mobile show message
- [x] AWS firewall / request filtering
- [x] Enable HTTPS
- [ ] Per page changes
  - [ ] Favicon
  - [ ] Logo
  - [ ] Social share graphic
  - [ ] Home page
    - [ ] Copy
    - [ ] Link to FAQ
    - [ ] GIF of user going through steps
    - [ ] Include count of traces in the database (don't hit DB to save $$$, update manually every day)
  - [ ] Upload data step
    - [ ] Show the user how to upload via GIFs
    - [x] Upload progress
      - [x] Make it go to 95% while backend processes
  - [ ] Review and filter data
    - [x] Handle case where the user doesn’t have any data in selected period
    - [ ] Polish buttons, map, and timeline
  - [ ] Add symptoms
    - [ ] Emphasize these are WHO questions
    - [ ] Determine what quiz fields should be optional and make them so
  - [x] Confirmation page
    - [x] Trace tokens
        - [x] Generate words
        - [x] Store bcrypted token in db
        - [x] Deliver to client via REST
        - [x] Optionally send token via SES + add to Mailchimp
    - [ ] Sendgrid mailing list
        - [x] Add to ingestion confirmation screen as optional
        - [ ] Ensure double opt-in available
    - [ ] Show all data one more time
    - [x] Post upload share buttons
      - [x] Add share buttons
  - [x] View Trace Token page
    - [x] Enter token
    - [x] Delete data
- [x] Create documentation
  - [x] Github repo
  - [x] FAQ
  - [ ] Contact tracing data design (backlogged)
  - [ ] Outreach efforts (backlogged)
  - [ ] Contributing guidelines (backlogged)
  - [x] Privacy best practices
- [ ] Deploy and test on production
- [x] Allow user to delete their data
  - [x] Show token
  - [x] Optionally add an email address
- [x] Create Slack workspace and link to it
    - [ ] #dataset
    - [ ] #engineers
    - [ ] Workspace greeting
- [x] Create shared inbox (core@epi-collect.org)
    - [ ] Update links in GH org
    - [ ] Update links in website
    - [ ] Update links in markdown files
    - [x] Update email "From" (note: turned this into "noreply")
- [ ] Update GitHub organization
- [x] Add Google Analytics
- [x] Add Sentry to frontend and backend
- [ ] Find and partner with first scientific user of the dataset
- [ ] Reach out to helpwithcovid.com
- [ ] Remove test data from RDS database
- [ ] Update helpwithcovid.com description

</details>

# V2  - Open To Contributors
<details>

<summary>
Expected completion: April 15th, 2020
</summary>
    
<br />

- [ ] In View Trace Toke page, show data points and quiz answers
- [ ] Make data point editing UI mobile friendly
- [ ] Add pipeline to ingest Facebook location data
- [ ] Unzip Google Takeout locally without uploading
- [ ] Notify those who are infected or recovering of newly relevant traces
- [ ] Notify those at risk of coming into contact with an infected trace
- [ ] Allow user to leave phone number to receive token instead of email

</details>

# Far future

- [ ] Use homomorphic encryption for privacy-respecting tracing ([more information](https://cryptovillage.org/wp-content/uploads/2019/04/GeoLocation.pdf))
