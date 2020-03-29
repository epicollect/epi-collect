Questions? Reach out on [Slack](https://join.slack.com/t/epi-collect/shared_invite/zt-d24uxjzl-7oT5ljZwRc74VMgozPwAqg)!

| Milestone                         | Active Contributors |
| ---                               | --- |
| [__V0__](./ROADMAP.md#V0)         | Lars Mennen (@larsmennen), Danny Friday (@nessup) |
| [__V1__](./ROADMAP.md#V1)         | Open to contributors |
| [__V2__](./ROADMAP.md#V2)         | Open to contributors |

# V0 [in progress]
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
- [ ] Polish UI
  - [ ] Home page
    - [ ] GIF of user going through steps
    - [ ] Include count of traces in the database
  - [ ] Upload data step
    - [ ] Show the user how to upload via GIFs
    - [ ] Upload progress
      - [ ] Make it go to 95% while backend processes
  - [ ] Review and filter data
    - [ ] Handle case where the user doesn’t have any data in selected period
    - [ ] Polish buttons, map, and timeline
  - [ ] Add symptoms
    - [ ] Emphasize these are WHO questions
    - [ ] Determine what quiz fields should be optional and make them so
  - [ ] Confirmation page
    - [ ] Show all data one more time
    - [ ] Post upload share buttons
      - [ ] Add share buttons
- [ ] Create documentation
  - [ ] Github repo
  - [ ] Home page
  - [ ] Wizard steps
  - [ ] FAQ
  - [ ] Contact tracing data design
  - [ ] Outreach efforts
  - [ ] Contributing guidelines
  - [ ] Privacy best practices
- [ ] Deploy and test on production
- [ ] Allow user to delete their data
  - [ ] Show token
  - [ ] Optionally add an email address and phone number
- [x] Create Slack workspace and link to it
    - [ ] #dataset
    - [ ] #engineers
    - [ ] Workspace greeting
- [ ] Update GitHub organization
- [x] Add Google Analytics
- [x] Add Sentry to frontend and backend
- [ ] Mailchimp mailing list
    - [ ] Add to ingestion confirmation screen as optional
    - [ ] Ensure double opt-in available
- [ ] Find and partner with first scientific user of the dataset
- [ ] Reach out to helpwithcovid.com
- [ ] Remove test data from RDS database
- [ ] Update helpwithcovid.com description

</details>

# V1 [open to contributors]
<details>

<summary>
Expected completion: April 15th, 2020
</summary>
    
<br />
    
- [ ] Make data point editing UI mobile friendly
- [ ] Add pipeline to ingest Facebook location data
- [ ] Unzip Google Takeout locally without uploading

</details>


# V2

<details>
    <summary>Expected completion: May 1st, 2020</summary>

<br />

- [ ] Notify those who are infected or recovering of newly relevant traces
- [ ] Notify those at risk of coming into contact with an infected trace

</details>

# Far future

- [ ] Use homomorphic encryption for privacy-respecting tracing ([more information](https://cryptovillage.org/wp-content/uploads/2019/04/GeoLocation.pdf))
