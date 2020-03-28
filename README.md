# 🌏🌎🌍 Epi-Collect

[Website](https://epi-collect.org) • [Slack](https://epi-collect.slack.com) • [Contributors](./CONTRIBUTING.md) 

| Current Milestone                 | Current Researchers|
| ---                               | --- |
| __V0__ ([Roadmap](./ROADMAP.md))  | __0__ ([Become a researcher](./RESEARCHERS.md)) |

[Epi-Collect](https://epi-collect.org) uses [Google Takeout](https://en.wikipedia.org/wiki/Google_Takeout) location data to build a global viral infection [contact tracing](https://www.who.int/features/qa/contact-tracing/en/) dataset.

## Goals

- Establish privacy-respecting [UX best practices](./PRIVACY.md) for location data donation
- Establish a [FOSS dataset standard](./CONTACT_TRACING_DATASET_FORMAT.md) for contact tracing
- Enable researchers to model the spread of COVID-19 with donated data

[Roadmap](./ROADMAP.md)

## Setup

Make sure you have `yarn` and `virtualenv` installed.

```bash
git clone git@github.com:larsmennen/epi-collect.git
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
