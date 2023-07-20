import React from 'react';
import 'normalize.css';
import Layout from '@components/layout';
import profilePic from '../../images/profile-pic.jpg';
import MetaOg from '@components/meta-og';
import Meta from '@components/meta';

const getDateDiffInYears = (secondDate: Date, firstDate: Date) => {
  let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
};

const IndexPage = () => {
  const [numYearsHacking, setNumYearsHacking] = React.useState(0);

  React.useEffect(() => {
    setNumYearsHacking(getDateDiffInYears(new Date(2005, 8, 1), new Date()));
  }, [numYearsHacking]);

  return (
    <Layout>
      <section>
        <h1>About me</h1>
        <p>
          <img
            src={profilePic as string}
            alt="Michaux Kelley Profile Pic"
            style={{ float: 'left', width: '150px', marginRight: '1rem', marginBottom: '0.5rem' }}
          />
          Michaux Kelley: a software developer, music lover, player of instruments, modern dude,
          natural-born-world-shaker, aspiring lepidopterist, philatelist, punk, writer, poet, and JavaScript/TypeScript
          hacker.
        </p>
        <p>
          I&apos;ve been in software development for about {numYearsHacking} years now and have coded everything from
          full stack to more recently as a full-on front-end engineer.
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
