import React from 'react';
import 'normalize.css';
import Layout from '@components/layout';
import profilePic from '../../images/profile-pic.webp';
import MetaOg from '@components/meta-og';
import Meta from '@components/meta';

const getDateDiffInYears = (secondDate: Date, firstDate: Date) => {
  let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
};

const IndexPage = () => {
  const [numYearsFrontEnd, setNumYearsFrontEnd] = React.useState(0);

  React.useEffect(() => {
    setNumYearsFrontEnd(getDateDiffInYears(new Date(2014, 4, 1), new Date()));
  }, [numYearsFrontEnd]);

  return (
    <Layout>
      <section>
        <h1>About me</h1>
        <img
          src={profilePic as string}
          alt="Michaux Kelley Profile Pic"
          width="150"
          height="150"
          style={{ float: 'left', width: '150px', marginRight: '1rem', marginBottom: '0.5rem' }}
        />
        <p>
          I&apos;m Michaux Kelley, and for about {numYearsFrontEnd} years now I&apos;ve been mostly a front-end software
          engineer, developing software primarily with{' '}
          <a href="https://react.dev/" target="react-dev">
            React
          </a>
          , using HTML5, CSS3, JavaScript, and TypeScript to build responsive web apps that scale and support mobile
          devices. Mostly, I just like helping people solve problems in a user-friendly way.
        </p>
        <p>
          Aside from coding, I love music (especially listening to records), play a few instruments, collect stamps,
          read mostly non-fiction, meditate, and write in a notebook.
        </p>
      </section>
    </Layout>
  );
};

const firstName = 'Michaux';
const lastName = 'Kelley';
const mkelley33 = 'mkelley33';
const description =
  'A site and coding blog made for software developers, engineers, and web workers using React, JavaScript, HTML5, CSS3, Node.js';
const title = `${mkelley33} - About ${firstName} ${lastName}`;
const canonicalUrl = `https://${mkelley33}.com`;

export const Head = () => (
  <>
    <Meta title={title} description={description} canonicalUrl={canonicalUrl} />
    <MetaOg
      type={'profile'}
      firstName={'Michaux'}
      lastName={'Kelley'}
      title={title}
      description={description}
      imageSecureUrl={`${canonicalUrl}${profilePic as string}`}
      url={canonicalUrl}
      siteName={`${mkelley33}, coding blog`}
    />
  </>
);

export default IndexPage;
