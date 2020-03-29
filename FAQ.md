# FAQ

<details>
<summary>What is contact tracing?</summary>
<br/>
Contact tracing is a way to understand how an infection spreads throughout a population. That information can be used to predict future infections and notify those who may be affected.
</details>

<details>
<summary>What is Epi-Collect?</summary>
<br/>
Epi-Collect is an online tool that converts your Google location data into a format usable by researchers who use contact tracing.

Epi-Collect is a project made possible by Google’s compliance with the European Union’s General Data Protection Regulation. Their implementation of some of the GDPR’s requirements is called Google Takeout.

Epi-Collect is an MIT licensed open source project, meaning anyone can copy or contribute to its source code without our permission.
</details>

<details>
<summary>Is my data kept safe and private?</summary>
<br/>
Yes, and we empathize with your concern. The biggest problem with recent contact tracing solutions is that they may be a gateway to surveillance capitalism in the name of public safety. There is a shrinking window of opportunity available today to set a precedent for privacy-respecting contact tracing. As an open source project with all documentation in the open, Epi-Collect is in a unique position to do that. Check out our Privacy living document to see how we think about this and how we hope others will too.
</details>

<details>
<summary>Is this the same as TraceTogether?</summary>
<br/>
TraceTogether is a different project by the government of Singapore.

As of this writing, they have announced plans to open source their code, but have not done so yet.

We admire the incredibly quick work they’ve done to implement contact tracing in their country. However, we would like to make our data ingestion and usage processes completely transparent and community governed.
</details>

<details>
<summary>Is my data anonymized?</summary>
<br/>
Yes.

We’ve designed our database such that there is no possible way to associate location data with your identity. If you’re an engineer, you can see our very simple database schema here.
During data ingestion, we ask users to review every data point and delete those that they believe are personally identifiable. We also give hints about what data points may be personally identifiable.
We do not make the dataset available to a researcher unless they pass certain verification requirements.

Please see our Privacy living document for more details.
</details>

<details>
<summary>How will I know if my data gets used?</summary>
<br/>
Sign up to the mailing list. Note - subscriptions to this mailing list are completely independent of submitted data. There is no way we can associate submitted data with your email address.

Before your data is handed off to a researcher, we send an email to the mailing list introducing the researcher and what their goals with the data are. By this point, all location data is anonymized. Still, we provide a 24 hour window for tracers to log in and remove their data before it is handed off to the researcher.

Once the data is given to the researcher, we check in with the researcher and share their updates with the community.
</details>

<details>
<summary>How do I remove my data?</summary>
<br/>
You can remove your data at any time, but you *must* have your Trace Password. Your Trace Password is a secure password we generate that is provided to you after you confirm your data submission. If you chose to have it emailed to you, search for “Trace Password” in your email.

Once you find your Trace Password, you can enter it here.
</details>

<details>
<summary>Can I see if I’ve crossed paths with SARS-CoV-2?</summary>
<br/>
Not yet, but it is on our roadmap.
</details>

## For researchers

<details>
<summary>How do I get access to the data?</summary>
<br/>
Please see our document for researchers here.
</details>

<details>
<summary>How is the data formatted?</summary>
<br/>
We are not quite sure what the best format is for the dataset yet, but you can find our schema here.

Draft of data design document
</details>

## For contributors
<details>
<summary>How can I contribute?</summary>
<br/>
Our roadmap lists ways that individual contributors can get involved.
</details>

<details>
<summary>How can I reach the contributors?</summary>
<br/>
Join the Slack workspace, or email nessup@gmail.com.
</details>
