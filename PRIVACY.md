__This is a WIP__

To our knowledge, no one has scaled open source data donation, especially when it comes to location or symptom data.
There are several ongoing efforts to collect contact tracing data, but they are rife with privacy issues
that will surface in months to years from now.

The best way to resolve these issues proactively is to solve them in the open. It starts with a simple, but
important goal:

<div style="text-align: center;">
  <h3 style="text-align: center;">Give users complete visibility and control over data at all stages.</h3>
</div>

#### What is data visibility?
Data visibility is the ability of the user to see the structure (link to dataset schema) and content (Trace Passwords) of their data.

#### What is data control?
Data control is the ability to decide the lifecycle of their data. Should data exist, or should it not? When a researcher is approved, should the data be used, or should it be withheld?

#### What stages are there?

##### User stages

![User stages](./docs/assets/user-stages.png)

| Stage | Description |
| --- | --- |
| Pre-Ingestion | The user visits the home page, GitHub repo, etc |
| Ingestion | The user enters the ingestion wizard |
| Ingestion > Uploading | The user uploads a zip file |
| Ingestion > Filtering | The user removes personally identifiable data points |
| Ingestion > Answering | The user answers optional questions about symptoms |
| Ingestion > Review | The user reviews all data prior to submission |

##### Researcher stages

![Researcher stages](./docs/assets/researcher-stages.png)

| Stage | Description |
| --- | --- |
| Pre-Vetting | The researcher visits the home page, GitHub repo, etc |
| Vetting | The researcher request access to data via email, and provides proof that they satisfy the requirements. Core contributors review provided proof |
| Accepted | The researcher satisfies the requirements. A message is sent to the community introducing the researcher, describing the research, and providing a 24 hour window to remove data |
| Researching | The researcher gains access to the data |
| Post-Research | The researcher is done using the data |
