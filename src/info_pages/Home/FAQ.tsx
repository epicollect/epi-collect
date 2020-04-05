import React from 'react'
import './FAQ.scss'

// TODO: Deduplicate the FAQ by using the FAQ Markdown file in the GH repo.
const FAQ = () => {
  return (
    <ul className="faq">
      <li>
        <details>
          <summary>
            <b>What is contact tracing?</b>
          </summary>
          <br />
          <a
            href="https://www.who.int/features/qa/contact-tracing/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact tracing
          </a>{' '}
          is a way to understand how an infection spreads throughout a population. That information
          can be used to predict future infections and notify those who may be affected.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>What is Epi-Collect?</b>
          </summary>
          <br />
          Epi-Collect is an online tool that converts your Google location data into a format usable
          by researchers who use contact tracing.
          <br />
          <br />
          Epi-Collect is a project made possible by Google’s compliance with the European Union’s
          General Data Protection Regulation. Their implementation of some of the GDPR’s
          requirements is called Google Takeout.
          <br />
          <br />
          Epi-Collect is an MIT licensed open source project, meaning anyone can copy or contribute
          to its source code without our permission.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>Is my data kept safe and private?</b>
          </summary>
          <br />
          Yes, and we empathize with your concern. The biggest problem with recent contact tracing
          solutions is that they may be a gateway to surveillance capitalism in the name of public
          safety. There is a shrinking window of opportunity available today to set a precedent for
          privacy-respecting contact tracing. As an open source project with all documentation in
          the open, Epi-Collect is in a unique position to do that. No one has scaled open source
          data donation before, and we're excited to test its potential.
          <br />
          <br />
          Check out our{' '}
          <a
            href="https://github.com/epicollect/epi-collect/blob/master/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>{' '}
          living document to see how we think about this and how we hope others will too.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>Is this the same as TraceTogether?</b>
          </summary>
          <br />
          TraceTogether is a different project by the government of Singapore.
          <br />
          <br />
          One key difference is that the data created by Epi-Collect is scrubbed by the user for
          personally identifiable information. Another is that we use data from Google Takeout,
          which means we are able to provide tracing information for previous encounters, not just
          future ones.
          <br />
          <br />
          We admire the incredibly quick work they’ve done to implement contact tracing in their
          country. However, we would like to make our data ingestion and usage processes completely
          transparent and community governed.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>Is my data anonymized?</b>
          </summary>
          <br />
          Yes.
          <br />
          <ul>
            <li>
              We’ve designed our database such that there is no possible way to associate location
              data with your identity. If you’re an engineer, you can see our very simple database
              schema{' '}
              <a href="https://github.com/epicollect/epi-collect/blob/master/epi_collect/api/db.py">
                here
              </a>
              .
            </li>
            <li>
              During data ingestion, we ask users to review every data point and delete those that
              they believe are personally identifiable. We also give hints about what data points
              may be personally identifiable.
            </li>
            <li>
              We do not make the dataset available to a researcher unless they pass certain
              verification requirements.
            </li>
          </ul>
          <br />
          Please see our{' '}
          <a
            href="https://github.com/epicollect/epi-collect/blob/master/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>{' '}
          living document for more details.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>How will I know if my data gets used?</b>
          </summary>
          <br />
          Sign up to the mailing list. Note - subscriptions to this mailing list are completely
          independent of submitted data. There is no way we can associate submitted data with your
          email address.
          <br />
          <br />
          Before your data is handed off to a researcher, we send an email to the mailing list
          introducing the researcher and what their goals with the data are. By this point, all
          location data is anonymized. Still, we provide a 24 hour window for users to log in and
          remove their data before it is handed off to the researcher.
          <br />
          <br />
          Once the data is given to the researcher, we check in with the researcher, and share their
          progress with the community.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>How do I remove my data?</b>
          </summary>
          <br />
          You can remove your data at any time, but you *must* have your Trace Password. Your Trace
          Password is a secure password we generate that is provided to you after you confirm your
          data submission. If you chose to have it emailed to you, search for “Trace Password” in
          your email.
          <br />
          <br />
          Once you find your Trace Password, you can enter it{' '}
          <a href="https://epi-collect.org/delete">here</a>.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>Can I see if I’ve crossed paths with SARS-CoV-2?</b>
          </summary>
          <br />
          Not yet, but it is on our{' '}
          <a
            href="https://github.com/epicollect/epi-collect/blob/master/ROADMAP.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            roadmap
          </a>
          .
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>How do I get access to the data?</b>
          </summary>
          <br />
          Please see our{' '}
          <a
            href="https://github.com/epicollect/epi-collect/blob/master/RESEARCHERS.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            document
          </a>{' '}
          for researchers.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>How is the data formatted?</b>
          </summary>
          <br />
          We are not quite sure what the best format is for the dataset yet. If you can help us
          figure this out, please reach out!
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>How can I contribute?</b>
          </summary>
          <br />
          Our{' '}
          <a
            href="https://github.com/epicollect/epi-collect/blob/master/ROADMAP.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            roadmap
          </a>{' '}
          lists ways that individual contributors can get involved.
        </details>
      </li>

      <li>
        <details>
          <summary>
            <b>How can I reach the contributors?</b>
          </summary>
          <br />
          Join the{' '}
          <a
            href="https://join.slack.com/t/epi-collect/shared_invite/zt-d24uxjzl-7oT5ljZwRc74VMgozPwAqg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Slack workspace
          </a>
          , or email core@epi-collect.org.
        </details>
      </li>
    </ul>
  )
}

export default FAQ
