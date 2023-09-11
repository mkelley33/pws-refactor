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
  const numYearsFrontEnd = getDateDiffInYears(new Date(2014, 4, 1), new Date());
  return (
    <Layout>
      <section>
        <h1>About me</h1>
        <img
          src={profilePic as string}
          alt="Michaux Kelley Profile Pic"
          width="150"
          height="150"
          loading="lazy"
          style={{ float: 'left', width: '150px', marginRight: '1rem', marginBottom: '0.5rem' }}
        />
        <p>
          I&apos;m Michaux Kelley, and for {numYearsFrontEnd} years now I&apos;ve been a front-end software engineer,
          developing software primarily with{' '}
          <a href="https://react.dev/" target="react-dev">
            React
          </a>
          , using HTML5, CSS3, JavaScript, and TypeScript to build responsive web apps that scale and support a variety
          of devices. I enjoy assisting people by solving complex problems in a user-friendly way.
        </p>
        <p>
          Aside from coding, I love listening to music, playing musical instruments, collecting stamps, reading
          non-fiction, meditating, and journaling.
        </p>
        <p>
          You can view the source for this Web site on{' '}
          <a href="https://github.com/mkelley33/pws-refactor" target="github">
            GitHub
          </a>
          .
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
