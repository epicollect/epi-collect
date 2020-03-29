<div align="center">
	<h1>
		<a href="https://epi-collect.org" rel="noopener" target="_blank">Epi-Collect</a>
	</h1>
	<p>
		Epi-Collect uses location data from <a href="https://en.wikipedia.org/wiki/Google_Takeout" rel="noopener" target="_blank">Google Takeout</a> to build an open source <a href="https://www.who.int/features/qa/contact-tracing/en/" rel="noopener" target="_blank">contact tracing</a> dataset.
	</p>
	<p>
		<a href="https://epi-collect.org" target="_blank" rel="noopener">Website</a>
		• <a href="https://join.slack.com/t/epi-collect/shared_invite/zt-d24uxjzl-7oT5ljZwRc74VMgozPwAqg" target="_blank" rel="noopener">Slack</a>
		• <a href="./ROADMAP.md">Roadmap</a>
		• <a href="./FAQ.md">FAQ</a>
	</p>
</div>


## [Goals](./ROADMAP.md)

| Current Milestone                    | Current Researchers|
| ---                                  | --- |
| __V0__ ([Pre-launch](./ROADMAP.md))  | [Become our first researcher](./RESEARCHERS.md) |


- Establish privacy-respecting [best practices](./PRIVACY.md) for open source data donation
- Establish a [FOSS dataset standard](./CONTACT_TRACING_DATASET_FORMAT.md) for contact tracing
- Enable researchers to model the spread of COVID-19 with donated data

## [Frequently Asked Questions](./FAQ.md)

<details>
<summary>Is my data kept safe and private?</summary>
<br/>
Yes, and we empathize with your concern. The biggest problem with recent contact tracing solutions is that they may be a gateway to surveillance capitalism in the name of public safety. There is a shrinking window of opportunity available today to set a precedent for privacy-respecting contact tracing. As an open source project with all documentation in the open, Epi-Collect is in a unique position to do that. No one has scaled open source data donation before, and we're excited to test its potential.
<br/>
<br/>
  Check out our <a href="./PRIVACY.md">Privacy</a> living document to see how we think about this and how we hope others will too.
</details>

<details>
<summary>Is my data anonymized?</summary>
<br/>
Yes.
  <br/>
  <br/>
  <ul>
    <li>We’ve designed our database such that there is no possible way to associate location data with your identity. If you’re an engineer, you can see our very simple database schema <a href="./epi_collect/api/db.py">here</a>.</li>
    <li>During data ingestion, we ask users to review every data point and delete those that they believe are personally identifiable. We also give hints about what data points may be personally identifiable.</li>
    <li>We do not make the dataset available to a researcher unless they pass certain verification requirements.</li>
  </ul>
Please see our <a href="./PRIVACY.md">Privacy</a> living document for more details.
</details>

<details>
<summary>How do I get access to the data?</summary>
<br/>
Please see our <a href="./RESEARCHERS.md">guidance</a> for researchers.
</details>

[Full FAQ](./FAQ.md)


## Setup

Make sure you have `yarn` and `virtualenv` installed.

```bash
git clone git@github.com:epicollect/epi-collect.git
cd epi-collect
yarn install
virtualenv --python=python3.6 venv
./venv/bin/activate
source ./venv/bin/activate
pip install -r requirements.txt
```

## Run for development

To start:
```bash
make run-dev
export PYTHONPATH="$PWD"
make run-db-local
```

To stop:
```bash
make stop-dev
make stop-db-local
```

If you want to test using the docker containers (which is closer to deployment):
```bash
make build-docker
make run-docker-local
```

## Local and deployment structure

The frontend is built in React with TypeScript.
We use React Bootstrap for the UI.

The backend is built using Flask and uses GeoAlchemy (GIS extension on top of SQLalchemy) to communicate with a PostGIS 
database for persistent storage.

### Local

Locally you can run in two ways:

1. Using `yarn` and `flask` (`make start-dev`), in which case all traffic on `/api` is routed to `flask`.
In this setup, `make run-db-local` will spin up a local PostGIS instance with the correct schema.

2. Using `docker-compose` in which case the same docker containers as in the actual deployment are created, 
but they are span up locally using `docker-compose`. The database doesn't work in this setup.

### Testing

#### Manual

A Google Takeout zip file with location data is located unter `tests/data/sample_location_history.zip`.

#### Automatic

See `tests/test_api.py`.

### Deployment

We deploy using `make deploy` (you need AWS access for this) which builds the following docker containers:

1. `nginx` container to serve the frontend React app.
2. `gunicorn` container to serve the Python backend.

These are pushed to Docker Hub. We then deploy this to AWS Elastic Beanstalk, where we have a `nginx` reverse proxy 
behind AWS' load balancer, which routes all traffic on `/api` to the `gunicorn` container and all other traffic to the 
frontend `nginx` container.

There is also a PostGIS database running in AWS RDS (Postgres with PostGIS extensions enabled).
